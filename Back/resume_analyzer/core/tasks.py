from celery import shared_task

from .models import ResumeFile
from .utils import analyze_resume_text


@shared_task
def analyze_resume_task(file_path, resume_file_id):
    """
        Фоновая задача Celery. Получает путь к файлу резюме и вызывает анализ.
        Возвращает ID документа в MongoDB или словарь.
    """
    mongo_id = analyze_resume_text(file_path)

    try:
        resume = ResumeFile.objects.get(id=resume_file_id)
        resume.analysis_mongo_id = mongo_id
        resume.save()
    except ResumeFile.DoesNotExist:
        pass
