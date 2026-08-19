from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator, MinValueValidator, MaxValueValidator
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


class Promotion(models.Model):
    """A discount rule, applied server-side when pricing a cart or order."""

    class PromoType(models.TextChoices):
        BOGO = "bogo", "Buy X Get Y Free"
        PACK_PERCENT = "pack_percent", "Pack Quantity Discount"

    name = models.CharField(max_length=120)
    promo_type = models.CharField(max_length=20, choices=PromoType.choices)
    product = models.ForeignKey(
        Product,
        related_name="promotions",
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        help_text="Buy X Get Y Free: the product this applies to.",
    )
    pack = models.ForeignKey(
        ProductPack,
        related_name="promotions",
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        help_text="Pack Quantity Discount: the specific pack this applies to, e.g. the 4-Pack.",
    )
    buy_quantity = models.PositiveIntegerField(default=1, help_text="Buy X Get Y Free: units to buy.")
    get_quantity = models.PositiveIntegerField(default=1, help_text="Buy X Get Y Free: units given free.")
    discount_percent = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Pack Quantity Discount: percentage off, e.g. 15.00 for 15%.",
    )
    active = models.BooleanField(default=True)
    starts_at = models.DateTimeField(null=True, blank=True)
    ends_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-id"]

    def __str__(self) -> str:
        return self.name

    def clean(self):
        if self.promo_type == self.PromoType.BOGO and not self.product_id:
            raise ValidationError("Buy X Get Y Free promotions require a product.")
        if self.promo_type == self.PromoType.PACK_PERCENT and (
            not self.pack_id or self.discount_percent is None
        ):
            raise ValidationError(
                "Pack Quantity Discount promotions require a pack and a discount percent."
            )
