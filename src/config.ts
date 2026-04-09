import MemoryStorageFactory from './factories/memory-storage'
import type {
  ElasticPathConfigOptions,
  ResolvedElasticPathConfig
} from './types'

export const DEFAULT_HOST = 'euwest.api.elasticpath.com'
export const DEFAULT_PROTOCOL = 'https'
export const DEFAULT_VERSION = 'v2'
export const DEFAULT_APPLICATION = 'ep-sdk'

const DEFAULT_RETRY_DELAY = 1_000
const DEFAULT_RETRY_JITTER = 500
const DEFAULT_FETCH_MAX_ATTEMPTS = 4
const DEFAULT_THROTTLE_LIMIT = 3
const DEFAULT_THROTTLE_INTERVAL = 125

export const resolveCredentialsStorageKey = (name?: string): string => {
  return name ? `ep-sdk:${name}:credentials` : 'ep-sdk:credentials'
}

export const resolveConfig = (
  options: ElasticPathConfigOptions = {}
): ResolvedElasticPathConfig => {
  const fetchImplementation = options.fetch ?? options.custom_fetch ?? fetch
  const authenticator = options.authenticator ?? options.custom_authenticator

  if (typeof fetchImplementation !== 'function') {
    throw new TypeError('custom_fetch must be a function when provided')
  }

  if (authenticator && typeof authenticator !== 'function') {
    throw new TypeError('custom_authenticator must be a function when provided')
  }

  const protocol = options.protocol ?? DEFAULT_PROTOCOL
  const host = options.host ?? DEFAULT_HOST
  const version = options.version ?? DEFAULT_VERSION

  return {
    name: options.name,
    application: options.application ?? DEFAULT_APPLICATION,
    clientId: options.clientId ?? options.client_id,
    clientSecret: options.clientSecret ?? options.client_secret,
    currency: options.currency,
    language: options.language,
    host,
    protocol,
    version,
    fetch: fetchImplementation,
    authenticator,
    storage: options.storage ?? new MemoryStorageFactory(),
    headers: { ...(options.headers ?? {}) },
    reauth: options.reauth ?? true,
    retryDelay: options.retryDelay ?? DEFAULT_RETRY_DELAY,
    retryJitter: options.retryJitter ?? DEFAULT_RETRY_JITTER,
    fetchMaxAttempts: options.fetchMaxAttempts ?? DEFAULT_FETCH_MAX_ATTEMPTS,
    throttleConfig: {
      throttleEnabled: options.throttleEnabled ?? false,
      throttleLimit: options.throttleLimit ?? DEFAULT_THROTTLE_LIMIT,
      throttleInterval: options.throttleInterval ?? DEFAULT_THROTTLE_INTERVAL
    },
    storeId: options.storeId ?? options.store_id,
    baseUrl: `${protocol}://${host}/${version}`
  }
}
