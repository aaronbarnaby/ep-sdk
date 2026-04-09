import type { UrlFilterParams } from '../../types';
import type { Identifiable, RelationshipToMany, Resource, ResourcePage } from '../../types/core';

export interface AccountTagRelationship {
  id: string;
  type: 'account_tag';
}

export interface AccountBase {
  type: 'account';
  name: string;
  legal_name?: string | null;
  registration_id?: string | null;
  parent_id?: string | null;
  external_ref?: string | null;
}

export interface Account extends AccountBase, Identifiable {
  meta?: {
    timestamps?: {
      created_at: string;
      updated_at: string;
    };
  };
  links?: Record<string, string>;
  relationships: {
    account_tags?: RelationshipToMany<'account_tag'>;
    parent?: {
      data: {
        id: string;
        type: string;
      } | null;
    };
    ancestors?: Array<{
      data: {
        id: string;
        type: string;
      };
    }>;
  };
}

export type AccountResource = Resource<Account>;
export type AccountPage = ResourcePage<Account>;
export type CreateAccountBody = Omit<AccountBase, 'type'>;
export type UpdateAccountBody = Partial<Omit<AccountBase, 'type'>>;

export interface AccountFilter extends UrlFilterParams {
  eq?: {
    id?: string;
    name?: string;
    legal_name?: string;
    registration_id?: string;
    external_ref?: string;
  };
  like?: {
    name?: string;
    legal_name?: string;
    registration_id?: string;
    external_ref?: string;
  };
  in?: {
    id: string[];
    external_ref: string[];
  };
  contains?: {
    account_tags?: string[];
  };
  gt?: {
    created_at?: string;
    updated_at?: string;
  };
  ge?: {
    created_at?: string;
    updated_at?: string;
  };
  lt?: {
    created_at?: string;
    updated_at?: string;
  };
  le?: {
    created_at?: string;
    updated_at?: string;
  };
}

export type AccountSort =
  | 'id'
  | '-id'
  | 'name'
  | '-name'
  | 'created_at'
  | '-created_at'
  | 'updated_at'
  | '-updated_at';
