from decimal import ROUND_HALF_UP, Decimal

from django.core.exceptions import ValidationError
from django.db.models import Q
from django.utils import timezone

from .models import Promotion, ProductPack

CENT = Decimal("0.01")


def _money(value: Decimal) -> Decimal:
    return value.quantize(CENT, rounding=ROUND_HALF_UP)


def active_promotions():
    now = timezone.now()
    return (
        Promotion.objects.filter(active=True)
        .filter(Q(starts_at__isnull=True) | Q(starts_at__lte=now))
        .filter(Q(ends_at__isnull=True) | Q(ends_at__gte=now))
    )


def calculate_line_discount(pack: ProductPack, quantity: int) -> Decimal:
    """Total discount (not per-unit) for buying `quantity` of `pack`."""
    discount = Decimal("0")
    promos = active_promotions()

    bogo = promos.filter(promo_type=Promotion.PromoType.BOGO, product_id=pack.product_id).first()
    if bogo:
        set_size = bogo.buy_quantity + bogo.get_quantity
        if set_size > 0:
            free_units = (quantity // set_size) * bogo.get_quantity
            discount += pack.price * free_units

    pack_promo = promos.filter(promo_type=Promotion.PromoType.PACK_PERCENT, pack_id=pack.id).first()
    if pack_promo and pack_promo.discount_percent:
        discount += (pack.price * quantity) * (pack_promo.discount_percent / Decimal("100"))

    return _money(discount)


def load_packs_or_raise(items):
    """items: list of {"pack_id": int, "quantity": int}. Returns {pack_id: ProductPack}."""
    pack_ids = [item["pack_id"] for item in items]
    packs = ProductPack.objects.select_related("product").in_bulk(pack_ids)
    missing = set(pack_ids) - set(packs)
    if missing:
        raise ValidationError(f"Unknown pack id(s): {sorted(missing)}")
    return packs


def price_cart(items, packs_by_id):
    """items: list of {"pack_id": int, "quantity": int}.
    packs_by_id: {pack_id: ProductPack}, e.g. from load_packs_or_raise.
    """
    subtotal = Decimal("0")
    discount_total = Decimal("0")
    breakdown = []
    for item in items:
        pack = packs_by_id[item["pack_id"]]
        quantity = item["quantity"]
        line_subtotal = pack.price * quantity
        line_discount = calculate_line_discount(pack, quantity)
        subtotal += line_subtotal
        discount_total += line_discount
        breakdown.append(
            {
                "pack_id": pack.id,
                "quantity": quantity,
                "unit_price": pack.price,
                "line_subtotal": line_subtotal,
                "line_discount": line_discount,
                "line_total": line_subtotal - line_discount,
            }
        )
    return {
        "subtotal": _money(subtotal),
        "discount_total": _money(discount_total),
        "total": _money(subtotal - discount_total),
        "items": breakdown,
    }
