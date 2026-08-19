from rest_framework import serializers

from products.pricing import load_packs_or_raise, price_cart

from .models import Order, OrderItem


class OrderItemInputSerializer(serializers.Serializer):
    pack_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ["product_name", "pack_label", "unit_price", "quantity", "discount_amount"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "full_name",
            "email",
            "address_line1",
            "address_line2",
            "city",
            "postal_code",
            "country",
            "status",
            "total",
            "discount_total",
            "created_at",
            "items",
        ]
        read_only_fields = ["id", "status", "total", "discount_total", "created_at"]


class CartQuoteInputSerializer(serializers.Serializer):
    """Validates a cart's pack ids + quantities for a live price preview (no order created)."""

    items = OrderItemInputSerializer(many=True)

    def validate_items(self, items):
        if not items:
            raise serializers.ValidationError("Cart is empty.")
        self._packs = load_packs_or_raise(items)
        return items

    def quote(self):
        return price_cart(self.validated_data["items"], self._packs)


class CheckoutInputSerializer(serializers.ModelSerializer):
    """Validates shipping details + cart items, and builds the pending Order + its items.

    Prices and discounts are always computed from ProductPack/Promotion server-side —
    the client only ever sends pack ids and quantities, never prices, so a tampered
    payload can't change what gets charged.
    """

    items = OrderItemInputSerializer(many=True, write_only=True)

    class Meta:
        model = Order
        fields = [
            "full_name",
            "email",
            "address_line1",
            "address_line2",
            "city",
            "postal_code",
            "country",
            "items",
        ]

    def validate_items(self, items):
        if not items:
            raise serializers.ValidationError("Cart is empty.")
        self._packs = load_packs_or_raise(items)
        return items

    def create(self, validated_data):
        items = validated_data.pop("items")
        order = Order.objects.create(**validated_data)
        quote = price_cart(items, self._packs)
        for line in quote["items"]:
            pack = self._packs[line["pack_id"]]
            OrderItem.objects.create(
                order=order,
                product=pack.product,
                pack=pack,
                product_name=pack.product.name,
                pack_label=pack.label,
                unit_price=pack.price,
                quantity=line["quantity"],
                discount_amount=line["line_discount"],
            )
        order.total = quote["total"]
        order.discount_total = quote["discount_total"]
        order.save(update_fields=["total", "discount_total"])
        return order
