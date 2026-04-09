import { CRUDExtend } from '../../extends/crud';
import type { ResolvedElasticPathConfig } from '../../types';
import type {
  CreateProductBody,
  ProductFilter,
  ProductInclude,
  ProductPage,
  ProductResource,
  ProductSort,
  UpdateProductBody,
} from './types';

export class ProductsEndpoint extends CRUDExtend<
  ProductResource,
  ProductPage,
  CreateProductBody,
  UpdateProductBody,
  ProductFilter,
  ProductSort,
  ProductInclude
> {
  constructor(config: ResolvedElasticPathConfig) {
    const endpointConfig: ResolvedElasticPathConfig = {
      ...config,
      version: 'pcm',
    };

    super(endpointConfig);

    this.endpoint = 'products';
  }
}
