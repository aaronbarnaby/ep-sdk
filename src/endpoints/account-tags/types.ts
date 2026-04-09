import type { UrlFilterParams } from '../../types';
import type { Identifiable, Resource, ResourcePage } from '../../types/core';

export interface AccountTagBase {
  type: 'account_tag';
  name: string;
  description?: string;
}

export interface AccountTag extends Identifiable, AccountTagBase {
  meta?: {
    timestamps?: {
      created_at: string;
      updated_at: string;
    };
  };
}

export type AccountTagResource = Resource<AccountTag>;
export type AccountTagPage = ResourcePage<AccountTag>;
export type CreateAccountTagBody = Omit<AccountTagBase, 'type'>;
export type UpdateAccountTagBody = Partial<Omit<AccountTagBase, 'type'>>;

export interface AccountTagFilter extends UrlFilterParams {
  eq?: {
    id?: string;
    name?: string;
    created_at?: string;
    updated_at?: string;
  };
  like?: {
    name?: string;
  };
  in?: {
    id?: string[];
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
export type AccountTagSort =
  | 'id'
  | '-id'
  | 'created_at'
  | '-created_at'
  | 'updated_at'
  | '-updated_at';
