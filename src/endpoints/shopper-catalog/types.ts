import type { UrlFilterParams } from '../../types';
import type { Identifiable, Resource, ResourcePage } from '../../types/core';
import type {
  Catalog,
  CatalogFilter,
  CatalogNodeResponse,
  CatalogReleaseProduct,
} from '../catalogs';
import type { Hierarchy } from '../hierarchies';
import type { Node } from '../nodes';

export interface ShopperCatalogResourceIncluded {
  main_images?: Array<Record<string, unknown>>;
  files?: Array<Record<string, unknown>>;
  component_products?: CatalogReleaseProduct[];
}

export interface ShopperCatalogResource<T> extends Resource<T> {
  included?: ShopperCatalogResourceIncluded;
}

export type ShopperCatalogResourcePage<T> = ResourcePage<T, ShopperCatalogResourceIncluded>;

export interface ShopperCatalogRelease extends Identifiable {
  type: 'catalog-release';
  attributes: Catalog['attributes'] & {
    published_at?: string;
    hierarchies?: Array<{
      id: string;
      label?: string;
      name?: string;
    }>;
  };
  relationships?: Catalog['relationships'];
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
}

export interface ShopperCatalogAdditionalHeaders {
  'EP-Context-Tag'?: string;
  'EP-Channel'?: string;
  'X-MOLTIN-LANGUAGE'?: string;
  'X-MOLTIN-CURRENCY'?: string;
}

export type ShopperCatalogFilter = CatalogFilter | UrlFilterParams;
export type ShopperCatalogProductsInclude = 'main_image' | 'files' | 'component_products';
export type ShopperCatalogNodesInclude = 'main_image' | 'files' | 'component_products';

export type ShopperCatalogResourceResponse = ShopperCatalogResource<ShopperCatalogRelease>;
export type ShopperCatalogNodeResource = ShopperCatalogResource<Node | CatalogNodeResponse>;
export type ShopperCatalogNodePage = ShopperCatalogResourcePage<Node | CatalogNodeResponse>;
export type ShopperCatalogHierarchyResource = ShopperCatalogResource<Hierarchy>;
export type ShopperCatalogHierarchyPage = ShopperCatalogResourcePage<Hierarchy>;
export type ShopperCatalogProductResource = ShopperCatalogResource<CatalogReleaseProduct>;
export type ShopperCatalogProductPage = ShopperCatalogResourcePage<CatalogReleaseProduct>;
