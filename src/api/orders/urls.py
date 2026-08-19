from django.urls import path

from .views import (
    CartQuoteView,
    CreatePaymentIntentView,
    OrderByPaymentIntentView,
    StripeConfigView,
    stripe_webhook,
)

urlpatterns = [
    path("stripe-config/", StripeConfigView.as_view(), name="stripe-config"),
    path("quote/", CartQuoteView.as_view(), name="order-quote"),
    path("create-payment-intent/", CreatePaymentIntentView.as_view(), name="order-create-payment-intent"),
    path(
        "by-payment-intent/<str:payment_intent_id>/",
        OrderByPaymentIntentView.as_view(),
        name="order-by-payment-intent",
    ),
    path("stripe/webhook/", stripe_webhook, name="stripe-webhook"),
]
