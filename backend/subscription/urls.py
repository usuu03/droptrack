from django.urls import path
from .views import CreateCheckoutSessionView, SubscriptionWebhookView, SubscriptionStatusView

urlpatterns = [
    path('create-checkout-session/', CreateCheckoutSessionView.as_view(), name='create-checkout-session'),
    path('webhook/', SubscriptionWebhookView.as_view(), name='subscription-webhook'),
    path('status/', SubscriptionStatusView.as_view(), name='subscription-status'),
] 