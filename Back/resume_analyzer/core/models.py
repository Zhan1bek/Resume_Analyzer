from django.contrib.postgres.fields import ArrayField
from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('jobseeker', 'Job Seeker'),
        ('recruiter', 'Recruiter'),
        ('admin', 'Admin'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='jobseeker')

    def __str__(self):
        return f"{self.username} ({self.role})"


class Job(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    location = models.CharField(max_length=255)
    company_name = models.CharField(max_length=255)
    posted_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='jobs')
    created_at = models.DateTimeField(auto_now_add=True)

    required_skills = ArrayField(
        models.CharField(max_length=50),
        blank=True,
        default=list,
        help_text="Список скиллов, требуемых для этой позиции"
    )

    def __str__(self):
        return self.title


class ResumeFile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    file = models.FileField(upload_to='resumes/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    analysis_mongo_id = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return f"ResumeFile: {self.file.name}"



class JobApplication(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    resume_file = models.ForeignKey(ResumeFile, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Application by {self.user.username} for {self.job.title}"
