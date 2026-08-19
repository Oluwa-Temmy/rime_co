import { useCart } from "../lib/cart";
import type { CartQuote } from "../lib/types";
import placeholderImage from "../assets/product-placeholder.jpg";
import "./OrderSummary.css";

export function OrderSummary({ quote }: { quote: CartQuote | null }) {
  const { lines, subtotal, updateQuantity, changePack, removeLine } = useCart();
  const quoteByPackId = new Map((quote?.items ?? []).map((item) => [item.pack_id, item]));

  const displaySubtotal = quote ? Number(quote.subtotal) : subtotal;
  const displayDiscount = quote ? Number(quote.discount_total) : 0;
  const displayTotal = quote ? Number(quote.total) : subtotal;

  return (
    <div className="order-summary">
      {lines.map((line) => {
        const quoteLine = quoteByPackId.get(line.packId);
        const lineSubtotal = Number(line.unitPrice) * line.quantity;
        const hasDiscount = !!quoteLine && Number(quoteLine.line_discount) > 0;

        return (
          <div key={line.packId} className="order-summary__line">
            <img
              className="order-summary__image"
              src={line.image ?? placeholderImage}
              alt={line.productName}
            />
            <div className="order-summary__info">
              <div className="order-summary__name">{line.productName}</div>
              {line.availablePacks.length > 1 ? (
                <select
                  className="order-summary__pack-select"
                  value={line.packId}
                  onChange={(e) => changePack(line.packId, Number(e.target.value))}
                >
                  {line.availablePacks.map((pack) => (
                    <option key={pack.id} value={pack.id}>
                      {pack.label} — ${pack.price}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="order-summary__pack">{line.packLabel}</div>
              )}
            </div>
            <div className="order-summary__qty">
              <button
                type="button"
                onClick={() => updateQuantity(line.packId, line.quantity - 1)}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span>{line.quantity}</span>
              <button
                type="button"
                onClick={() => updateQuantity(line.packId, line.quantity + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <div className="order-summary__price">
              {hasDiscount ? (
                <>
                  <span className="order-summary__price-original">
                    ${lineSubtotal.toFixed(2)}
                  </span>
                  <span className="order-summary__price-final">
                    ${Number(quoteLine!.line_total).toFixed(2)}
                  </span>
                </>
              ) : (
                <span>${lineSubtotal.toFixed(2)}</span>
              )}
            </div>
            <button
              type="button"
              className="order-summary__remove"
              onClick={() => removeLine(line.packId)}
              aria-label={`Remove ${line.productName}`}
            >
              Remove
            </button>
          </div>
        );
      })}
      <div className="order-summary__totals">
        <div className="order-summary__totals-row">
          <span>Subtotal</span>
          <span>${displaySubtotal.toFixed(2)}</span>
        </div>
        {displayDiscount > 0 && (
          <div className="order-summary__totals-row order-summary__totals-row--discount">
            <span>Discount</span>
            <span>−${displayDiscount.toFixed(2)}</span>
          </div>
        )}
        <div className="order-summary__total">
          <span>Total</span>
          <span>${displayTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
