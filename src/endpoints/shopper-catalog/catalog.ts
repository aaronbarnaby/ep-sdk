import { BaseExtend } from '../../extends/base';
import RequestFactory from '../../factories/request';
import type { HttpMethod, ResolvedElasticPathConfig, UrlFilterParams } from '../../types';
import { buildURL } from '../../utils/helpers';
import type {
  ShopperCatalogAdditionalHeaders,
  ShopperCatalogFilter,
  ShopperCatalogHierarchyPage,
  ShopperCatalogHierarchyResource,
  ShopperCatalogNodePage,
  ShopperCatalogNodeResource,
  ShopperCatalogNodesInclude,
  ShopperCatalogProductPage,
  ShopperCatalogProductResource,
  ShopperCatalogProductsInclude,
  ShopperCatalogResourceResponse,
} from './types';

const createVersionlessConfig = (config: ResolvedElasticPathConfig): ResolvedElasticPathConfig => ({
  ...config,
  version: undefined,
});

const normalizeAdditionalHeaders = (
  additionalHeaders?: ShopperCatalogAdditionalHeaders,
): Record<string, string> | undefined => {
  if (!additionalHeaders) {
    return undefined;
  }

  return Object.fromEntries(
    Object.entries(additionalHeaders).filter(([, value]) => value !== undefined),
  );
};

class ShopperCatalogQuery<
  TItemResponse,
  TPageResponse,
  TFilter extends UrlFilterParams = UrlFilterParams,
  TSort extends string = string,
  TInclude extends string = string,
> extends BaseExtend<TItemResponse, TPageResponse, TFilter, TSort, TInclude> {
  constructor(config: ResolvedElasticPathConfig) {
    super(createVersionlessConfig(config));
  }

  protected sendWithHeaders<TResponse>(
    path: string,
    method: HttpMethod,
    token?: string,
    additionalHeaders?: ShopperCatalogAdditionalHeaders,
    body?: unknown,
  ) {
    return this.request.send<TResponse>(path, method, {
      body,
      headers: normalizeAdditionalHeaders(additionalHeaders),
      token,
    });
  }
}

class ShopperCatalogNodesEndpoint extends ShopperCatalogQuery<
  ShopperCatalogNodeResource,
  ShopperCatalogNodePage,
  ShopperCatalogFilter,
  never,
  ShopperCatalogNodesInclude
> {
  constructor(config: ResolvedElasticPathConfig) {
    super(config);

    this.endpoint = 'nodes';
  }

  All<TResponse = ShopperCatalogNodePage>(
    token?: string,
    additionalHeaders?: ShopperCatalogAdditionalHeaders,
  ): Promise<TResponse> {
    const response = this.sendWithHeaders<TResponse>(
      buildURL(`catalog/${this.endpoint}`, {
        limit: this.limit,
        offset: this.offset,
        filter: this.filter,
      }),
      'GET',
      token,
      additionalHeaders,
    );
    this.resetProps();

    return response;
  }

  Get<TResponse = ShopperCatalogNodeResource>(
    nodeId: string,
    token?: string,
    additionalHeaders?: ShopperCatalogAdditionalHeaders,
  ): Promise<TResponse> {
    const response = this.sendWithHeaders<TResponse>(
      `catalog/${this.endpoint}/${nodeId}`,
      'GET',
      token,
      additionalHeaders,
    );
    this.resetProps();

    return response;
  }

  GetNodeChildren(
    nodeId: string,
    token?: string,
    additionalHeaders?: ShopperCatalogAdditionalHeaders,
  ) {
    const response = this.sendWithHeaders<ShopperCatalogNodePage>(
      buildURL(`catalog/${this.endpoint}/${nodeId}/relationships/children`, {
        limit: this.limit,
        offset: this.offset,
        filter: this.filter,
      }),
      'GET',
      token,
      additionalHeaders,
    );
    this.resetProps();

    return response;
  }

  GetNodeProducts(
    nodeId: string,
    token?: string,
    additionalHeaders?: ShopperCatalogAdditionalHeaders,
  ) {
    const response = this.sendWithHeaders<ShopperCatalogProductPage>(
      buildURL(`catalog/${this.endpoint}/${nodeId}/relationships/products`, {
        limit: this.limit,
        offset: this.offset,
        filter: this.filter,
        includes: this.includes,
      }),
      'GET',
      token,
      additionalHeaders,
    );
    this.resetProps();

    return response;
  }
}

