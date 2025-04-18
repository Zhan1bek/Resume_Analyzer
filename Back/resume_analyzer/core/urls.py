from django.urls import path
from .views import (
    RegisterView,
    LoginView,
    JobListCreateView,
    ResumeUploadView,
    ResumeAnalysisListView, ApplyView, MyResumesView, RecruiterApplicationsView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('jobs/', JobListCreateView.as_view(), name='job_list_create'),
    path('upload-resume/', ResumeUploadView.as_view(), name='upload_resume'),
    path('analysis/', ResumeAnalysisListView.as_view(), name='resume_analysis'),
    path('apply/', ApplyView.as_view(), name='apply'),
    path('my-resumes/', MyResumesView.as_view(), name='my_resumes'),
    path('recruiter/applications/', RecruiterApplicationsView.as_view(), name='recruiter_applications'),
    path('my-resumes/', MyResumesView.as_view(), name='my_resumes'),
]
