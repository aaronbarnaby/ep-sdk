import type { Identifiable, Relationship, Resource, ResourcePage } from '../../types/core';

export type FieldValueType = 'string' | 'integer' | 'float' | 'boolean' | 'date' | 'relationship';

interface Validation {
  type: 'enum' | 'email' | 'slug' | 'between' | 'one-to-many' | 'one-to-one';
  to?: string;
  options?: string[] | { from: string | number; to: string | number };
}

export interface FieldBase {
  type: 'field';
  name: string;
  slug: string;
  field_type: FieldValueType;
  validation_rules?: Validation[];
  description: string;
  required: boolean;
  default?: unknown;
  enabled?: boolean;
  order?: number;
  omit_null?: boolean;
  relationships?: {
    flow: Relationship<'flow'>;
  };
}

export interface Field extends Identifiable, FieldBase {
  meta: {
    owner: 'organization' | 'store';
    timestamps: {
      created_at: string;
      updated_at: string;
    };
  };
  links: {
    [key: string]: string;
  };
}

export type FieldResource = Resource<Field>;
export type FieldPage = ResourcePage<Field>;
export type CreateFieldBody = Omit<FieldBase, 'type'>;
export type UpdateFieldBody = Partial<Omit<FieldBase, 'type'>>;
