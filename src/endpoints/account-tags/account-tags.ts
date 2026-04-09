import { CRUDExtend } from '../../extends/crud';
import type { ResolvedElasticPathConfig } from '../../types';
import type {
  AccountTagFilter,
  AccountTagPage,
  AccountTagResource,
  AccountTagSort,
  CreateAccountTagBody,
  UpdateAccountTagBody,
} from './types';

export class AccountTagsEndpoint extends CRUDExtend<
  AccountTagResource,
  AccountTagPage,
  CreateAccountTagBody,
  UpdateAccountTagBody,
  AccountTagFilter,
  AccountTagSort
> {
  constructor(config: ResolvedElasticPathConfig) {
    super(config);

    this.endpoint = 'account-tags';
    this.resourceType = 'account_tag';
    this.updateMethod = 'PUT';
  }
}
