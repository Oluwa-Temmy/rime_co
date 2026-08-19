export type HeroMediaType = "none" | "image" | "video";

export interface SiteConfig {
  site_name: string;
  tagline: string;
  hero_headline: string;
  hero_subheadline: string;
  hero_media_type: HeroMediaType;
  hero_background_image: string | null;
  hero_background_video: string | null;
  about_headline: string;
  about_body: string;
  contact_email: string;
  instagram_url: string;
}

export type ProductCategory = "still" | "sparkling" | "mineral";

export interface ProductPack {
  id: number;
  label: string;
  quantity: number;
  price: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  category: ProductCategory;
  volume_ml: number;
  price: string;
  currency: string;
  image: string | null;
  source_origin: string;
  is_featured: boolean;
  in_stock: boolean;
  packs: ProductPack[];
}

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

export interface CartLine {
  productSlug: string;
  productName: string;
  packId: number;
  packLabel: string;
  unitPrice: string;
  quantity: number;
  image: string | null;
  /** Snapshot of the product's pack options, so checkout can offer switching packs without refetching. */
  availablePacks: ProductPack[];
}

export interface ShippingDetails {
  full_name: string;
  email: string;
  address_line1: string;
  address_line2: string;
  city: string;
  postal_code: string;
  country: string;
}

export interface PaymentIntentResponse {
  client_secret: string;
  order_id: number;
}

export interface StripeConfig {
  publishable_key: string;
}

export interface OrderItem {
  product_name: string;
  pack_label: string;
  unit_price: string;
  quantity: number;
}

export interface Order extends ShippingDetails {
  id: number;
  status: "pending" | "paid";
  total: string;
  created_at: string;
  items: OrderItem[];
}
