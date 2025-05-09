# Generated by Django 4.2.20 on 2025-04-03 14:46

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_resumefile_analysis_mongo_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='job',
            name='required_skills',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=50), blank=True, default=list, help_text='Список скиллов, требуемых для этой позиции', size=None),
        ),
    ]
