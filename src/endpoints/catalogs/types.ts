import type { UrlFilterParams } from '../../types';
import type { FormattedPrice } from '../../types/price';
import type { Identifiable, Resource, ResourceList, ResourcePage } from '../../types/core';

export interface CatalogBase {
  type: 'catalog';
  attributes: {
    name: string;
    description?: string | null;
    hierarchy_ids: string[];
    pricebook_id?: string;
    pricebook_ids?: Array<{
      priority: number;
      id: string;
    }>;
    enable_price_segmentation?: boolean;
  };
}

export interface Catalog extends Identifiable, Omit<CatalogBase, 'attributes'> {
  attributes: CatalogBase['attributes'] & {
    created_at: string;
    updated_at: string;
    owner: 'organization' | 'store';
  };
  relationships?: {
    rules?: {
      links: {
        related: string;
      };
    };
    releases?: {
      links: {
        related: string;
      };
      meta: {
        count?: number;
      };
    };
  };
  links?: {
    [key: string]: string;
  };
}

export interface CatalogFilter extends UrlFilterParams {
  eq?: {
    name?: string;
  };
  in?: {
    name?: string[];
  };
  like?: {
    name?: string;
  };
}

export type CatalogResource = Resource<Catalog>;
export type CatalogPage = ResourcePage<Catalog>;
export type CreateCatalogBody = Omit<CatalogBase, 'type'>;
export type UpdateCatalogBody = Identifiable & {
  attributes: Partial<CatalogBase['attributes']>;
};

export interface CatalogNodeResponse extends Identifiable {
  type: 'node';
  attributes: {
    created_at?: string;
    published_at?: string;
    description?: string;
    label?: string;
    name: string;
    slug?: string;
    status?: string;
    updated_at?: string;
    curated_products?: string[];
  };
  relationships?: {
    children?: Array<{
      id: string;
      label?: string;
      name?: string;
    }>;
    products?: Array<{
      id: string;
      type: string;
    }>;
    parent?: {
      data: {
        id: string;
        type: 'node';
      };
      links?: {
        related: string;
      };
    };
  };
  links?: {
    self: string;
  };
}

export type CatalogNodeResource = Resource<CatalogNodeResponse>;
export type CatalogNodePage = ResourcePage<CatalogNodeResponse>;

export interface CatalogReleaseProduct {
  type: 'product';
  id: string;
  attributes: {
    availability?: string;
    base_product?: boolean;
    base_product_id?: string;
    commodity_type?: string;
    components?: Record<string, unknown>;
    created_at?: string;
    description?: string;
    name: string;
    price?: {
      [key: string]: {
        amount: number;
        includes_tax: boolean;
      };
    };
    sku: string;
    slug?: string;
    status?: string;
    updated_at?: string;
    manufacturer_part_num?: string;
    upc_ean?: string;
    [key: string]: unknown;
  };
  meta?: {
    catalog_id?: string;
    catalog_source?: 'pcm';
    pricebook_id?: string;
    display_price?: {
      without_tax?: FormattedPrice;
      with_tax?: FormattedPrice;
    };
    original_display_price?: {
      without_tax?: FormattedPrice;
      with_tax?: FormattedPrice;
    };
  };
  relationships?: {
    categories?: Array<{
      id: string;
      node_type: string;
    }>;
    brands?: Array<{
      id: string;
      node_type: string;
    }>;
    collections?: Array<{
      id: string;
      node_type: string;
    }>;
    parent?: {
      data: {
        id: string;
        type: 'product';
      };
    };
    children?: {
      data: Array<{
        id: string;
        type: string;
      }>;
    };
    main_image?: {
      data: {
        id: string;
        type: string;
      } | null;
    };
  };
}

export interface NodeProductResponse extends CatalogReleaseProduct {
  attributes: CatalogReleaseProduct['attributes'] & {
    curated_product?: boolean;
  };
}

export interface CatalogReleaseProductFilter extends UrlFilterParams {
  eq?: {
    name?: string;
    slug?: string;
    sku?: string;
    manufacturer_part_num?: string;
    upc_ean?: string;
  };
  in?: {
    name?: string[];
    slug?: string[];
    sku?: string[];
    manufacturer_part_num?: string[];
    upc_ean?: string[];
  };
}

export type CatalogReleaseProductResource = Resource<CatalogReleaseProduct>;
export type CatalogReleaseProductPage = ResourcePage<CatalogReleaseProduct>;
export type CatalogNodeProductPage = ResourcePage<NodeProductResponse>;

export interface CatalogRelease extends Identifiable {
  type: 'catalog-release';
  attributes: {
    published_at: string;
    hierarchies: Array<{
      id: string;
      label?: string;
      name?: string;
    }>;
    description?: string;
    name?: string;
    catalog_id?: string;
  };
  relationships?: {
    hierarchies?: {
      links: {
        related: string;
      };
    };
    products?: {
      links: {
        related: string;
      };
    };
    delta?: {
      links: {
        related: string;
      };
    };
  };
  meta?: {
    created_at?: string;
    is_full_delta?: boolean;
    is_full_publish?: boolean;
    owner?: 'store' | 'organization';
    percent_completed?: number;
    total_nodes?: number;
    total_products?: number;
    release_status?: 'PENDING' | 'IN_PROGRESS' | 'FAILED' | 'PUBLISHED';
    started_at?: string;
  };
  links?: {
    self: string;
  };
}

export interface ReleaseCreateBody {
  export_full_delta?: boolean;
}

export type CatalogReleaseResource = Resource<CatalogRelease>;
export type CatalogReleaseList = ResourceList<CatalogRelease>;
export type CatalogReleasePage = ResourcePage<CatalogRelease>;

export interface CatalogRuleBase {
  type: 'catalog_rule';
  attributes: {
    name: string;
    description?: string;
    catalog_id: string;
    account_ids?: string[];
    customer_ids?: string[];
    channels?: string[];
    tags?: string[];
    schedules?: Array<{
      valid_from: string;
      valid_to: string;
    }>;
  };
}

export interface CatalogRule extends Identifiable, CatalogRuleBase {
  links?: {
    self: string;
  };
}

export type CatalogRuleResource = Resource<CatalogRule>;
export type CatalogRulePage = ResourcePage<CatalogRule>;
export type CreateCatalogRuleBody = Omit<CatalogRuleBase, 'type'>;
export type UpdateCatalogRuleBody = Identifiable & {
  attributes: Partial<CatalogRuleBase['attributes']>;
};
export type CatalogRuleFilter = UrlFilterParams;
