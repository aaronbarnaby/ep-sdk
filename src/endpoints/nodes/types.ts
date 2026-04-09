import type { UrlFilterParams } from '../../types';
import type {
  Identifiable,
  Relationship,
  RelationshipToMany,
  Resource,
  ResourceList,
  ResourcePage,
  TimestampFilters,
} from '../../types/core';
import type { Locales } from '../../types/locales';

export interface NodeBase {
  type: 'node';
  attributes: {
    name: string;
    description?: string;
    slug?: string;
    curated_products?: string[];
    locales?: { [key in Locales]?: { name?: string; description?: string } };
    admin_attributes?: { [key: string]: string | null };
    shopper_attributes?: { [key: string]: string | null };
  };
  meta?: {
    sort_order: number;
  };
}

export interface Node extends Identifiable, Omit<NodeBase, 'meta'> {
  relationships: {
    children: {
      data: [];
      links: {
        related: string;
      };
    };
    parent: Relationship<'node'>;
    products: RelationshipToMany<'product'>;
  };
  meta: NodeBase['meta'] & {
    created_at: string;
    updated_at: string;
    parent_name: string;
    owner: 'organization' | 'store';
    hierarchy_id: string;
    breadcrumbs: Array<{
      id: string;
      name: string;
      slug: string;
      locales?: { [key in Locales]?: { name?: string; description?: string } };
    }>;
  };
}

export type NodeResource = Resource<Node>;
export type NodeList = ResourceList<Node>;
export type NodePage = ResourcePage<Node>;
export type CreateNodeBody = Omit<NodeBase, 'type'>;
export type UpdateNodeBody = Identifiable & Omit<NodeBase, 'type'>;

export interface NodeFilter extends UrlFilterParams, TimestampFilters {
  eq?: {
    id?: string;
    hierarchy_id?: string;
    parent_id?: string;
    name?: string;
    slug?: string;
    description?: string;
    has_children?: boolean;
    created_at?: string;
    updated_at?: string;
    owner?: string;
    'breadcrumbs.id'?: string;
    'breadcrumbs.name'?: string;
    'breadcrumbs.slug'?: string;
  };
  in?: {
    id?: string[];
    hierarchy_id?: string[];
    parent_id?: string[];
    'breadcrumbs.id'?: string[];
  };
  like?: {
    name?: string;
    slug?: string;
    description?: string;
    'breadcrumbs.name'?: string;
    'breadcrumbs.slug'?: string;
  };
}

export interface NodeRelationshipBase {
  type: 'product';
  id: string;
}

export interface NodeRelationship extends NodeRelationshipBase {
  relationships: Record<string, never>;
}

export interface NodeRelationshipParent {
  type: 'node';
  id: string;
}

export interface CreateChildrenSortOrderBody extends Identifiable {
  type: 'node';
  meta: {
    sort_order: number;
  };
}

export interface NodeProduct extends Identifiable {
  type: 'product';
  attributes?: Record<string, unknown>;
}
