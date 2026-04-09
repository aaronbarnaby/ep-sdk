import {
  DEFAULT_HOST,
  DEFAULT_PROTOCOL,
  DEFAULT_VERSION,
  resolveConfig,
  resolveCredentialsStorageKey,
} from './config';
import { ProductsEndpoint } from './endpoints/products';
import LocalStorageFactory from './factories/local-storage';
import MemoryStorageFactory from './factories/memory-storage';
import RequestFactory, { ElasticPathApiError } from './factories/request';
import type {
  AuthResponse,
  CustomAuthenticator,
  ElasticPathConfigOptions,
  ElasticPathProtocol,
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
  readonly Products: ProductsEndpoint;
  /** Endpoints END */

  constructor(options: ElasticPathConfigOptions = {}) {
    this.config = resolveConfig(options);
    this.request = new RequestFactory(this.config);
    this.storage = this.config.storage;

    // Initialize endpoints
    this.Products = new ProductsEndpoint(this.config);
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
  ElasticPathApiError,
  LocalStorageFactory,
  MemoryStorageFactory,
  ProductsEndpoint,
  RequestFactory,
  resolveConfig,
  resolveCredentialsStorageKey,
};

export type {
  AuthResponse,
  CustomAuthenticator,
  ElasticPathConfigOptions,
  ElasticPathProtocol,
  ElasticPathVersion,
  FetchImplementation,
  HttpMethod,
  RequestOptions,
  ResolvedElasticPathConfig,
  StorageFactory,
};

export type * from './endpoints/products';

export default ElasticPath;
