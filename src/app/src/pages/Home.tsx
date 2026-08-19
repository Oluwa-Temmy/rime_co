import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { api } from "../lib/api";
import { useSiteConfig } from "../lib/useSiteConfig";
import type { Product } from "../lib/types";
import heroPlaceholder from "../assets/bottle-placeholder.jpg";
import "./Home.css";

export function Home() {
  const { config } = useSiteConfig();
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    api
      .getProducts()
      .then((products) => setFeatured(products.filter((p) => p.is_featured)))
      .catch(() => setFeatured([]));
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero__media">
          {config.hero_media_type === "video" && config.hero_background_video ? (
            <video
              className="hero__media-el"
              src={config.hero_background_video}
              autoPlay
              muted
              loop
              playsInline
            />
          ) : config.hero_media_type === "image" && config.hero_background_image ? (
            <img className="hero__media-el" src={config.hero_background_image} alt="" />
          ) : (
            <img className="hero__media-el" src={heroPlaceholder} alt="" />
          )}
          <div className="hero__overlay" />
        </div>
        <div className="container hero__inner">
          <p className="hero__eyebrow">{config.tagline}</p>
          <h1 className="hero__headline">{config.hero_headline}</h1>
          <p className="hero__sub">{config.hero_subheadline}</p>
          <Link to="/products" className="hero__cta">
            Explore the Collection
          </Link>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="container featured">
          <div className="featured__header">
            <h2>Featured Waters</h2>
            <Link to="/products" className="featured__link">
              View all
            </Link>
          </div>
          <div className="featured__grid">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      <section className="container about-teaser">
        <h2>{config.about_headline}</h2>
        <p>{config.about_body}</p>
        <Link to="/about" className="about-teaser__link">
          Learn about our sourcing
        </Link>
      </section>
    </>
  );
}
