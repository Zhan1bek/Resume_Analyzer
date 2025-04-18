from bson import ObjectId
from rest_framework import generics, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView

from .models import Job, ResumeFile, JobApplication
from .serializers import UserSerializer, JobSerializer, ResumeFileSerializer
from .tasks import analyze_resume_task

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]



class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({"error": "Требуются username и password"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"error": "Пользователь не найден"}, status=status.HTTP_404_NOT_FOUND)

        if not user.check_password(password):
            return Response({"error": "Неверный пароль"}, status=status.HTTP_400_BAD_REQUEST)

        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': user.id,
                'username': user.username,
                'role': user.role
            }
        }, status=status.HTTP_200_OK)



class JobListCreateView(generics.ListCreateAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        if self.request.user.role != 'recruiter':
            raise PermissionDenied("Только рекрутеры могут создавать вакансии.")
        serializer.save(posted_by=self.request.user)



class ResumeUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({"error": "Нет файла 'file' в запросе"}, status=status.HTTP_400_BAD_REQUEST)

        resume_file = ResumeFile.objects.create(user=request.user, file=file_obj)

        file_path = resume_file.file.path
        from .tasks import analyze_resume_task
        analyze_resume_task.delay(file_path, resume_file.id)

        return Response({
            "message": "Резюме загружено. Запущен AI-анализ (NLTK + spaCy)."
        }, status=status.HTTP_200_OK)




from pymongo import MongoClient

class ResumeAnalysisListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        resume_files = ResumeFile.objects.filter(user=request.user).exclude(analysis_mongo_id=None)
        mongo_ids = [ObjectId(f.analysis_mongo_id) for f in resume_files if f.analysis_mongo_id]

        client = MongoClient("mongodb://127.0.0.1:27017/")
        db = client["resume_mongo_db"]
        collection = db["resume_analysis"]
        analyses = list(collection.find({"_id": {"$in": mongo_ids}}))

        for doc in analyses:
            doc["_id"] = str(doc["_id"])

        return Response(analyses, status=status.HTTP_200_OK)



class ApplyView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        job_id = request.data.get('job_id')
        resume_file_id = request.data.get('resume_file_id')  # Новое поле

        if not job_id:
            return Response({"error": "Не указан job_id"}, status=400)

        job = get_object_or_404(Job, id=job_id)

        if request.user.role not in ['jobseeker', 'admin']:
            return Response({"error": "Только соискатель может откликаться"}, status=403)

        if not resume_file_id:
            return Response({"error": "Не указан resume_file_id"}, status=400)

        try:
            resume_file = ResumeFile.objects.get(id=resume_file_id, user=request.user)
        except ResumeFile.DoesNotExist:
            return Response({"error": "Резюме не найдено или не принадлежит вам"}, status=404)

        application = JobApplication.objects.create(
            user=request.user,
            job=job,
            resume_file=resume_file
        )

        return Response({"message": "Резюме отправлено!", "application_id": application.id}, status=201)




class MyResumesView(APIView):
    """
    Возвращает список всех загруженных резюме (ResumeFile) для текущего пользователя.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        resumes = ResumeFile.objects.filter(user=request.user).order_by('-uploaded_at')
        data = []
        for r in resumes:
            data.append({
                'id': r.id,
                'file': r.file.name,
                'uploaded_at': r.uploaded_at
            })
        return Response(data, status=200)




class RecruiterApplicationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role not in ['recruiter', 'admin']:
            return Response({"error": "Нет доступа"}, status=403)

        recruiter_jobs = Job.objects.filter(posted_by=request.user)
        job_ids = recruiter_jobs.values_list('id', flat=True)

        applications = JobApplication.objects.filter(
            job_id__in=job_ids
        ).select_related('job', 'user', 'resume_file')


        # Подключение к MongoDB
        client = MongoClient("mongodb://127.0.0.1:27017/")
        db = client["resume_mongo_db"]
        analysis_col = db["resume_analysis"]

        data = []
        for app in applications:
            analysis_data = {}
            analysis_id = getattr(app.resume_file, 'analysis_mongo_id', None)

            matched_skills = []
            required_skills = app.job.required_skills or []

            if analysis_id:
                try:
                    mongo_doc = analysis_col.find_one({"_id": ObjectId(str(analysis_id))})
                    if mongo_doc:
                        analysis_data = {
                            "id": str(mongo_doc["_id"]),
                            "found_skills": mongo_doc.get("found_skills", []),
                            "missing_skills": mongo_doc.get("missing_skills", [])
                        }
                except Exception as e:
                    analysis_data = {"error": f"Ошибка при получении анализа: {str(e)}"}

            if analysis_data and "found_skills" in analysis_data:
                matched_skills = list(set(required_skills).intersection(set(analysis_data["found_skills"])))

            data.append({
                "application_id": app.id,
                "job_id": app.job.id,
                "job_title": app.job.title,
                "user_id": app.user.id,
                "username": app.user.username,
                "resume_file_id": app.resume_file.id,
                "application_date": app.created_at,
                "required_skills": required_skills,
                "matched_skills": matched_skills,
                "analysis": analysis_data
            })

        return Response(data, status=200)



