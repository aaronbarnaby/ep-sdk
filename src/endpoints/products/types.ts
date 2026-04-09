import type {
  Identifiable,
  Relationship,
  RelationshipToMany,
  Resource,
  ResourcePage,
} from '../../types/core';
import type { UrlFilterParams } from '../../types';
import type { FormattedPrice, Price } from '../../types/price';

export interface ProductBase {
  type: string;
  name: string;
  slug: string;
  sku: string;
  manage_stock: boolean;
  description: string;
  price: Price[];
  status?: 'draft' | 'live';
  commodity_type: 'physical' | 'digital';
}

export interface Product extends Identifiable, ProductBase {
  meta: {
    timestamps: {
      created_at: string;
      updated_at: string;
    };
    stock: {
      level: number;
      availability: 'in-stock' | 'out-stock';
    };
    display_price: {
      with_tax: FormattedPrice;
      without_tax: FormattedPrice;
    };
    variations: unknown;
  };
  relationships: {
    main_image?: Relationship<'main_image'>;
    files?: RelationshipToMany<'file'>;
    categories?: Relationship<'category'>[];
    brands?: Relationship<'brand'>[];
    parent?: Relationship<'product'>;
    children?: RelationshipToMany<'product'>;
  };
}

export type ProductResource = Resource<Product>;
export type ProductPage = ResourcePage<Product>;
export type CreateProductBody = Omit<ProductBase, 'type'>;
export type UpdateProductBody = Partial<CreateProductBody>;

export interface ProductFilter extends UrlFilterParams {
  eq?: {
    name?: string;
    slug?: string;
    sku?: string;
    status?: string;
    commodity_type?: string;
    manage_stock?: string;
    brand?: {
      id?: string;
    };
    category?: {
      id?: string;
    };
    collection?: {
      id?: string;
    };
  };
  lt?: {
    stock?: number;
  };
  gt?: {
    stock?: number;
  };
  like?: {
    name?: string;
    slug?: string;
    sku?: string;
    status?: string;
    description?: string;
  };
}

export type ProductSort =
  | 'commodity_type'
  | '-commodity_type'
  | 'created_at'
  | '-created_at'
  | 'description'
  | '-description'
  | 'manage_stock'
  | '-manage_stock'
  | 'name'
  | '-name'
  | 'sku'
  | '-sku'
  | 'slug'
  | '-slug'
  | 'status'
  | '-status'
  | 'updated_at'
  | '-updated_at';

export type ProductInclude =
  | 'main_images'
  | 'files'
  | 'brands'
  | 'categories'
  | 'collections'
  | 'variations';