class ShopperCatalogHierarchiesEndpoint extends ShopperCatalogQuery<
  ShopperCatalogHierarchyResource,
  ShopperCatalogHierarchyPage,
  ShopperCatalogFilter
> {
  constructor(config: ResolvedElasticPathConfig) {
    super(config);

    this.endpoint = 'hierarchies';
  }

  All<TResponse = ShopperCatalogHierarchyPage>(
    token?: string,
    additionalHeaders?: ShopperCatalogAdditionalHeaders,
  ): Promise<TResponse> {
    const response = this.sendWithHeaders<TResponse>(
      `catalog/${this.endpoint}`,
      'GET',
      token,
      additionalHeaders,
    );
    this.resetProps();

    return response;
  }

  Get<TResponse = ShopperCatalogHierarchyResource>(
    hierarchyId: string,
    token?: string,
    additionalHeaders?: ShopperCatalogAdditionalHeaders,
  ): Promise<TResponse> {
    const response = this.sendWithHeaders<TResponse>(
      `catalog/${this.endpoint}/${hierarchyId}`,
      'GET',
      token,
      additionalHeaders,
    );
    this.resetProps();

    return response;
  }

  GetHierarchyChildren(
    hierarchyId: string,
    token?: string,
    additionalHeaders?: ShopperCatalogAdditionalHeaders,
  ) {
    const response = this.sendWithHeaders<ShopperCatalogNodePage>(
      `catalog/${this.endpoint}/${hierarchyId}/children`,
      'GET',
      token,
      additionalHeaders,
    );
    this.resetProps();

    return response;
  }

  GetHierarchyNodes(
    hierarchyId: string,
    token?: string,
    additionalHeaders?: ShopperCatalogAdditionalHeaders,
  ) {
    const response = this.sendWithHeaders<ShopperCatalogNodePage>(
      `catalog/${this.endpoint}/${hierarchyId}/nodes`,
      'GET',
      token,
      additionalHeaders,
    );
    this.resetProps();

    return response;
  }
}

class ShopperCatalogProductsEndpoint extends ShopperCatalogQuery<
  ShopperCatalogProductResource,
  ShopperCatalogProductPage,
  ShopperCatalogFilter,
  never,
  ShopperCatalogProductsInclude
