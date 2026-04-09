import {
  DEFAULT_HOST,
  DEFAULT_PROTOCOL,
  DEFAULT_VERSION,
  resolveConfig,
  resolveCredentialsStorageKey,
} from './config';
import { AccountTagsEndpoint } from './endpoints/account-tags';
import { AccountsEndpoint } from './endpoints/accounts';
import { ShopperCatalogEndpoint } from './endpoints/shopper-catalog';
import { CatalogsEndpoint } from './endpoints/catalogs';
import { CustomApisEndpoint } from './endpoints/custom-apis';
import { CustomRelationshipsEndpoint } from './endpoints/custom-relationships';
import { FieldsEndpoint } from './endpoints/fields';
import { FlowsEndpoint } from './endpoints/flows';
import { HierarchiesEndpoint } from './endpoints/hierarchies/hierarchies';
import { NodesEndpoint } from './endpoints/nodes';
import { PriceBookPricesEndpoint, PriceBooksEndpoint } from './endpoints/price-books';
import { ProductsEndpoint } from './endpoints/products';
import { VariationsEndpoint } from './endpoints/variations';
import LocalStorageFactory from './factories/local-storage';
import MemoryStorageFactory from './factories/memory-storage';
import RequestFactory, { ElasticPathApiError } from './factories/request';
import type {
  AuthResponse,
  CustomAuthenticator,
  ElasticPathConfigOptions,
  ElasticPathProtocol,
  ElasticPathRouteVersion,
  ElasticPathVersion,
  FetchImplementation,
  HttpMethod,
  RequestOptions,
  ResolvedElasticPathConfig,
  StorageFactory,
} from './types';

export class ElasticPath {
  readonly config: ResolvedElasticPathConfig;
  readonly request: RequestFactory;
  readonly storage: StorageFactory;

  /** Endpoints */
  readonly AccountTags: AccountTagsEndpoint;
  readonly Accounts: AccountsEndpoint;
  readonly ShopperCatalog: ShopperCatalogEndpoint;
  readonly Catalogs: CatalogsEndpoint;
  readonly CustomApis: CustomApisEndpoint;
  readonly CustomRelationships: CustomRelationshipsEndpoint;
  readonly Fields: FieldsEndpoint;
  readonly Flows: FlowsEndpoint;
  readonly Hierarchies: HierarchiesEndpoint;
  readonly Nodes: NodesEndpoint;
  readonly PriceBooks: PriceBooksEndpoint;
  readonly PriceBookPrices: PriceBookPricesEndpoint;
  readonly Products: ProductsEndpoint;
  readonly Variations: VariationsEndpoint;
  /** Endpoints END */

  constructor(options: ElasticPathConfigOptions = {}) {
    this.config = resolveConfig(options);
    this.request = new RequestFactory(this.config);
    this.storage = this.config.storage;

    // Initialize endpoints
    this.AccountTags = new AccountTagsEndpoint(this.config);
    this.Accounts = new AccountsEndpoint(this.config);
    this.ShopperCatalog = new ShopperCatalogEndpoint(this.config);
    this.Catalogs = new CatalogsEndpoint(this.config);
    this.CustomApis = new CustomApisEndpoint(this.config);
    this.CustomRelationships = new CustomRelationshipsEndpoint(this.config);
    this.Fields = new FieldsEndpoint(this.config);
    this.Flows = new FlowsEndpoint(this.config);
    this.Hierarchies = new HierarchiesEndpoint(this.config);
    this.Nodes = new NodesEndpoint(this.config);
    this.PriceBooks = new PriceBooksEndpoint(this.config);
    this.PriceBookPrices = new PriceBookPricesEndpoint(this.config);
    this.Products = new ProductsEndpoint(this.config);
    this.Variations = new VariationsEndpoint(this.config);
  }

  authenticate(): Promise<AuthResponse> {
    return this.request.authenticate();
  }

  send<T = unknown>(path: string, method: HttpMethod, options?: RequestOptions): Promise<T> {
    return this.request.send<T>(path, method, options);
  }
}

export const gateway = (options: ElasticPathConfigOptions = {}): ElasticPath => {
  return new ElasticPath(options);
};

export const createClient = gateway;

export {
  DEFAULT_HOST,
  DEFAULT_PROTOCOL,
  DEFAULT_VERSION,
  AccountTagsEndpoint,
  AccountsEndpoint,
  ShopperCatalogEndpoint,
  CatalogsEndpoint,
  CustomApisEndpoint,
  CustomRelationshipsEndpoint,
  ElasticPathApiError,
  FieldsEndpoint,
  FlowsEndpoint,
  HierarchiesEndpoint,
  LocalStorageFactory,
  MemoryStorageFactory,
  NodesEndpoint,
  PriceBookPricesEndpoint,
  PriceBooksEndpoint,
  ProductsEndpoint,
  RequestFactory,
  resolveConfig,
  resolveCredentialsStorageKey,
  VariationsEndpoint,
};

export type {
  AuthResponse,
  CustomAuthenticator,
  ElasticPathConfigOptions,
  ElasticPathProtocol,
  ElasticPathRouteVersion,
  ElasticPathVersion,
  FetchImplementation,
  HttpMethod,
  RequestOptions,
  ResolvedElasticPathConfig,
  StorageFactory,
};

export type * from './endpoints/account-tags';
export type * from './endpoints/accounts';
export type * from './endpoints/shopper-catalog';
export type * from './endpoints/catalogs';
export type * from './endpoints/custom-apis';
export type * from './endpoints/custom-relationships';
export type * from './endpoints/fields';
export type * from './endpoints/flows';
export type * from './endpoints/hierarchies';
export type * from './endpoints/nodes';
export type * from './endpoints/price-books';
export type * from './endpoints/products';
export type * from './endpoints/variations';
export type * from './types/pcm';

export default ElasticPath;
