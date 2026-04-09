import type { UrlFilterParams } from '../../types';
import type { Identifiable, Resource, ResourcePage } from '../../types/core';

export interface Presentation {
  summary?: string;
  description?: string;
}

export interface CustomApiBase {
  slug: string;
  name: string;
  description?: string;
  enabled?: boolean;
  presentation?: Presentation;
  [key: string]: unknown;
}

export interface CustomApi extends Identifiable, CustomApiBase {
  type?: 'custom-api';
  meta?: {
    timestamps?: {
      created_at: string;
      updated_at: string;
    };
  };
}

export type FieldType = 'string' | 'integer' | 'float' | 'boolean' | 'any' | 'list';

export interface CommonValidationOptions {
  required?: boolean;
  unique?: boolean;
  immutable?: boolean;
  nullable?: boolean;
}

export interface StringValidationOptions extends CommonValidationOptions {
  min_length?: number;
  max_length?: number;
  regex?: string;
  enum?: string[];
}

export interface IntegerValidationOptions extends CommonValidationOptions {
  min?: number;
  max?: number;
}

export interface FloatValidationOptions extends CommonValidationOptions {
  min?: number;
  max?: number;
}

export type BooleanValidationOptions = CommonValidationOptions;

export type AnyValidationOptions = CommonValidationOptions;

export interface ListValidationOptions extends CommonValidationOptions {
  item_type: Exclude<FieldType, 'list'>;
  min_items?: number;
  max_items?: number;
}

export interface CustomApiFieldBase {
  slug: string;
  name: string;
  description?: string;
  field_type: FieldType;
  default?: unknown;
  validation?:
    | StringValidationOptions
    | IntegerValidationOptions
    | FloatValidationOptions
    | CommonValidationOptions
    | ListValidationOptions;
  [key: string]: unknown;
}

export interface CustomApiField extends Identifiable, CustomApiFieldBase {
  type?: 'custom-api-field';
}

export interface CustomApiEntry extends Identifiable {
  [key: string]: unknown;
}

export type CustomApiResource = Resource<CustomApi>;
export type CustomApiPage = ResourcePage<CustomApi>;
export type CustomApiFieldResource = Resource<CustomApiField>;
export type CustomApiFieldPage = ResourcePage<CustomApiField>;
export type CustomApiEntryResource<TEntry = CustomApiEntry> = Resource<TEntry>;
export type CustomApiEntryPage<TEntry = CustomApiEntry> = ResourcePage<TEntry>;

export type CreateCustomApiBody = CustomApiBase;
export type UpdateCustomApiBody = Partial<CustomApiBase>;
export type CreateCustomApiFieldBody = CustomApiFieldBase;
export type UpdateCustomApiFieldBody = Partial<CustomApiFieldBase>;
export type CreateCustomApiEntryBody = Record<string, unknown>;
export type UpdateCustomApiEntryBody = Record<string, unknown>;

export interface CustomApiFilter extends UrlFilterParams {
  eq?: {
    slug?: string;
    enabled?: boolean;
  };
  like?: {
    name?: string;
    description?: string;
  };
}

export type CustomApiSort = 'name' | '-name' | 'slug' | '-slug';
