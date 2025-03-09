from django.shortcuts import render

# Create your views here.
from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import EbayAccount, TrackingConversion, BulkUpload
from .serializers import EbayAccountSerializer, TrackingConversionSerializer, BulkUploadSerializer
from .tasks import process_tracking_conversion, process_bulk_upload

# Create your views here.

class EbayAccountViewSet(viewsets.ModelViewSet):
    serializer_class = EbayAccountSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return EbayAccount.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TrackingConversionViewSet(viewsets.ModelViewSet):
    serializer_class = TrackingConversionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return TrackingConversion.objects.filter(ebay_account__user=self.request.user)

    def perform_create(self, serializer):
        tracking_conversion = serializer.save()
        process_tracking_conversion.delay(tracking_conversion.id)

    @action(detail=False, methods=['post'])
    def convert_tracking(self, request):
        ebay_account = get_object_or_404(EbayAccount, id=request.data.get('ebay_account'))
        
        if ebay_account.user != request.user:
            return Response(
                {'error': 'You do not have permission to use this eBay account'},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        return Response(serializer.data, status=status.HTTP_202_ACCEPTED)

class BulkUploadViewSet(viewsets.ModelViewSet):
    serializer_class = BulkUploadSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return BulkUpload.objects.filter(ebay_account__user=self.request.user)

    def perform_create(self, serializer):
        bulk_upload = serializer.save()
        process_bulk_upload.delay(bulk_upload.id)

    @action(detail=False, methods=['post'])
    def upload_csv(self, request):
        ebay_account = get_object_or_404(EbayAccount, id=request.data.get('ebay_account'))
        
        if ebay_account.user != request.user:
            return Response(
                {'error': 'You do not have permission to use this eBay account'},
                status=status.HTTP_403_FORBIDDEN
            )

        if 'file' not in request.FILES:
            return Response(
                {'error': 'No file was uploaded'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        return Response(serializer.data, status=status.HTTP_202_ACCEPTED)