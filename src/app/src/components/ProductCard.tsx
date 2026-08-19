import { Link } from "react-router-dom";
import { AddToCart } from "./AddToCart";
import type { Product } from "../lib/types";
import placeholderImage from "../assets/product-placeholder.jpg";
import "./ProductCard.css";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="product-card">
      <Link to={`/products/${product.slug}`} className="product-card__link">
        <div className="product-card__image">
          <img src={product.image ?? placeholderImage} alt={product.name} />
        </div>
        <h3 className="product-card__name">{product.name}</h3>
        <div className="product-card__meta">
          <div className="product-card__meta-col">
            <span className="product-card__meta-label">Type</span>
            <span className="product-card__meta-value">{product.category}</span>
          </div>
          <div className="product-card__meta-col">
            <span className="product-card__meta-label">Source</span>
            <span className="product-card__meta-value">{product.source_origin || "—"}</span>
          </div>
        </div>
      </Link>
      <AddToCart product={product} compact />
    </div>
  );
}
