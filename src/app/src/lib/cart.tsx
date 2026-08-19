import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import type { CartLine } from "./types";

const STORAGE_KEY = "rime-co-cart";

interface CartContextValue {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  addLine: (line: Omit<CartLine, "quantity">, quantity: number) => void;
  updateQuantity: (packId: number, quantity: number) => void;
  changePack: (packId: number, newPackId: number) => void;
  removeLine: (packId: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function loadCart(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartLine[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => loadCart());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines]);

  function addLine(line: Omit<CartLine, "quantity">, quantity: number) {
    setLines((prev) => {
      const existing = prev.find((l) => l.packId === line.packId);
      if (existing) {
        return prev.map((l) =>
          l.packId === line.packId ? { ...l, quantity: l.quantity + quantity } : l,
        );
      }
      return [...prev, { ...line, quantity }];
    });
  }

  function updateQuantity(packId: number, quantity: number) {
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.packId !== packId)
        : prev.map((l) => (l.packId === packId ? { ...l, quantity } : l)),
    );
  }

  function changePack(packId: number, newPackId: number) {
    if (packId === newPackId) return;
    setLines((prev) => {
      const line = prev.find((l) => l.packId === packId);
      if (!line) return prev;
      const newPack = line.availablePacks.find((p) => p.id === newPackId);
      if (!newPack) return prev;

      const existing = prev.find((l) => l.packId === newPackId);
      if (existing) {
        return prev
          .filter((l) => l.packId !== packId)
          .map((l) =>
            l.packId === newPackId ? { ...l, quantity: l.quantity + line.quantity } : l,
          );
      }

      return prev.map((l) =>
        l.packId === packId
          ? { ...l, packId: newPack.id, packLabel: newPack.label, unitPrice: newPack.price }
          : l,
      );
    });
  }

  function removeLine(packId: number) {
    setLines((prev) => prev.filter((l) => l.packId !== packId));
  }

  function clear() {
    setLines([]);
  }

  const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0);
  const subtotal = lines.reduce((sum, l) => sum + Number(l.unitPrice) * l.quantity, 0);

  return (
    <CartContext.Provider
      value={{ lines, itemCount, subtotal, addLine, updateQuantity, changePack, removeLine, clear }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
