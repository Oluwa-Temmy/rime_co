import { useCart } from "../lib/cart";
import "./OrderSummary.css";

export function OrderSummary() {
  const { lines, subtotal, updateQuantity, changePack, removeLine } = useCart();

  return (
    <div className="order-summary">
      {lines.map((line) => (
        <div key={line.packId} className="order-summary__line">
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
            ${(Number(line.unitPrice) * line.quantity).toFixed(2)}
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
      ))}
      <div className="order-summary__total">
        <span>Total</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
    </div>
  );
}
