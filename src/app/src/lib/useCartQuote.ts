import { useEffect, useState } from "react";
import { api } from "./api";
import type { CartLine, CartQuote } from "./types";

/** Fetches a live, server-computed subtotal/discount/total for the cart's current lines. */
export function useCartQuote(lines: CartLine[]) {
  const [quote, setQuote] = useState<CartQuote | null>(null);

  useEffect(() => {
    if (lines.length === 0) {
      setQuote(null);
      return;
    }
    let active = true;
    api
      .getCartQuote(lines.map((line) => ({ pack_id: line.packId, quantity: line.quantity })))
      .then((data) => {
        if (active) setQuote(data);
      })
      .catch(() => {
        if (active) setQuote(null);
      });
    return () => {
      active = false;
    };
  }, [lines]);

  return quote;
}
