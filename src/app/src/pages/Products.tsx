import { useEffect, useState } from "react";
import { ProductCard } from "../components/ProductCard";
import { api } from "../lib/api";
import type { Product, ProductCategory } from "../lib/types";
import "./Products.css";

const CATEGORIES: { label: string; value: ProductCategory | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Still", value: "still" },
  { label: "Sparkling", value: "sparkling" },
  { label: "Mineral", value: "mineral" },
];

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<ProductCategory | "all">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  const visible = filter === "all" ? products : products.filter((p) => p.category === filter);

  return (
    <section className="container products-page">
      <div className="products-page__header">
        <h1>The Collection</h1>
        <div className="products-page__filters">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              className={`products-page__filter ${filter === c.value ? "active" : ""}`}
              onClick={() => setFilter(c.value)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="products-page__empty">Loading…</p>}
      {!loading && visible.length === 0 && (
        <p className="products-page__empty">No water found in this category.</p>
      )}

      <div className="products-page__grid">
        {visible.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
