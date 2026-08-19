import type { Product, Promotion } from "./types";

export function describePromotion(promo: Promotion, product: Product): string {
  if (promo.promo_type === "bogo") {
    return promo.buy_quantity === 1 && promo.get_quantity === 1
      ? "Buy 1 Get 1 Free"
      : `Buy ${promo.buy_quantity} Get ${promo.get_quantity} Free`;
  }
  const pack = product.packs.find((p) => p.id === promo.pack);
  const percent = promo.discount_percent ? Number(promo.discount_percent) : 0;
  return `${percent}% off ${pack?.label ?? "select packs"}`;
}
