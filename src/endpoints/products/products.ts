import { CRUDExtend } from '../../extends/crud';
import type { ResolvedElasticPathConfig } from '../../types';
import type { ResourceList, ResourcePage } from '../../types/core';
import { buildURL } from '../../utils/helpers';
import type { Node } from '../nodes/types';
import type {
  CreateProductBody,
  Product,
  ProductAttachmentBody,
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

  GetChildren(productId: string) {
    const response = this.request.send<ResourcePage<Product>>(
      buildURL(`${this.endpoint}/${productId}/children`, this.getParams()),
      'GET',
    );
    this.resetProps();

    return response;
  }

  GetNodes(productId: string) {
    const response = this.request.send<ResourceList<Node>>(
      buildURL(`${this.endpoint}/${productId}/nodes`, {
        limit: this.limit,
        offset: this.offset,
      }),
      'GET',
    );
    this.resetProps();

    return response;
  }

  AttachNodes<TBody extends ProductAttachmentBody = ProductAttachmentBody>(body: TBody) {
    const response = this.request.send<ResourceList<Node>>(
      `${this.endpoint}/attach_nodes`,
      'POST',
      {
        body,
      },
    );
    this.resetProps();

    return response;
  }

  DetachNodes<TBody extends ProductAttachmentBody = ProductAttachmentBody>(body: TBody) {
    const response = this.request.send<ResourceList<Node>>(
      `${this.endpoint}/detach_nodes`,
      'POST',
      {
        body,
      },
    );
    this.resetProps();

    return response;
  }
}
