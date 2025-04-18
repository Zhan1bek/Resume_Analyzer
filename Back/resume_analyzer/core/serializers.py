from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Job, ResumeFile, JobApplication

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'role']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user


class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ['id', 'title', 'description', 'location', 'company_name', 'required_skills', 'posted_by', 'created_at']
        read_only_fields = ['posted_by', 'created_at']


class ResumeFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeFile
        fields = ['id', 'user', 'file', 'uploaded_at']
        read_only_fields = ['user', 'uploaded_at']




class JobApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = ['id', 'user', 'job', 'resume_file', 'created_at']
        read_only_fields = ['user', 'created_at']