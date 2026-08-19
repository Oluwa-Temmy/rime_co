import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AddToCart } from "../components/AddToCart";
import { api } from "../lib/api";
import type { Product } from "../lib/types";
import placeholderImage from "../assets/product-placeholder.jpg";
import "./ProductDetail.css";

export function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setProduct(null);
    setNotFound(false);
    api
      .getProduct(slug)
      .then(setProduct)
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) {
    return (
      <section className="container product-detail__missing">
        <p>We couldn't find that water.</p>
        <Link to="/products">Back to the collection</Link>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="container product-detail__missing">
        <p>Loading…</p>
      </section>
    );
  }

  return (
    <section className="container product-detail">
      <Link to="/products" className="product-detail__back">
        &larr; Back to the collection
      </Link>
      <div className="product-detail__grid">
        <div className="product-detail__image">
          <img src={product.image ?? placeholderImage} alt={product.name} />
        </div>
        <div className="product-detail__info">
          <div className="product-detail__category">{product.category}</div>
          <h1>{product.name}</h1>
          <p className="product-detail__tagline">{product.tagline}</p>
          <p className="product-detail__price">
            ${product.price} {product.currency} &middot; {product.volume_ml}ml
          </p>
          <p className="product-detail__description">{product.description}</p>
          {product.source_origin && (
            <p className="product-detail__origin">Sourced in {product.source_origin}</p>
          )}
          <div className={`product-detail__stock ${product.in_stock ? "in" : "out"}`}>
            {product.in_stock ? "In Stock" : "Currently Unavailable"}
          </div>
          <div className="product-detail__add-to-cart">
            <AddToCart product={product} />
          </div>
        </div>
      </div>
    </section>
  );
}
