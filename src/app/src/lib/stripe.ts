import { loadStripe, Stripe } from "@stripe/stripe-js";
import { api } from "./api";

let stripePromise: Promise<Stripe | null> | null = null;

/** Fetches the publishable key from the backend and loads Stripe.js once, memoized. */
export function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    stripePromise = api
      .getStripeConfig()
      .then((config) => (config.publishable_key ? loadStripe(config.publishable_key) : null))
      .catch(() => null);
  }
  return stripePromise;
}
