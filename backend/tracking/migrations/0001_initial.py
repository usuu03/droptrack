# Generated by Django 5.1.7 on 2025-03-09 18:00

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="EbayAccount",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("account_name", models.CharField(max_length=100)),
                ("auth_token", models.TextField()),
                ("is_active", models.BooleanField(default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="BulkUpload",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("file", models.FileField(upload_to="bulk_uploads/")),
                ("total_records", models.IntegerField(default=0)),
                ("processed_records", models.IntegerField(default=0)),
                ("successful_records", models.IntegerField(default=0)),
                ("failed_records", models.IntegerField(default=0)),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("pending", "Pending"),
                            ("processing", "Processing"),
                            ("completed", "Completed"),
                            ("failed", "Failed"),
                        ],
                        default="pending",
                        max_length=20,
                    ),
                ),
                ("error_message", models.TextField(blank=True, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "ebay_account",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="tracking.ebayaccount",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="TrackingConversion",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("ebay_order_id", models.CharField(max_length=100)),
                ("amazon_tracking_number", models.CharField(max_length=100)),
                (
                    "converted_tracking_number",
                    models.CharField(blank=True, max_length=100, null=True),
                ),
                (
                    "original_carrier",
                    models.CharField(
                        choices=[
                            ("amzl", "Amazon Logistics"),
                            ("usps", "USPS"),
                            ("ups", "UPS"),
                            ("fedex", "FedEx"),
                            ("other", "Other"),
                        ],
                        max_length=50,
                    ),
                ),
                (
                    "converted_carrier",
                    models.CharField(
                        blank=True,
                        choices=[
                            ("amzl", "Amazon Logistics"),
                            ("usps", "USPS"),
                            ("ups", "UPS"),
                            ("fedex", "FedEx"),
                            ("other", "Other"),
                        ],
                        max_length=50,
                        null=True,
                    ),
                ),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("pending", "Pending"),
                            ("processing", "Processing"),
                            ("completed", "Completed"),
                            ("failed", "Failed"),
                        ],
                        default="pending",
                        max_length=20,
                    ),
                ),
                ("error_message", models.TextField(blank=True, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "ebay_account",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="tracking.ebayaccount",
                    ),
                ),
            ],
        ),
    ]
