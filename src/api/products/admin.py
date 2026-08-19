from django.contrib import admin

from .models import Product, ProductPack, Promotion


class ProductPackInline(admin.TabularInline):
    model = ProductPack
    extra = 1


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["name", "category", "price", "in_stock", "is_featured", "sort_order"]
    list_filter = ["category", "in_stock", "is_featured"]
    prepopulated_fields = {"slug": ("name",)}
    inlines = [ProductPackInline]


@admin.register(Promotion)
class PromotionAdmin(admin.ModelAdmin):
    list_display = ["name", "promo_type", "product", "pack", "active"]
    list_filter = ["promo_type", "active"]
