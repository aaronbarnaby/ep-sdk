import type { Identifiable, Resource, ResourcePage } from '../../types/core';
import type { UrlFilterParams } from '../../types';
import type { Locales } from '../../types/locales';

export interface ProductRelationships {
  relationships?: {
    base_product?: {
      data: {
        id: string;
        type: string;
      };
    };
    main_image?: {
      data: {
        id: string;
      };
    };
    custom_relationships?: {
      data?: Array<unknown> | null;
      links?: {
        [key: string]: string;
        self: string;
      };
    };
  };
}

export interface BuildRules {
  default: 'include' | 'exclude';
  include?: string[][];
  exclude?: string[][];
}

export interface ProductComponentOption {
  id: string;
  quantity: number;
  type: string;
  sort_order?: number | null;
  default?: boolean;
  meta: {
    name: string;
    sku: string;
    status: string;
  };
}

export interface ProductComponents {
  [key: string]: {
    name: string;
    min?: number | null;
    max?: number | null;
    sort_order?: number | null;
    options: ProductComponentOption[];
  };
}

export interface CustomInputsValidationRules {
  type: string;
  options: {
    max_length?: number;
  };
}

export interface CustomInputs {
  [key: string]: {
    name?: string;
    required?: boolean;
    validation_rules?: CustomInputsValidationRules[];
  };
}

export interface ProductBase extends ProductRelationships {
  type: string;
  attributes: {
    name: string;
    description?: string | null;
    slug?: string | null;
    sku?: string | null;
    status?: string;
    commodity_type?: string;
    upc_ean?: string | null;
    mpn?: string | null;
    external_ref?: string | null;
    build_rules?: BuildRules;
    extensions?: object;
    locales?: { [key in Locales]?: { name?: string; description?: string } };
    components?: ProductComponents;
    custom_inputs?: CustomInputs;
    tags?: string[];
  };
}

type ProductType = 'standard' | 'parent' | 'child' | 'bundle';

export interface Product extends Identifiable, ProductBase {
  meta: {
    created_at: string;
    updated_at: string;
    variation_matrix: { [key: string]: string } | object;
    owner?: 'organization' | 'store';
    product_types?: ProductType[];
    custom_relationships?: string[];
  };
}

export type ProductResource = Resource<Product>;
export type ProductPage = ResourcePage<Product>;
export type CreateProductBody = Omit<ProductBase, 'type'>;
export type UpdateProductBody = Identifiable & {
  attributes: Partial<ProductBase['attributes']>;
};
export type ProductAttachmentBody = {
  filter: string;
  node_ids: string[];
};

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

export type ProductSort = 'name' | '-name';

export type ProductInclude = 'main_image' | 'component_products';
