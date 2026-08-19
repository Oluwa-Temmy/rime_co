import "./ShippingOptions.css";

interface ShippingOption {
  id: string;
  label: string;
  eta: string;
  price: number;
}

// Placeholder rates. Replace with live rates fetched from Shippo, generated
// from the shipping address entered above.
const PLACEHOLDER_OPTIONS: ShippingOption[] = [
  { id: "standard", label: "Standard Shipping", eta: "5–7 business days", price: 6.5 },
  { id: "express", label: "Express Shipping", eta: "2–3 business days", price: 18 },
];

export function ShippingOptions({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="shipping-options">
      {PLACEHOLDER_OPTIONS.map((option) => (
        <label key={option.id} className="shipping-options__option">
          <input
            type="radio"
            name="shipping-method"
            value={option.id}
            checked={value === option.id}
            onChange={() => onChange(option.id)}
          />
          <span className="shipping-options__details">
            <span className="shipping-options__label">{option.label}</span>
            <span className="shipping-options__eta">{option.eta}</span>
          </span>
          <span className="shipping-options__price">${option.price.toFixed(2)}</span>
        </label>
      ))}
    </div>
  );
}
