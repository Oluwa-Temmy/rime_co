from rest_framework import serializers

from products.models import ProductPack

from .models import Order, OrderItem


class OrderItemInputSerializer(serializers.Serializer):
    pack_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ["product_name", "pack_label", "unit_price", "quantity"]


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
            "created_at",
            "items",
        ]
        read_only_fields = ["id", "status", "total", "created_at"]


class CheckoutInputSerializer(serializers.ModelSerializer):
    """Validates shipping details + cart items, and builds the pending Order + its items.

    Prices are always taken from ProductPack server-side — the client only ever
    sends pack ids and quantities, never prices, so a tampered payload can't
    change what gets charged.
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
        pack_ids = [item["pack_id"] for item in items]
        packs = ProductPack.objects.select_related("product").in_bulk(pack_ids)
        missing = set(pack_ids) - set(packs)
        if missing:
            raise serializers.ValidationError(f"Unknown pack id(s): {sorted(missing)}")
        self._packs = packs
        return items

    def create(self, validated_data):
        items = validated_data.pop("items")
        order = Order.objects.create(**validated_data)
        total = 0
        for item in items:
            pack = self._packs[item["pack_id"]]
            quantity = item["quantity"]
            OrderItem.objects.create(
                order=order,
                product=pack.product,
                pack=pack,
                product_name=pack.product.name,
                pack_label=pack.label,
                unit_price=pack.price,
                quantity=quantity,
            )
            total += pack.price * quantity
        order.total = total
        order.save(update_fields=["total"])
        return order
