import { CRUDExtend } from '../../extends/crud';
import type { ResolvedElasticPathConfig } from '../../types';
import type { ResourceList } from '../../types/core';
import type {
  AccountFilter,
  AccountPage,
  AccountResource,
  AccountSort,
  AccountTagRelationship,
  CreateAccountBody,
  UpdateAccountBody,
} from './types';

export class AccountsEndpoint extends CRUDExtend<
  AccountResource,
  AccountPage,
  CreateAccountBody,
  UpdateAccountBody,
  AccountFilter,
  AccountSort
> {
  constructor(config: ResolvedElasticPathConfig) {
    super(config);

    this.endpoint = 'accounts';
    this.resourceType = 'account';
    this.updateMethod = 'PUT';
  }

  GetTags(accountId: string) {
    const response = this.request.send<ResourceList<AccountTagRelationship>>(
      `${this.endpoint}/${accountId}/relationships/account-tags`,
      'GET',
    );
    this.resetProps();

    return response;
  }

  AddAccountTags(accountId: string, requestBody: AccountTagRelationship[], token?: string) {
    const response = this.request.send<ResourceList<AccountTagRelationship>>(
      `${this.endpoint}/${accountId}/relationships/account-tags`,
      'POST',
      {
        body: requestBody,
        token,
      },
    );
    this.resetProps();

    return response;
  }

  DeleteAccountTags(accountId: string, requestBody: AccountTagRelationship[], token?: string) {
    const response = this.request.send<ResourceList<AccountTagRelationship>>(
      `${this.endpoint}/${accountId}/relationships/account-tags`,
      'DELETE',
      {
        body: requestBody,
        token,
      },
    );
    this.resetProps();

    return response;
  }
}