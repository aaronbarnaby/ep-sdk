import { CRUDExtend } from '../../extends/crud';
import type { ResolvedElasticPathConfig } from '../../types';
import type { CreateFieldBody, FieldPage, FieldResource, UpdateFieldBody } from './types';

export class FieldsEndpoint extends CRUDExtend<
  FieldResource,
  FieldPage,
  CreateFieldBody,
  UpdateFieldBody
> {
  constructor(config: ResolvedElasticPathConfig) {
    super(config);

    this.endpoint = 'fields';
    this.resourceType = 'field';
    this.updateMethod = 'PUT';
  }
}
