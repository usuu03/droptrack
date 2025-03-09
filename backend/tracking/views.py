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
from django.conf import settings
from django.shortcuts import redirect
from rest_framework.views import APIView
import requests
from urllib.parse import urlencode
from django.utils import timezone
from datetime import timedelta

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

class EbayAuthURLView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        params = {
            'client_id': settings.EBAY_APP_ID,
            'response_type': 'code',
            'redirect_uri': settings.EBAY_RU_NAME,
            'scope': 'https://api.ebay.com/oauth/api_scope https://api.ebay.com/oauth/api_scope/sell.fulfillment',
        }
        auth_url = f"{settings.EBAY_AUTH_URL}?{urlencode(params)}"
        return Response({'auth_url': auth_url})

class EbayCallbackView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        code = request.query_params.get('code')
        if not code:
            return Response({'error': 'No authorization code provided'}, status=400)

        # Exchange the code for tokens
        token_data = {
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': settings.EBAY_RU_NAME,
        }

        token_response = requests.post(
            settings.EBAY_TOKEN_URL,
            data=token_data,
            auth=(settings.EBAY_APP_ID, settings.EBAY_CERT_ID),
            headers={'Content-Type': 'application/x-www-form-urlencoded'}
        )

        if token_response.status_code != 200:
            return Response({'error': 'Failed to get access token'}, status=400)

        token_info = token_response.json()
        
        # Create or update eBay account
        ebay_account = EbayAccount.objects.create(
            user=request.user,
            account_name=f"eBay Account {request.user.email}",
            auth_token=token_info['access_token'],
            refresh_token=token_info.get('refresh_token'),
            token_expiry=timezone.now() + timedelta(seconds=token_info['expires_in'])
        )

        return redirect(f"{settings.CLIENT_URL}/dashboard?ebay_connected=true")

class RefreshEbayTokenView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        account_id = request.data.get('account_id')
        try:
            account = EbayAccount.objects.get(id=account_id, user=request.user)
            if not account.refresh_token:
                return Response({'error': 'No refresh token available'}, status=400)

            token_data = {
                'grant_type': 'refresh_token',
                'refresh_token': account.refresh_token,
                'scope': 'https://api.ebay.com/oauth/api_scope https://api.ebay.com/oauth/api_scope/sell.fulfillment',
            }

            token_response = requests.post(
                settings.EBAY_TOKEN_URL,
                data=token_data,
                auth=(settings.EBAY_APP_ID, settings.EBAY_CERT_ID),
                headers={'Content-Type': 'application/x-www-form-urlencoded'}
            )

            if token_response.status_code != 200:
                return Response({'error': 'Failed to refresh token'}, status=400)

            token_info = token_response.json()
            account.auth_token = token_info['access_token']
            account.token_expiry = timezone.now() + timedelta(seconds=token_info['expires_in'])
            account.save()

            return Response({'message': 'Token refreshed successfully'})

        except EbayAccount.DoesNotExist:
            return Response({'error': 'Account not found'}, status=404)