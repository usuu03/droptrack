from rest_framework import serializers
from .models import EbayAccount, TrackingConversion, BulkUpload

class EbayAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = EbayAccount
        fields = ['id', 'account_name', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class TrackingConversionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrackingConversion
        fields = [
            'id', 'ebay_account', 'ebay_order_id', 'amazon_tracking_number',
            'converted_tracking_number', 'original_carrier', 'converted_carrier',
            'status', 'error_message', 'created_at', 'updated_at'
        ]
        read_only_fields = ['converted_tracking_number', 'converted_carrier', 'status', 'error_message', 'created_at', 'updated_at']

class BulkUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = BulkUpload
        fields = [
            'id', 'ebay_account', 'file', 'total_records', 'processed_records',
            'successful_records', 'failed_records', 'status', 'error_message',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'total_records', 'processed_records', 'successful_records',
            'failed_records', 'status', 'error_message', 'created_at', 'updated_at'
        ] 