import { CRUDExtend } from '../../extends/crud';
import type { ResolvedElasticPathConfig } from '../../types';
import type {
  CreateCustomRelationshipBody,
  CustomRelationshipPage,
  CustomRelationshipResource,
  CustomRelationshipsFilter,
  UpdateCustomRelationshipBody,
} from './types';

export class CustomRelationshipsEndpoint extends CRUDExtend<
  CustomRelationshipResource,
  CustomRelationshipPage,
  CreateCustomRelationshipBody,
  UpdateCustomRelationshipBody,
  CustomRelationshipsFilter
> {
  constructor(config: ResolvedElasticPathConfig) {
    super({
      ...config,
      version: 'pcm',
    });

    this.endpoint = 'custom-relationships';
    this.resourceType = 'custom-relationship';
    this.updateMethod = 'PUT';
  }
}
