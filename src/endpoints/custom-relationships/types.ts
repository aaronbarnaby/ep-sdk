import type { UrlFilterParams } from '../../types';
import type { Identifiable, Resource, ResourcePage } from '../../types/core';

export interface CustomRelationshipBaseAttributes {
  name: string;
  slug: string;
  description?: string;
  sort_order?: number | null;
  external_name?: string | null;
  external_description?: string | null;
  bi_directional?: boolean;
}

export interface CustomRelationshipBase {
  type: 'custom-relationship';
  attributes: CustomRelationshipBaseAttributes;
}

export interface CustomRelationship extends Identifiable, CustomRelationshipBase {}

export type CustomRelationshipResource = Resource<CustomRelationship>;
export type CustomRelationshipPage = ResourcePage<CustomRelationship>;
export type CreateCustomRelationshipBody = Pick<CustomRelationshipBase, 'attributes'>;
export type UpdateCustomRelationshipBody = Pick<CustomRelationshipBase, 'attributes'>;

export interface CustomRelationshipsFilter extends UrlFilterParams {
  eq?: {
    slug?: string;
    owner?: string;
  };
  in?: {
    slug?: string[];
  };
}
