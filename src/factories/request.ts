import { resolveCredentialsStorageKey } from '../config';
import type {
  AuthResponse,
  HttpMethod,
  RequestOptions,
  ResolvedElasticPathConfig,
  StorageFactory,
} from '../types';
import { DEFAULT_RESPONSE_TYPE } from '../utils/constants';

export class ElasticPathApiError<TBody = unknown> extends Error {
  readonly status: number;
  readonly statusText: string;
  readonly body: TBody;

  constructor(message: string, status: number, statusText: string, body: TBody) {
    super(message);

    this.name = 'ElasticPathApiError';
    this.status = status;
    this.statusText = statusText;
    this.body = body;
  }
}

export class RequestFactory {
  readonly config: ResolvedElasticPathConfig;
  readonly storage: StorageFactory;

  constructor(config: ResolvedElasticPathConfig) {
    this.config = config;
    this.storage = config.storage;
  }

  async authenticate(): Promise<AuthResponse> {
    if (!this.config.clientId && !this.config.authenticator) {
      throw new Error('You must have a client_id set');
    }

    const credentials = this.config.authenticator
      ? await this.config.authenticator()
      : await this.createAuthRequest();

    if (!credentials.access_token) {
      throw new Error('Authentication did not return an access_token');
    }

    this.writeCredentials(credentials);

    return credentials;
  }

  async send<T = unknown>(
    path: string,
    method: HttpMethod,
    options: RequestOptions = {},
  ): Promise<T> {
    return this.sendInternal<T>(path, method, options, false);
  }

  private async sendInternal<T>(
    path: string,
    method: HttpMethod,
    options: RequestOptions,
    hasRetried: boolean,
  ): Promise<T> {
    const accessToken = await this.resolveAccessToken(options.token);
    const headers = mergeHeaders(this.config.headers, options.headers);
    const responseType = options.responseType ?? DEFAULT_RESPONSE_TYPE;
    const requestBody = buildRequestBody(options.body, options.wrapBody ?? true);

    if (this.config.currency) {
      headers.set('X-MOLTIN-CURRENCY', this.config.currency);
    }

    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }

    if (requestBody && !(requestBody instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    const requestInit: RequestInit = {
      method,
      headers,
    };

    if (requestBody !== undefined) {
      requestInit.body = requestBody;
    }

    const response = await this.config.fetch(
      this.buildUrl(path, options.query, options.version),
      requestInit,
    );

    if (response.status === 401 && this.config.reauth && !hasRetried && !options.token) {
      this.clearCredentials();
      await this.authenticate();
      return this.sendInternal<T>(path, method, options, true);
    }

    const responseBody = await parseResponseBody(response, responseType);

    if (!response.ok) {
      throw new ElasticPathApiError(
        `Elastic Path request failed with status ${response.status}`,
        response.status,
        response.statusText,
        responseBody,
      );
    }

    return responseBody as T;
  }

  private async createAuthRequest(): Promise<AuthResponse> {
    if (!this.config.clientId) {
      throw new Error('You must have a client_id set');
    }

    const body = new URLSearchParams({
      grant_type: this.config.clientSecret ? 'client_credentials' : 'implicit',
      client_id: this.config.clientId,
    });

    if (this.config.clientSecret) {
      body.set('client_secret', this.config.clientSecret);
    }

    const response = await this.config.fetch(
      `${this.config.protocol}://${this.config.host}/oauth/access_token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      },
    );

    const responseBody = (await parseResponseBody(response, DEFAULT_RESPONSE_TYPE)) as AuthResponse;

    if (!response.ok) {
      throw new ElasticPathApiError(
        'Elastic Path authentication failed',
        response.status,
        response.statusText,
        responseBody,
      );
    }

    return responseBody;
  }

  private resolveStoredCredentials(): AuthResponse | null {
    const rawCredentials = this.storage.get(resolveCredentialsStorageKey(this.config.name));

    if (!rawCredentials) {
      return null;
    }

    try {
      return JSON.parse(rawCredentials) as AuthResponse;
    } catch {
      this.clearCredentials();
      return null;
    }
  }

  private writeCredentials(credentials: AuthResponse): void {
    this.storage.set(resolveCredentialsStorageKey(this.config.name), JSON.stringify(credentials));
  }

  private clearCredentials(): void {
    this.storage.delete(resolveCredentialsStorageKey(this.config.name));
  }

  private isTokenExpired(credentials: AuthResponse | null): boolean {
    if (!credentials?.expires) {
      return false;
    }

    return Math.floor(Date.now() / 1000) >= credentials.expires;
  }

  private async resolveAccessToken(token?: string): Promise<string | undefined> {
    if (token) {
      return token;
    }

    if (!this.config.clientId && !this.config.authenticator) {
      return undefined;
    }

    const cachedCredentials = this.resolveStoredCredentials();

    if (cachedCredentials?.access_token && !this.isTokenExpired(cachedCredentials)) {
      return cachedCredentials.access_token;
    }

    const freshCredentials = await this.authenticate();

    return freshCredentials.access_token;
  }

  private buildUrl(
    path: string,
    query: RequestOptions['query'],
    requestedVersion = this.config.version,
  ): string {
    const normalizedPath = normalizePath(path);
    const versionPrefix = requestedVersion ? `${requestedVersion}/` : '';
    const baseUrl = `${this.config.protocol}://${this.config.host}/${versionPrefix}`;
    const url = new URL(normalizedPath, baseUrl);

    for (const [key, value] of Object.entries(query ?? {})) {
      if (value === undefined || value === null) {
        continue;
      }

      url.searchParams.append(key, String(value));
    }

    return url.toString();
  }
}

export default RequestFactory;

export const mergeHeaders = (baseHeaders: HeadersInit, overrideHeaders?: HeadersInit): Headers => {
  const headers = new Headers(baseHeaders);

  if (overrideHeaders) {
    new Headers(overrideHeaders).forEach((value, key) => {
      headers.set(key, value);
    });
  }

  return headers;
};

export const normalizePath = (path: string): string => {
  return path.startsWith('/') ? path.slice(1) : path;
};

const parseResponseBody = async (
  response: Response,
  responseType: NonNullable<RequestOptions['responseType']>,
): Promise<unknown> => {
  if (responseType === 'response') {
    return response;
  }

  if (response.status === 204) {
    return undefined;
  }

  if (responseType === 'text') {
    return response.text();
  }

  const contentType = response.headers.get('content-type');

  if (contentType?.includes('application/json')) {
    return response.json();
  }

  const text = await response.text();

  if (!text) {
    return undefined;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
};

const buildRequestBody = (body: unknown, wrapBody: boolean): BodyInit | undefined => {
  if (body === undefined) {
    return undefined;
  }

  if (body instanceof FormData) {
    return body;
  }

  const normalizedBody = wrapBody ? { data: body } : body;

  return JSON.stringify(normalizedBody);
};
