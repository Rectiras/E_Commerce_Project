# Generated by Django 3.1.4 on 2021-05-31 22:00

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('base', '0018_auto_20210509_2109'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='pdfUrl',
            field=models.FileField(blank=True, null=True, upload_to=''),
        ),
        migrations.AddField(
            model_name='order',
            name='ref_code',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AddField(
            model_name='review',
            name='approved',
            field=models.BooleanField(default=False),
        ),
        migrations.CreateModel(
            name='Refund',
            fields=[
                ('createdAt', models.DateTimeField(auto_now_add=True)),
                ('request_message', models.CharField(blank=True, max_length=200, null=True)),
                ('refund_requested', models.BooleanField(default=False)),
                ('refund_granted', models.BooleanField(default=False)),
                ('_id', models.AutoField(editable=False, primary_key=True, serialize=False)),
                ('order', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='base.order')),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]