> {
  constructor(config: ResolvedElasticPathConfig) {
    super(config);

    this.endpoint = 'products';
  }

  All<TResponse = ShopperCatalogProductPage>(
    token?: string,
    additionalHeaders?: ShopperCatalogAdditionalHeaders,
  ): Promise<TResponse> {
    const response = this.sendWithHeaders<TResponse>(
      buildURL(`catalog/${this.endpoint}`, {
        limit: this.limit,
        offset: this.offset,
        filter: this.filter,
        includes: this.includes,
      }),
      'GET',
      token,
      additionalHeaders,
    );
    this.resetProps();

    return response;
  }

  Configure(
    productId: string,
    selectedOptions: { [key: string]: { [key: string]: number } },
    token?: string,
    additionalHeaders?: ShopperCatalogAdditionalHeaders,
  ) {
    const response = this.sendWithHeaders<ShopperCatalogProductResource>(
      `catalog/${this.endpoint}/${productId}/configure`,
      'POST',
      token,
      additionalHeaders,
      {
        selected_options: selectedOptions,
      },
    );
    this.resetProps();

    return response;
  }

  Get<TResponse = ShopperCatalogProductResource>(
    productId: string,
    token?: string,
    additionalHeaders?: ShopperCatalogAdditionalHeaders,
  ): Promise<TResponse> {
    const response = this.sendWithHeaders<TResponse>(
      buildURL(`catalog/${this.endpoint}/${productId}`, {
        includes: this.includes,
      }),
      'GET',
      token,
      additionalHeaders,
    );
    this.resetProps();

    return response;
  }

  GetProductsByNode(
    nodeId: string,
    token?: string,
    additionalHeaders?: ShopperCatalogAdditionalHeaders,
  ) {
    const response = this.sendWithHeaders<ShopperCatalogProductPage>(
      buildURL(`catalog/nodes/${nodeId}/relationships/${this.endpoint}`, {
        limit: this.limit,
        offset: this.offset,
        filter: this.filter,
        includes: this.includes,
      }),
      'GET',
      token,
      additionalHeaders,
    );
    this.resetProps();

    return response;
  }

  GetProductsByHierarchy(
    hierarchyId: string,
    token?: string,
    additionalHeaders?: ShopperCatalogAdditionalHeaders,
  ) {
    const response = this.sendWithHeaders<ShopperCatalogProductPage>(
      buildURL(`catalog/hierarchies/${hierarchyId}/${this.endpoint}`, {
        limit: this.limit,
        offset: this.offset,
        filter: this.filter,
        includes: this.includes,
      }),
      'GET',
      token,
      additionalHeaders,
    );
    this.resetProps();

    return response;
  }

  GetProductChildren(
    productId: string,
    token?: string,
    additionalHeaders?: ShopperCatalogAdditionalHeaders,
  ) {
    const response = this.sendWithHeaders<ShopperCatalogProductPage>(
      buildURL(`catalog/${this.endpoint}/${productId}/relationships/children`, {
        limit: this.limit,
        offset: this.offset,
        filter: this.filter,
        includes: this.includes,
      }),
      'GET',
      token,
      additionalHeaders,
    );
    this.resetProps();

    return response;
  }

  GetRelatedProducts(
    productId: string,
    customRelationshipSlug: string,
    token?: string,
    additionalHeaders?: ShopperCatalogAdditionalHeaders,
  ) {
    const response = this.sendWithHeaders<ShopperCatalogProductPage>(
      buildURL(
        `catalog/${this.endpoint}/${productId}/relationships/${customRelationshipSlug}/products`,
        {
          limit: this.limit,
          offset: this.offset,
          filter: this.filter,
          includes: this.includes,
        },
      ),
      'GET',
      token,
      additionalHeaders,
    );
    this.resetProps();

    return response;
  }
}

export class ShopperCatalogEndpoint {
  readonly request: RequestFactory;
  readonly config: ResolvedElasticPathConfig;
  readonly Nodes: ShopperCatalogNodesEndpoint;
  readonly Products: ShopperCatalogProductsEndpoint;
  readonly Hierarchies: ShopperCatalogHierarchiesEndpoint;
  protected endpoint: string;

  constructor(config: ResolvedElasticPathConfig) {
    const endpointConfig = createVersionlessConfig(config);

    this.request = new RequestFactory(endpointConfig);
    this.config = endpointConfig;
    this.endpoint = 'catalog';
    this.Nodes = new ShopperCatalogNodesEndpoint(config);
    this.Products = new ShopperCatalogProductsEndpoint(config);
    this.Hierarchies = new ShopperCatalogHierarchiesEndpoint(config);
  }

  protected sendWithHeaders<TResponse>(
    path: string,
    method: HttpMethod,
    token?: string,
    additionalHeaders?: ShopperCatalogAdditionalHeaders,
    body?: unknown,
  ) {
    return this.request.send<TResponse>(path, method, {
      body,
      headers: normalizeAdditionalHeaders(additionalHeaders),
      token,
    });
  }

  Get<TResponse = ShopperCatalogResourceResponse>(
    token?: string,
    additionalHeaders?: ShopperCatalogAdditionalHeaders,
  ): Promise<TResponse> {
    const response = this.sendWithHeaders<TResponse>(
      this.endpoint,
      'GET',
      token,
      additionalHeaders,
    );

    return response;
  }
}
