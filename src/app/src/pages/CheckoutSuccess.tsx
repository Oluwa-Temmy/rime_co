import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import { useCart } from "../lib/cart";
import type { Order } from "../lib/types";
import "./CheckoutResult.css";

export function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const paymentIntentId = searchParams.get("payment_intent");
  const redirectStatus = searchParams.get("redirect_status");
  const { clear } = useCart();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState(false);

  const failed = redirectStatus !== null && redirectStatus !== "succeeded";

  useEffect(() => {
    if (!paymentIntentId || failed) {
      if (!paymentIntentId) setError(true);
      return;
    }
    clear();
    api
      .getOrderByPaymentIntent(paymentIntentId)
      .then(setOrder)
      .catch(() => setError(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentIntentId, failed]);

  if (failed) {
    return (
      <section className="container checkout-result">
        <h1>Payment didn't go through</h1>
        <p className="checkout-result__lead">
          Your payment method was declined or the payment couldn't be completed. Your cart is
          still saved if you'd like to try again.
        </p>
        <Link to="/checkout" className="checkout-result__link">
          Back to checkout
        </Link>
      </section>
    );
  }

  return (
    <section className="container checkout-result">
      <h1>Thank you{order ? `, ${order.full_name.split(" ")[0]}` : ""}.</h1>
      <p className="checkout-result__lead">
        Your order has been placed. A confirmation has been sent to your email.
      </p>

      {order && (
        <div className="checkout-result__summary">
          <div className="checkout-result__row checkout-result__row--header">
            <span>Order #{order.id}</span>
            <span>${order.total}</span>
          </div>
          {order.items.map((item, i) => (
            <div key={i} className="checkout-result__row">
              <span>
                {item.quantity} &times; {item.product_name} — {item.pack_label}
              </span>
              <span>${(Number(item.unit_price) * item.quantity - Number(item.discount_amount)).toFixed(2)}</span>
            </div>
          ))}
          {Number(order.discount_total) > 0 && (
            <div className="checkout-result__row checkout-result__row--discount">
              <span>Discount</span>
              <span>−${Number(order.discount_total).toFixed(2)}</span>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="checkout-result__lead">
          We couldn't load your order details, but if you were charged, it went through.
        </p>
      )}

      <Link to="/products" className="checkout-result__link">
        Continue shopping
      </Link>
    </section>
  );
}
