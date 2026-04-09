export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
export type ElasticPathProtocol = 'https' | 'http'
export type ElasticPathVersion = 'v2' | 'v3' | 'pcm'
export type FetchImplementation = (
  input: string | URL | Request,
  init?: RequestInit
) => Promise<Response>

export interface StorageFactory {
  get(key: string): string | null | undefined
  set(key: string, value: string): void
  delete(key: string): void
}

export interface AuthResponse {
  access_token: string
  expires?: number
  expires_in?: number
  refresh_token?: string
  identifier?: 'implicit' | 'client_credentials'
  token_type?: string
}

export type CustomAuthenticator = () => Promise<AuthResponse> | AuthResponse

export interface ElasticPathConfigOptions {
  name?: string
  application?: string
  clientId?: string
  client_id?: string
  clientSecret?: string
  client_secret?: string
  currency?: string
  language?: string
  host?: string
  protocol?: ElasticPathProtocol
  version?: ElasticPathVersion
  custom_fetch?: FetchImplementation
  custom_authenticator?: CustomAuthenticator
  fetch?: FetchImplementation
  authenticator?: CustomAuthenticator
  storage?: StorageFactory
  headers?: Record<string, string>
  disableCart?: boolean
  reauth?: boolean
  retryDelay?: number
  retryJitter?: number
  fetchMaxAttempts?: number
  throttleEnabled?: boolean
  throttleLimit?: number
  throttleInterval?: number
  storeId?: string
  store_id?: string
}

export interface ResolvedElasticPathConfig {
  name: string | undefined
  application: string
  clientId: string | undefined
  clientSecret: string | undefined
  currency: string | undefined
  language: string | undefined
  host: string
  protocol: ElasticPathProtocol
  version: ElasticPathVersion
  fetch: FetchImplementation
  authenticator: CustomAuthenticator | undefined
  storage: StorageFactory
  headers: Record<string, string>
  reauth: boolean
  retryDelay: number
  retryJitter: number
  fetchMaxAttempts: number
  throttleConfig: {
    throttleEnabled: boolean
    throttleLimit: number
    throttleInterval: number
  }
  storeId: string | undefined
  baseUrl: string
}

export interface RequestOptions {
  body?: unknown
  headers?: HeadersInit
  query?: Record<string, string | number | boolean | null | undefined>
  token?: string
  responseType?: 'json' | 'text' | 'response'
  version?: ElasticPathVersion
  wrapBody?: boolean
}
