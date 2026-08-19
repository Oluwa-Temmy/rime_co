import { API_BASE_URL } from "../constants";
import type {
  CartLine,
  ContactPayload,
  Order,
  PaymentIntentResponse,
  Product,
  ShippingDetails,
  SiteConfig,
  StripeConfig,
} from "./types";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message = body?.detail ?? body?.items?.[0] ?? `Request to ${path} failed with ${response.status}`;
    throw new Error(message);
  }
  return response.json() as Promise<T>;
}

export const api = {
  getSiteConfig: () => request<SiteConfig>("/site-config/"),
  getProducts: () => request<Product[]>("/products/"),
  getProduct: (slug: string) => request<Product>(`/products/${slug}/`),
  submitContact: (payload: ContactPayload) =>
    request<ContactPayload>("/contact/", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getStripeConfig: () => request<StripeConfig>("/orders/stripe-config/"),
  createPaymentIntent: (shipping: ShippingDetails, items: CartLine[]) =>
    request<PaymentIntentResponse>("/orders/create-payment-intent/", {
      method: "POST",
      body: JSON.stringify({
        ...shipping,
        items: items.map((item) => ({ pack_id: item.packId, quantity: item.quantity })),
      }),
    }),
  getOrderByPaymentIntent: (paymentIntentId: string) =>
    request<Order>(`/orders/by-payment-intent/${paymentIntentId}/`),
};
