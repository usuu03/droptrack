from django.shortcuts import render
import stripe
from django.conf import settings
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

stripe.api_key = settings.STRIPE_SECRET_KEY

class CreateCheckoutSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            checkout_session = stripe.checkout.Session.create(
                client_reference_id=request.user.id,
                customer_email=request.user.email,
                payment_method_types=['card'],
                line_items=[{
                    'price': settings.STRIPE_PRICE_ID,
                    'quantity': 1,
                }],
                mode='subscription',
                success_url=settings.CLIENT_URL + '/dashboard?success=true',
                cancel_url=settings.CLIENT_URL + '/dashboard?canceled=true',
            )
            return JsonResponse({'sessionId': checkout_session.id})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

class SubscriptionWebhookView(APIView):
    def post(self, request):
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )
        except ValueError as e:
            return Response(status=400)
        except stripe.error.SignatureVerificationError as e:
            return Response(status=400)

        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            user_id = session.get('client_reference_id')
            customer_id = session.get('customer')
            subscription_id = session.get('subscription')

            from authentication.models import User
            try:
                user = User.objects.get(id=user_id)
                user.stripe_customer_id = customer_id
                user.subscription_id = subscription_id
                user.is_premium = True
                user.subscription_status = 'active'
                user.save()
            except User.DoesNotExist:
                return Response(status=404)

        elif event['type'] == 'customer.subscription.deleted':
            subscription = event['data']['object']
            try:
                user = User.objects.get(subscription_id=subscription.id)
                user.is_premium = False
                user.subscription_status = 'canceled'
                user.save()
            except User.DoesNotExist:
                return Response(status=404)

        return Response(status=200)

class SubscriptionStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'is_premium': user.is_premium,
            'is_trial_active': user.is_trial_active,
            'trial_end': user.trial_end,
            'subscription_status': user.subscription_status
        })
