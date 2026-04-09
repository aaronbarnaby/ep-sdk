import type {
  Identifiable,
  RelationshipToMany,
  Resource,
  ResourceList,
  ResourcePage,
} from '../../types/core';
import type { Price } from '../../types/price';

type MatrixValue = string;

export interface MatrixObject {
  [key: string]: MatrixObject | MatrixValue;
}

export interface VariationBase {
  attributes: {
    name: string;
    sort_order?: number;
  };
}

export interface Variation extends Identifiable, VariationBase {
  type: 'product-variation';
  meta?: {
    options?: VariationMetaOption[];
    owner?: 'organization' | 'store';
  };
  relationships?: {
    options: RelationshipToMany<'product-variation-option'>;
  };
}

export interface UpdateVariationBody extends Identifiable {
  attributes: {
    name: string;
    sort_order?: number | null;
  };
}

export interface VariationOptionBase {
  attributes: {
    name: string;
    description: string;
    sort_order?: number;
  };
}

export interface VariationOption extends Identifiable, VariationOptionBase {
  type: 'product-variation-option';
  meta?: {
    owner?: 'organization' | 'store';
    modifiers?: VariationsModifierTypeObj[];
  };
}

export interface UpdateVariationOptionBody extends Identifiable {
  attributes: {
    name: string;
    description: string;
    sort_order?: number | null;
  };
}

export type VariationMetaOption = Identifiable & VariationOptionBase['attributes'];

export interface VariationsBuilderModifier {
  seek: string;
  set: string;
}

export interface VariationsModifier {
  attributes: {
    type: VariationsModifierType;
    value?: string | Price[];
    seek?: string;
    set?: string;
    reference_name?: string;
  };
}

export interface VariationsModifierResponse extends Identifiable, VariationsModifier {
  type: 'product-variation-modifier';
}

export type VariationsModifierTypeObj =
  | { name_equals: string }
  | { name_append: string }
  | { name_prepend: string }
  | { description_equals: string }
  | { description_append: string }
  | { description_prepend: string }
  | { commodity_type: string }
  | { slug_equals: string }
  | { slug_append: string }
  | { slug_prepend: string }
  | { slug_builder: VariationsBuilderModifier }
  | { sku_equals: string }
  | { sku_append: string }
  | { sku_prepend: string }
  | { sku_builder: VariationsBuilderModifier }
  | { status: string }
  | { price: Price[] };

export type VariationsModifierType =
  | 'name_equals'
  | 'name_append'
  | 'name_prepend'
  | 'description_equals'
  | 'description_append'
  | 'description_prepend'
  | 'commodity_type'
  | 'slug_equals'
  | 'slug_append'
  | 'slug_prepend'
  | 'slug_builder'
  | 'sku_equals'
  | 'sku_append'
  | 'sku_prepend'
  | 'sku_builder'
  | 'status'
  | 'price';

export type VariationResource = Resource<Variation>;
export type VariationPage = ResourcePage<Variation>;
export type CreateVariationBody = VariationBase;
export type VariationOptionResource = Resource<VariationOption>;
export type VariationOptionPage = ResourcePage<VariationOption>;
export type VariationModifierResource = Resource<VariationsModifierResponse>;
export type VariationModifierPage = ResourceList<VariationsModifierResponse>;
