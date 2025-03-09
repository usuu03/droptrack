from django.urls import path
from .views import (
    EbayAccountViewSet, TrackingConversionViewSet, BulkUploadViewSet,
    EbayAuthURLView, EbayCallbackView, RefreshEbayTokenView
)

urlpatterns = [
    path('ebay-accounts/', EbayAccountViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('ebay-accounts/<int:pk>/', EbayAccountViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'})),
    path('tracking-conversions/', TrackingConversionViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('tracking-conversions/<int:pk>/', TrackingConversionViewSet.as_view({'get': 'retrieve'})),
    path('bulk-uploads/', BulkUploadViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('bulk-uploads/<int:pk>/', BulkUploadViewSet.as_view({'get': 'retrieve'})),
    path('ebay/auth-url/', EbayAuthURLView.as_view(), name='ebay-auth-url'),
    path('ebay/callback/', EbayCallbackView.as_view(), name='ebay-callback'),
    path('ebay/refresh-token/', RefreshEbayTokenView.as_view(), name='ebay-refresh-token'),
] 