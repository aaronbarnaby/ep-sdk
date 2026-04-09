import { CRUDExtend, mergeTypeIntoBody } from '../../extends/crud';
import { BaseExtend } from '../../extends/base';
import type { ResolvedElasticPathConfig } from '../../types';
import { buildURL } from '../../utils/helpers';
import type {
  CatalogFilter,
  CatalogNodePage,
  CatalogNodeResource,
  CatalogPage,
  CatalogReleaseList,
  CatalogReleasePage,
  CatalogReleaseProductFilter,
  CatalogReleaseProductPage,
  CatalogReleaseProductResource,
  CatalogReleaseResource,
  CatalogResource,
  CatalogRuleFilter,
  CatalogRulePage,
  CatalogRuleResource,
  CatalogNodeProductPage,
  CreateCatalogBody,
  CreateCatalogRuleBody as CreateRuleBody,
  ReleaseCreateBody,
  UpdateCatalogBody,
  UpdateCatalogRuleBody,
} from './types';

const createVersionlessConfig = (config: ResolvedElasticPathConfig): ResolvedElasticPathConfig => ({
  ...config,
  version: undefined,
});

class CatalogsNodesEndpoint extends BaseExtend<
  CatalogNodeResource,
  CatalogNodePage,
  CatalogFilter
> {
  constructor(config: ResolvedElasticPathConfig) {
    super(createVersionlessConfig(config));

    this.endpoint = 'nodes';
  }

  All<TResponse = CatalogNodePage>(token?: string): Promise<TResponse> {
    const response = this.request.send<TResponse>(
      buildURL(`catalogs/${this.endpoint}`, {
        limit: this.limit,
        offset: this.offset,
      }),
      'GET',
      { token },
    );
    this.resetProps();

    return response;
  }

  Get<TResponse = CatalogNodeResource>(nodeId: string, token?: string): Promise<TResponse> {
    const response = this.request.send<TResponse>(`catalogs/${this.endpoint}/${nodeId}`, 'GET', {
      token,
    });
    this.resetProps();

    return response;
  }

  GetNodeChildren(nodeId: string, token?: string) {
    const response = this.request.send<CatalogNodePage>(
      buildURL(`catalogs/${this.endpoint}/${nodeId}/relationships/children`, {
        limit: this.limit,
        offset: this.offset,
      }),
      'GET',
      { token },
    );
    this.resetProps();

    return response;
  }

  GetNodeChildrenFromCatalogReleases(
    catalogId: string,
    releaseId: string,
    nodeId: string,
    token?: string,
  ) {
    const response = this.request.send<CatalogNodePage>(
      buildURL(
        `catalogs/${catalogId}/releases/${releaseId}/${this.endpoint}/${nodeId}/relationships/children`,
        {
          limit: this.limit,
          offset: this.offset,
        },
      ),
      'GET',
      { token },
    );
    this.resetProps();

    return response;
  }

  GetAllCatalogNodes(catalogId: string, releaseId: string, token?: string) {
    const response = this.request.send<CatalogNodePage>(
      buildURL(`catalogs/${catalogId}/releases/${releaseId}/${this.endpoint}`, {
        limit: this.limit,
        offset: this.offset,
      }),
      'GET',
      { token },
    );
    this.resetProps();

    return response;
  }

  GetNodeInCatalogRelease(catalogId: string, releaseId: string, nodeId: string, token?: string) {
    const response = this.request.send<CatalogNodeResource>(
      `catalogs/${catalogId}/releases/${releaseId}/${this.endpoint}/${nodeId}`,
      'GET',
      { token },
    );
    this.resetProps();

    return response;
  }
}

class CatalogsProductsEndpoint extends BaseExtend<
  CatalogReleaseProductResource,
  CatalogReleaseProductPage,
  CatalogReleaseProductFilter
