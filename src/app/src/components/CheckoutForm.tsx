import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useCart } from "../lib/cart";
import type { ShippingDetails } from "../lib/types";
import { OrderSummary } from "./OrderSummary";
import "./CheckoutForm.css";

const emptyShipping: ShippingDetails = {
  full_name: "",
  email: "",
  address_line1: "",
  address_line2: "",
  city: "",
  postal_code: "",
  country: "",
};

export function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { lines, subtotal, clear } = useCart();
  const [shipping, setShipping] = useState<ShippingDetails>(emptyShipping);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    elements?.update({ amount: Math.round(subtotal * 100) });
  }, [elements, subtotal]);

  function updateField<K extends keyof ShippingDetails>(key: K, value: string) {
    setShipping((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);
    setError(null);

    const { error: elementsError } = await elements.submit();
    if (elementsError) {
      setError(elementsError.message ?? "Please check your payment details.");
      setSubmitting(false);
      return;
    }

    let clientSecret: string;
    try {
      const result = await api.createPaymentIntent(shipping, lines);
      clientSecret = result.client_secret;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
      return;
    }

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
        payment_method_data: {
          billing_details: { name: shipping.full_name, email: shipping.email },
        },
      },
      redirect: "if_required",
    });

    if (confirmError) {
      setError(confirmError.message ?? "Payment failed. Please try again.");
      setSubmitting(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      clear();
      navigate(`/checkout/success?payment_intent=${paymentIntent.id}`);
    }
    // Otherwise a redirect-based method (e.g. PayPal) is taking the browser
    // to complete authentication and will return via return_url.
  }

  return (
    <form className="checkout-page__grid" onSubmit={handleSubmit}>
      <div className="checkout-shipping">
        <h2>Shipping details</h2>
        <label className="checkout-field">
          <span>Full name</span>
          <input
            value={shipping.full_name}
            onChange={(e) => updateField("full_name", e.target.value)}
            required
          />
        </label>
        <label className="checkout-field">
          <span>Email</span>
          <input
            type="email"
            value={shipping.email}
            onChange={(e) => updateField("email", e.target.value)}
            required
          />
        </label>
        <label className="checkout-field">
          <span>Address</span>
          <input
            value={shipping.address_line1}
            onChange={(e) => updateField("address_line1", e.target.value)}
            required
          />
        </label>
        <label className="checkout-field">
          <span>Apartment, suite, etc. (optional)</span>
          <input
            value={shipping.address_line2}
            onChange={(e) => updateField("address_line2", e.target.value)}
          />
        </label>
        <div className="checkout-field-row">
          <label className="checkout-field">
            <span>City</span>
            <input
              value={shipping.city}
              onChange={(e) => updateField("city", e.target.value)}
              required
            />
          </label>
          <label className="checkout-field">
            <span>Postal code</span>
            <input
              value={shipping.postal_code}
              onChange={(e) => updateField("postal_code", e.target.value)}
              required
            />
          </label>
        </div>
        <label className="checkout-field">
          <span>Country</span>
          <input
            value={shipping.country}
            onChange={(e) => updateField("country", e.target.value)}
            required
          />
        </label>
      </div>

      <div className="checkout-summary">
        <h2>Order summary</h2>
        <OrderSummary />

        <h2 className="checkout-summary__payment-heading">Payment</h2>
        <div className="checkout-payment">
          <PaymentElement />
        </div>

        <button type="submit" className="checkout-pay-button" disabled={!stripe || submitting}>
          {submitting ? "Processing…" : `Pay $${subtotal.toFixed(2)}`}
        </button>
        {error && <p className="checkout-field__error">{error}</p>}
      </div>
    </form>
  );
}
