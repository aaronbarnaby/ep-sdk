import type { Identifiable } from '../../types/core';
import type { Locales } from '../../types/locales';

export interface NodeBase {
  type: 'node';
  attributes: {
    name: string;
    description?: string;
    slug?: string;
    curated_products?: string[];
    locales?: { [key in Locales]?: { name?: string; description?: string } };
    admin_attributes?: { [key: string]: string };
    shopper_attributes?: { [key: string]: string };
  };
  relationships?: {
    parent: {
      data: {
        type: string;
        id: string;
      };
    };
  };
  meta?: {
    sort_order: number;
  };
}

export interface Node extends Identifiable, NodeBase {
  relationships: {
    children: {
      data: [];
      links: {
        related: string;
      };
    };
    products: {
      data: {
        type: 'product';
        id: string;
      }[];
    };
    parent: {
      data: {
        type: string;
        id: string;
      };
    };
  };
}
