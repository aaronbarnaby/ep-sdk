import type { ElasticPathConfigOptions } from '../src'

type SmokeTestClient = {
  config: {
    baseUrl: string
  }
  request: {
    send: (...args: unknown[]) => Promise<unknown>
  }
}

type DistModule = {
  gateway: (options?: ElasticPathConfigOptions) => SmokeTestClient
}

const distModule = (await import('../dist/index.js')) as unknown as DistModule

const client = distModule.gateway({
  client_id: 'dist-smoke-client'
})

console.log('Built package smoke test:')
console.log(
  JSON.stringify(
    {
      baseUrl: client.config.baseUrl,
      hasRequestFactory: typeof client.request.send === 'function'
    },
    null,
    2
  )
)
