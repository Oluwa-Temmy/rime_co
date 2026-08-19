import { useState } from "react";
import { useCart } from "../lib/cart";
import type { Product } from "../lib/types";
import "./AddToCart.css";

export function AddToCart({ product, compact = false }: { product: Product; compact?: boolean }) {
  const { addLine } = useCart();
  const packs = product.packs;
  const [packId, setPackId] = useState(packs[0]?.id);
  const [added, setAdded] = useState(false);

  if (packs.length === 0) return null;

  const selectedPack = packs.find((p) => p.id === packId) ?? packs[0];

  function handleAdd(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    addLine(
      {
        productSlug: product.slug,
        productName: product.name,
        packId: selectedPack.id,
        packLabel: selectedPack.label,
        unitPrice: selectedPack.price,
        image: product.image,
        availablePacks: packs,
      },
      1,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className={`add-to-cart ${compact ? "add-to-cart--compact" : ""}`}>
      <select
        className="add-to-cart__select"
        value={selectedPack.id}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => {
          e.stopPropagation();
          setPackId(Number(e.target.value));
        }}
      >
        {packs.map((pack) => (
          <option key={pack.id} value={pack.id}>
            {pack.label} — ${pack.price}
          </option>
        ))}
      </select>
      <button
        type="button"
        className="add-to-cart__button"
        onClick={handleAdd}
        disabled={!product.in_stock}
      >
        {!product.in_stock ? "Sold Out" : added ? "Added" : "Add to Cart"}
      </button>
    </div>
  );
}