> {
  constructor(config: ResolvedElasticPathConfig) {
    super(createVersionlessConfig(config));

    this.endpoint = 'products';
  }

  GetCatalogReleaseProduct(
    catalogId: string,
    releaseId: string,
    productId: string,
    token?: string,
  ) {
    const response = this.request.send<CatalogReleaseProductResource>(
      `catalogs/${catalogId}/releases/${releaseId}/${this.endpoint}/${productId}`,
      'GET',
      { token },
    );
    this.resetProps();

    return response;
  }

  GetAllCatalogReleaseProducts(catalogId: string, releaseId: string, token?: string) {
    const response = this.request.send<CatalogReleaseProductPage>(
      buildURL(`catalogs/${catalogId}/releases/${releaseId}/${this.endpoint}`, this.getParams()),
      'GET',
      { token },
    );
    this.resetProps();

    return response;
  }

  GetCatalogReleaseProductChildren(
    catalogId: string,
    releaseId: string,
    productId: string,
    token?: string,
  ) {
    const response = this.request.send<CatalogReleaseProductPage>(
      buildURL(
        `catalogs/${catalogId}/releases/${releaseId}/${this.endpoint}/${productId}/relationships/children`,
        this.getParams(),
      ),
      'GET',
      { token },
    );
    this.resetProps();

    return response;
  }

  GetCatalogReleaseNodeProducts(
    catalogId: string,
    releaseId: string,
    nodeId: string,
    token?: string,
  ) {
    const response = this.request.send<CatalogNodeProductPage>(
      buildURL(
        `catalogs/${catalogId}/releases/${releaseId}/nodes/${nodeId}/relationships/${this.endpoint}`,
        this.getParams(),
      ),
      'GET',
      { token },
    );
    this.resetProps();

    return response;
  }

  GetCatalogReleaseHierarchyProducts(
    catalogId: string,
    releaseId: string,
    hierarchyId: string,
    token?: string,
  ) {
    const response = this.request.send<CatalogReleaseProductPage>(
      buildURL(
        `catalogs/${catalogId}/releases/${releaseId}/hierarchies/${hierarchyId}/relationships/${this.endpoint}`,
        this.getParams(),
      ),
      'GET',
      { token },
    );
    this.resetProps();

    return response;
  }

  GetProductsInCatalogRelease(catalogId: string, releaseId: string, token?: string) {
    return this.GetAllCatalogReleaseProducts(catalogId, releaseId, token);
  }
}

class CatalogsReleasesEndpoint extends BaseExtend<CatalogReleaseResource, CatalogReleasePage> {
  constructor(config: ResolvedElasticPathConfig) {
    super(createVersionlessConfig(config));

    this.endpoint = 'releases';
  }

  All<TResponse = CatalogReleaseList>(catalogId: string, token?: string): Promise<TResponse> {
    const response = this.request.send<TResponse>(
      buildURL(`catalogs/${catalogId}/${this.endpoint}`, {
        limit: this.limit,
        offset: this.offset,
      }),
      'GET',
      { token },
    );
    this.resetProps();

    return response;
  }

  Get<TResponse = CatalogReleaseResource>(
    catalogId: string,
    releaseId: string,
    token?: string,
  ): Promise<TResponse> {
    const response = this.request.send<TResponse>(
      `catalogs/${catalogId}/${this.endpoint}/${releaseId}`,
      'GET',
      { token },
    );
    this.resetProps();

    return response;
  }

  GetAllHierarchies(catalogId: string, releaseId: string, token?: string) {
    const response = this.request.send<CatalogNodePage>(
      buildURL(`catalogs/${catalogId}/${this.endpoint}/${releaseId}/hierarchies`, {
        limit: this.limit,
        offset: this.offset,
      }),
      'GET',
      { token },
    );
    this.resetProps();

    return response;
  }

  Create(catalogId: string, body: ReleaseCreateBody = {}, token?: string) {
    const response = this.request.send<CatalogReleaseResource>(
      `catalogs/${catalogId}/${this.endpoint}`,
      'POST',
      {
        body,
        token,
      },
    );
    this.resetProps();

    return response;
  }

