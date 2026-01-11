// src/types/product.types.ts

export interface Product {
  id: number;
  name: string;
  description: string;
  short_description?: string;
  price: number;
  compare_price?: number;
  cost?: number;
  sku: string;
  barcode?: string;
  stock: number;
  min_stock: number;
  category_id?: number;
  category: string;
  subcategory?: string;
  brand?: string;
  unit: string;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  images: string[];
  thumbnail?: string;
  tags: string[];
  features?: Record<string, unknown>;
  is_active: boolean;
  is_featured: boolean;
  requires_shipping: boolean;
  tax_rate: number;
  views: number;
  sales_count: number;
  rating_average: number;
  rating_count: number;
  meta_title?: string;
  meta_description?: string;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
  categoryInfo?: Category;
  reviews?: Review[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent_id?: number;
  image?: string;
  icon?: string;
  order: number;
  is_active: boolean;
  products_count: number;
  meta_title?: string;
  meta_description?: string;
  createdAt?: string;
  updatedAt?: string;
  subcategories?: Category[];
  parent?: Category;
}

export interface Review {
  id: number;
  product_id: number;
  user_id: number;
  rating: number;
  title?: string;
  comment?: string;
  images: string[];
  verified_purchase: boolean;
  is_approved: boolean;
  helpful_count: number;
  reported_count: number;
  admin_response?: string;
  admin_response_at?: string;
  createdAt?: string;
  updatedAt?: string;
  User?: {
    id: number;
    first_name: string;
    last_name: string;
  };
}

export interface ProductFilters {
  search?: string;
  category?: string;
  categories?: string[];
  brand?: string;
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  featured?: boolean;
  tags?: string[];
}

export interface PriceRange {
  min: number;
  max: number;
}

export interface BrandCount {
  brand: string;
  count: number;
}