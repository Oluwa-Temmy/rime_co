from rest_framework import serializers

from .models import Product, ProductPack


class ProductPackSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductPack
        fields = ["id", "label", "quantity", "price"]


class ProductSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True, required=False)
    packs = ProductPackSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "slug",
            "tagline",
            "description",
            "category",
            "volume_ml",
            "price",
            "currency",
            "image",
            "source_origin",
            "is_featured",
            "in_stock",
            "packs",
        ]
