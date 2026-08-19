from django.db.models import Q
from rest_framework import serializers

from .models import Product, ProductPack, Promotion
from .pricing import active_promotions


class ProductPackSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductPack
        fields = ["id", "label", "quantity", "price"]


class PromotionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Promotion
        fields = ["id", "name", "promo_type", "pack", "buy_quantity", "get_quantity", "discount_percent"]


class ProductSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True, required=False)
    packs = ProductPackSerializer(many=True, read_only=True)
    promotions = serializers.SerializerMethodField()

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
            "promotions",
        ]

    def get_promotions(self, product):
        pack_ids = [pack.id for pack in product.packs.all()]
        promos = active_promotions().filter(
            Q(promo_type=Promotion.PromoType.BOGO, product_id=product.id)
            | Q(promo_type=Promotion.PromoType.PACK_PERCENT, pack_id__in=pack_ids)
        )
        return PromotionSerializer(promos, many=True).data
