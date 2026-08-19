from django.contrib import admin

from .models import Product, ProductPack


class ProductPackInline(admin.TabularInline):
    model = ProductPack
    extra = 1


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["name", "category", "price", "in_stock", "is_featured", "sort_order"]
    list_filter = ["category", "in_stock", "is_featured"]
    prepopulated_fields = {"slug": ("name",)}
    inlines = [ProductPackInline]