  Delete(catalogId: string, releaseId: string, token?: string) {
    const response = this.request.send<void>(
      `catalogs/${catalogId}/${this.endpoint}/${releaseId}`,
      'DELETE',
      {
        token,
      },
    );
    this.resetProps();

    return response;
  }

  DeleteAll(catalogId: string, token?: string) {
    const response = this.request.send<void>(`catalogs/${catalogId}/${this.endpoint}`, 'DELETE', {
      token,
    });
    this.resetProps();

    return response;
  }
}

class CatalogsRulesEndpoint extends BaseExtend<
  CatalogRuleResource,
  CatalogRulePage,
  CatalogRuleFilter
> {
  constructor(config: ResolvedElasticPathConfig) {
    super(createVersionlessConfig(config));

    this.endpoint = 'rules';
  }

  All<TResponse = CatalogRulePage>(token?: string): Promise<TResponse> {
    const response = this.request.send<TResponse>(
      buildURL(`catalogs/${this.endpoint}`, {
        limit: this.limit,
        offset: this.offset,
        filter: this.filter,
      }),
      'GET',
      { token },
    );
    this.resetProps();

    return response;
  }

  Get<TResponse = CatalogRuleResource>(catalogRuleId: string, token?: string): Promise<TResponse> {
    const response = this.request.send<TResponse>(
      `catalogs/${this.endpoint}/${catalogRuleId}`,
      'GET',
      {
        token,
      },
    );
    this.resetProps();

    return response;
  }

  Create(body: CreateRuleBody, token?: string) {
    const response = this.request.send<CatalogRuleResource>(`catalogs/${this.endpoint}`, 'POST', {
      body: mergeTypeIntoBody(body, 'catalog_rule'),
      token,
    });
    this.resetProps();

    return response;
  }

  Update(catalogRuleId: string, body: UpdateCatalogRuleBody, token?: string) {
    const response = this.request.send<CatalogRuleResource>(
      `catalogs/${this.endpoint}/${catalogRuleId}`,
      'PUT',
      {
        body: mergeTypeIntoBody(body, 'catalog_rule'),
        token,
      },
    );
    this.resetProps();

    return response;
  }

  Delete(catalogRuleId: string, token?: string) {
    const response = this.request.send<void>(
      `catalogs/${this.endpoint}/${catalogRuleId}`,
      'DELETE',
      {
        token,
      },
    );
    this.resetProps();

    return response;
  }
}

export class CatalogsEndpoint extends CRUDExtend<
  CatalogResource,
  CatalogPage,
  CreateCatalogBody,
  UpdateCatalogBody,
  CatalogFilter
> {
  readonly Nodes: CatalogsNodesEndpoint;
  readonly Products: CatalogsProductsEndpoint;
  readonly Releases: CatalogsReleasesEndpoint;
  readonly Rules: CatalogsRulesEndpoint;

  constructor(config: ResolvedElasticPathConfig) {
    const endpointConfig = createVersionlessConfig(config);

    super(endpointConfig);

    this.endpoint = 'catalogs';
    this.resourceType = 'catalog';
    this.updateMethod = 'PUT';
    this.Nodes = new CatalogsNodesEndpoint(endpointConfig);
    this.Products = new CatalogsProductsEndpoint(endpointConfig);
    this.Releases = new CatalogsReleasesEndpoint(endpointConfig);
    this.Rules = new CatalogsRulesEndpoint(endpointConfig);
  }

  GetCatalogReleases(catalogId: string, token?: string) {
    return this.Releases.All(catalogId, token);
  }

  DeleteCatalogRelease(catalogId: string, releaseId: string, token?: string) {
    return this.Releases.Delete(catalogId, releaseId, token);
  }

  DeleteAllCatalogReleases(catalogId: string, token?: string) {
    return this.Releases.DeleteAll(catalogId, token);
  }
}
