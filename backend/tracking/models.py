from django.db import models
from django.contrib.auth.models import User

class EbayAccount(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    account_name = models.CharField(max_length=100)
    auth_token = models.TextField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.account_name}"

class TrackingConversion(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    CARRIER_CHOICES = [
        ('amzl', 'Amazon Logistics'),
        ('usps', 'USPS'),
        ('ups', 'UPS'),
        ('fedex', 'FedEx'),
        ('other', 'Other'),
    ]

    ebay_account = models.ForeignKey(EbayAccount, on_delete=models.CASCADE)
    ebay_order_id = models.CharField(max_length=100)
    amazon_tracking_number = models.CharField(max_length=100)
    converted_tracking_number = models.CharField(max_length=100, blank=True, null=True)
    original_carrier = models.CharField(max_length=50, choices=CARRIER_CHOICES)
    converted_carrier = models.CharField(max_length=50, choices=CARRIER_CHOICES, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    error_message = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.ebay_order_id} - {self.amazon_tracking_number}"

class BulkUpload(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    ebay_account = models.ForeignKey(EbayAccount, on_delete=models.CASCADE)
    file = models.FileField(upload_to='bulk_uploads/')
    total_records = models.IntegerField(default=0)
    processed_records = models.IntegerField(default=0)
    successful_records = models.IntegerField(default=0)
    failed_records = models.IntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    error_message = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.ebay_account.account_name} - {self.created_at}"