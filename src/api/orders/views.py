import json

import stripe
from django.conf import settings
from django.http import HttpResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from rest_framework import generics, status
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Order
from .serializers import CheckoutInputSerializer, OrderSerializer


class StripeConfigView(APIView):
    def get(self, request):
        return Response({"publishable_key": settings.STRIPE_PUBLISHABLE_KEY})


class CreatePaymentIntentView(APIView):
    def post(self, request):
        if not settings.STRIPE_SECRET_KEY:
            return Response(
                {"detail": "Stripe is not configured on the server yet."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        serializer = CheckoutInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()

        stripe.api_key = settings.STRIPE_SECRET_KEY
        intent = stripe.PaymentIntent.create(
            amount=int(order.total * 100),
            currency="usd",
            automatic_payment_methods={"enabled": True},
            receipt_email=order.email,
            metadata={"order_id": str(order.id)},
        )
        order.stripe_payment_intent_id = intent.id
        order.save(update_fields=["stripe_payment_intent_id"])

        return Response({"client_secret": intent.client_secret, "order_id": order.id})


class OrderByPaymentIntentView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer

    def get_object(self):
        return get_object_or_404(Order, stripe_payment_intent_id=self.kwargs["payment_intent_id"])


@csrf_exempt
def stripe_webhook(request):
    if request.method != "POST":
        return HttpResponseBadRequest()

    payload = request.body
    sig_header = request.headers.get("Stripe-Signature", "")

    try:
        if settings.STRIPE_WEBHOOK_SECRET:
            event = stripe.Webhook.construct_event(payload, sig_header, settings.STRIPE_WEBHOOK_SECRET)
        else:
            event = json.loads(payload)
    except (ValueError, stripe.error.SignatureVerificationError):
        return HttpResponseBadRequest()

    if event["type"] == "payment_intent.succeeded":
        intent = event["data"]["object"]
        try:
            order = Order.objects.get(stripe_payment_intent_id=intent["id"])
        except Order.DoesNotExist:
            return HttpResponse(status=200)
        order.status = Order.Status.PAID
        order.save(update_fields=["status"])

    return HttpResponse(status=200)
