import type { UrlFilterParams } from '../../types';
import type { Identifiable, Resource, ResourcePage } from '../../types/core';
import type { PcmJob } from '../../types/pcm';

export interface PriceBookBase {
  type: 'pricebook';
  attributes: {
    name: string;
    description?: string;
    created_at?: string;
    updated_at?: string;
    external_ref?: string | null;
    meta?: Record<string, unknown>;
  };
}

export interface PriceBook extends Identifiable, PriceBookBase {
  meta?: {
    owner?: 'organization' | 'store';
  };
}

export interface PriceBookFilter extends UrlFilterParams {
  eq?: {
    name?: string;
    external_ref?: string;
  };
  like?: {
    name?: string;
    description?: string;
  };
}

export type PriceBookSort = 'name' | '-name';
export type PriceBookInclude = 'prices' | 'modifiers';
export type PriceBookResource = Resource<PriceBook>;
export type PriceBookPage = ResourcePage<PriceBook>;
export type CreatePriceBookBody = Omit<PriceBookBase, 'type'>;
export type UpdatePriceBookBody = Identifiable & {
  attributes: Partial<PriceBookBase['attributes']>;
};

export interface PriceBookPriceBase {
  type: 'product-price';
  attributes: {
    currencies: {
      [key: string]: {
        includes_tax: boolean;
        amount: number;
        tiers?: {
          [key: string]: {
            minimum_quantity: number;
            amount: number;
          };
        };
      };
    };
    sales?: {
      [key: string]: {
        bundle_ids?: string[];
        schedule?: {
          valid_from: string;
          valid_to: string;
        };
        currencies: {
          [key: string]: {
            includes_tax: boolean;
            amount: number;
            tiers?: {
              [key: string]: {
                minimum_quantity: number;
                amount: number;
              };
            };
          };
        };
      };
    };
    external_ref?: string | null;
    sku: string;
  };
}

export interface PriceBookPrice extends Identifiable, PriceBookPriceBase {
  relationships: Record<string, never>;
}

export interface PriceBookPriceFilter extends UrlFilterParams {
  eq?: {
    sku?: string;
    external_ref?: string;
  };
  in?: {
    sku?: string[];
  };
}

export type PriceBookPriceResource = Resource<PriceBookPrice>;
export type PriceBookPricePage = ResourcePage<PriceBookPrice>;
export type CreatePriceBookPriceBody = Omit<PriceBookPriceBase, 'type'>;
export type UpdatePriceBookPriceBody = Identifiable & {
  attributes: Partial<PriceBookPriceBase['attributes']>;
};

export interface PriceBookPriceModifierBase {
  type: 'price-modifier';
  attributes: {
    modifier_type: string;
    name: string;
    external_ref?: string | null;
    currencies: {
      [key: string]: {
        includes_tax: boolean;
        amount: number;
      };
    };
  };
}

export interface PriceBookPriceModifier extends Identifiable, PriceBookPriceModifierBase {
  relationships: Record<string, never>;
}

export type PriceBookPriceModifierResource = Resource<PriceBookPriceModifier>;
export type PriceBookPriceModifierPage = ResourcePage<PriceBookPriceModifier>;
export type CreatePriceBookPriceModifierBody = Omit<PriceBookPriceModifierBase, 'type'>;
export type UpdatePriceBookPriceModifierBody = Identifiable & {
  attributes: Partial<PriceBookPriceModifierBase['attributes']>;
};
export type PriceBookPriceModifierFilter = UrlFilterParams;

export type PriceBookImportJobResource = Resource<PcmJob>;
