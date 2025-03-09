from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EbayAccountViewSet, TrackingConversionViewSet, BulkUploadViewSet

router = DefaultRouter()
router.register(r'ebay-accounts', EbayAccountViewSet, basename='ebay-account')
router.register(r'tracking-conversions', TrackingConversionViewSet, basename='tracking-conversion')
router.register(r'bulk-uploads', BulkUploadViewSet, basename='bulk-upload')

urlpatterns = router.urls 