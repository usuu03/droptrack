from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from datetime import timedelta

class User(AbstractUser):
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    trial_start = models.DateTimeField(auto_now_add=True)
    trial_end = models.DateTimeField(null=True, blank=True)
    is_premium = models.BooleanField(default=False)
    stripe_customer_id = models.CharField(max_length=100, null=True, blank=True)
    subscription_id = models.CharField(max_length=100, null=True, blank=True)
    subscription_status = models.CharField(max_length=50, default='trial')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email

    def save(self, *args, **kwargs):
        if not self.trial_end:
            self.trial_end = self.trial_start + timedelta(days=14)
        super().save(*args, **kwargs)

    @property
    def is_trial_active(self):
        return timezone.now() <= self.trial_end

    @property
    def can_use_service(self):
        return self.is_premium or self.is_trial_active
