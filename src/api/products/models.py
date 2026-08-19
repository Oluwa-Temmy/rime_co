from django.core.validators import FileExtensionValidator
from django.db import models


class Product(models.Model):
    class Category(models.TextChoices):
        STILL = "still", "Still"
        SPARKLING = "sparkling", "Sparkling"
        MINERAL = "mineral", "Mineral"

    name = models.CharField(max_length=120)
    slug = models.SlugField(max_length=140, unique=True)
    tagline = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=20, choices=Category.choices, default=Category.STILL)
    volume_ml = models.PositiveIntegerField(default=750)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    currency = models.CharField(max_length=3, default="USD")
    image = models.ImageField(
        upload_to="products/",
        blank=True,
        null=True,
        validators=[FileExtensionValidator(allowed_extensions=["png", "jpg", "jpeg"])],
    )
    source_origin = models.CharField(max_length=150, blank=True)
    is_featured = models.BooleanField(default=False)
    in_stock = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["sort_order", "name"]

    def __str__(self) -> str:
        return self.name


class ProductPack(models.Model):
    """A purchasable quantity of a product, e.g. Single, 4-Pack, 12-Pack."""

    product = models.ForeignKey(Product, related_name="packs", on_delete=models.CASCADE)
    label = models.CharField(max_length=40)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "quantity"]
        constraints = [
            models.UniqueConstraint(fields=["product", "quantity"], name="unique_product_pack_quantity")
        ]

    def __str__(self) -> str:
        return f"{self.product.name} — {self.label}"
