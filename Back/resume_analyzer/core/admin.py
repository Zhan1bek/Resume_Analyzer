from django.contrib import admin
from .models import User, Job, ResumeFile

admin.site.register(User)
admin.site.register(Job)
admin.site.register(ResumeFile)