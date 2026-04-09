import { describe, expect, it } from 'bun:test'

import { gateway } from '../src'

const resolveInput = (input: string | URL | Request): string => {
  if (typeof input === 'string') {
    return input
  }

  if (input instanceof URL) {
    return input.toString()
  }

  return input.url
}

describe('request factory', () => {
  it('wraps request bodies and applies auth headers from a custom authenticator', async () => {
    const requests: Array<{ input: string; init: RequestInit | undefined }> = []

    const client = gateway({
      client_id: 'client-id',
      custom_authenticator: () =>
        Promise.resolve({
          access_token: 'token-123',
          expires: Math.floor(Date.now() / 1000) + 60
        }),
      custom_fetch: (input, init) => {
        requests.push({
          input: resolveInput(input),
          init
        })

        return Promise.resolve(
          Response.json({
            data: {
              id: 'product-1'
            }
          })
        )
      }
    })

    const response = await client.request.send<{ data: { id: string } }>(
      '/products',
      'POST',
      {
        body: {
          name: 'Starter product'
        }
      }
    )

    expect(response.data.id).toBe('product-1')
    expect(requests).toHaveLength(1)
    expect(requests[0]?.input).toBe(
      'https://euwest.api.elasticpath.com/v2/products'
    )
    expect(requests[0]?.init?.body).toBe(
      JSON.stringify({
        data: {
          name: 'Starter product'
        }
      })
    )

    const headers = new Headers(requests[0]?.init?.headers)

    expect(headers.get('Authorization')).toBe('Bearer token-123')
    expect(headers.get('Content-Type')).toBe('application/json')
  })

  it('creates and caches an access token with the legacy client credential keys', async () => {
    const requests: Array<{ input: string; init: RequestInit | undefined }> = []

    const client = gateway({
      client_id: 'client-id',
      client_secret: 'client-secret',
      custom_fetch: (input, init) => {
        const requestUrl = resolveInput(input)

        requests.push({
          input: requestUrl,
          init
        })

        if (requestUrl.endsWith('/oauth/access_token')) {
          return Promise.resolve(
            Response.json({
              access_token: 'token-xyz',
              expires: Math.floor(Date.now() / 1000) + 60,
              token_type: 'Bearer'
            })
          )
        }

        return Promise.resolve(
          Response.json({
            data: {
              id: 'product-2'
            }
          })
        )
      }
    })

    const credentials = await client.authenticate()

    expect(credentials.access_token).toBe('token-xyz')

    await client.request.send('/products', 'GET')

    expect(requests).toHaveLength(2)
    expect(requests[0]?.input).toBe(
      'https://euwest.api.elasticpath.com/oauth/access_token'
    )
    expect(requests[0]?.init?.body).toBe(
      'grant_type=client_credentials&client_id=client-id&client_secret=client-secret'
    )

    const authHeaders = new Headers(requests[0]?.init?.headers)
    const resourceHeaders = new Headers(requests[1]?.init?.headers)

    expect(authHeaders.get('Content-Type')).toBe(
      'application/x-www-form-urlencoded'
    )
    expect(resourceHeaders.get('Authorization')).toBe('Bearer token-xyz')
  })
})
