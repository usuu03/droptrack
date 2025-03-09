from django.contrib import admin
from .models import EbayAccount, TrackingConversion, BulkUpload

@admin.register(EbayAccount)
class EbayAccountAdmin(admin.ModelAdmin):
    list_display = ('user', 'account_name', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('user__username', 'account_name')

@admin.register(TrackingConversion)
class TrackingConversionAdmin(admin.ModelAdmin):
    list_display = ('ebay_order_id', 'amazon_tracking_number', 'status', 'created_at')
    list_filter = ('status', 'original_carrier', 'converted_carrier', 'created_at')
    search_fields = ('ebay_order_id', 'amazon_tracking_number', 'converted_tracking_number')

@admin.register(BulkUpload)
class BulkUploadAdmin(admin.ModelAdmin):
    list_display = ('ebay_account', 'status', 'total_records', 'successful_records', 'failed_records', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('ebay_account__account_name',)