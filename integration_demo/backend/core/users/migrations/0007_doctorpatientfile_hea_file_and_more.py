# Generated by Django 5.0.6 on 2024-06-24 21:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0006_doctorpatientfile_echo_diagnosis_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='doctorpatientfile',
            name='hea_file',
            field=models.FileField(blank=True, null=True, upload_to='ecg/input/', verbose_name='ECG_hea'),
        ),
        migrations.AddField(
            model_name='doctorpatientfile',
            name='xyz_file',
            field=models.FileField(blank=True, null=True, upload_to='ecg/input/', verbose_name='ECG_xyz'),
        ),
    ]
