import { Elements } from "@stripe/react-stripe-js";
import type { StripeElementsOptions } from "@stripe/stripe-js";
import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckoutForm } from "../components/CheckoutForm";
import { useCart } from "../lib/cart";
import { getStripe } from "../lib/stripe";
import { buildStripeAppearance } from "../lib/stripeAppearance";
import "./Checkout.css";

export function Checkout() {
  const { lines, subtotal } = useCart();
  const [stripePromise] = useState(() => getStripe());

  if (lines.length === 0) {
    return (
      <section className="container checkout-page checkout-page--empty">
        <h1>Your cart is empty</h1>
        <Link to="/products">Browse the collection</Link>
      </section>
    );
  }

  const options: StripeElementsOptions = {
    mode: "payment",
    amount: Math.round(subtotal * 100),
    currency: "usd",
    appearance: buildStripeAppearance(),
  };

  return (
    <section className="container checkout-page">
      <h1>Checkout</h1>
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm />
      </Elements>
    </section>
  );
}
