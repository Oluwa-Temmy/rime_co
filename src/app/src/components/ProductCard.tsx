import { Link } from "react-router-dom";
import { AddToCart } from "./AddToCart";
import type { Product } from "../lib/types";
import "./ProductCard.css";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="product-card">
      <Link to={`/products/${product.slug}`} className="product-card__link">
        <div className="product-card__image">
          {product.image ? (
            <img src={product.image} alt={product.name} />
          ) : (
            <div className="product-card__placeholder" aria-hidden="true" />
          )}
        </div>
        <div className="product-card__category">{product.category}</div>
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__tagline">{product.tagline}</p>
        <div className="product-card__price">
          From ${product.price} &middot; {product.volume_ml}ml
        </div>
      </Link>
      <AddToCart product={product} compact />
    </div>
  );
}
