from django.contrib import admin

from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ["product", "pack", "product_name", "pack_label", "unit_price", "quantity"]
    can_delete = False


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ["id", "full_name", "email", "status", "total", "created_at"]
    list_filter = ["status"]
    readonly_fields = ["stripe_session_id", "stripe_payment_intent_id", "total", "created_at"]
    inlines = [OrderItemInline]
