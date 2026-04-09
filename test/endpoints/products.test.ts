import { describe, expect, it } from 'bun:test';

import { ProductsEndpoint, createClient, gateway } from '../../src';
import type {
  CreateProductBody,
  ProductFilter,
  ProductInclude,
  ProductPage,
  ProductResource,
  ProductSort,
  UpdateProductBody,
} from '../../src';

const resolveInput = (input: string | URL | Request): string => {
  if (typeof input === 'string') {
    return input;
  }

  if (input instanceof URL) {
    return input.toString();
  }

  return input.url;
};

function assertProductEndpointTypes(): void {
  const client = createClient();
  const filter: ProductFilter = { eq: { brand: { id: 'brand-1' }, sku: 'ABC-123' } };
  const sort: ProductSort = '-created_at';
  const include: ProductInclude = 'files';
  const createBody: CreateProductBody = {
    name: 'Starter product',
    slug: 'starter-product',
    sku: 'ABC-123',
    manage_stock: true,
    description: 'Starter description',
    price: [{ amount: 1000, currency: 'USD', includes_tax: false }],
    commodity_type: 'physical',
  };
  const updateBody: UpdateProductBody = { name: 'Updated product' };

  const endpoint = client.Products.Filter(filter).Sort(sort).With([include]);
  const pagePromise: Promise<ProductPage> = endpoint.All();
  const getPromise: Promise<ProductResource> = client.Products.Get('product-1');
  const createPromise: Promise<ProductResource> = client.Products.Create(createBody);
  const updatePromise: Promise<ProductResource> = client.Products.Update('product-1', updateBody);

  void pagePromise;
  void getPromise;
  void createPromise;
  void updatePromise;
}

describe('products endpoint', () => {
  it('exposes Products as a property endpoint', () => {
    const client = createClient();

    expect(client.Products).toBeInstanceOf(ProductsEndpoint);
    expect(client.Products.config.version).toBe('pcm');
    expect(typeof client.Products.All).toBe('function');
  });

  it('uses typed product endpoint defaults for list queries', async () => {
    const requests: Array<{ input: string; init: RequestInit | undefined }> = [];

    const client = gateway({
      client_id: 'client-id',
      custom_authenticator: () =>
        Promise.resolve({
          access_token: 'token-123',
          expires: Math.floor(Date.now() / 1000) + 60,
        }),
      custom_fetch: (input, init) => {
        requests.push({
          input: resolveInput(input),
          init,
        });

        return Promise.resolve(
          Response.json({
            data: [],
          }),
        );
      },
    });

    await client.Products.Filter({ eq: { sku: 'ABC-123' } })
      .Sort('-created_at')
      .With(['files', 'brands'])
      .All();

    expect(requests).toHaveLength(1);
    expect(requests[0]?.input).toBe(
      'https://euwest.api.elasticpath.com/pcm/products?include=files,brands&sort=-created_at&filter=eq(sku,ABC-123)',
    );
  });

  it('injects the product type for endpoint create and update calls', async () => {
    const requests: Array<{ input: string; init: RequestInit | undefined }> = [];

    const client = gateway({
      client_id: 'client-id',
      custom_authenticator: () =>
        Promise.resolve({
          access_token: 'token-123',
          expires: Math.floor(Date.now() / 1000) + 60,
        }),
      custom_fetch: (input, init) => {
        requests.push({
          input: resolveInput(input),
          init,
        });

        return Promise.resolve(
          Response.json({
            data: {
              id: 'product-1',
            },
          }),
        );
      },
    });

    await client.Products.Create({
      name: 'Starter product',
      slug: 'starter-product',
      sku: 'ABC-123',
      manage_stock: true,
      description: 'Starter description',
      price: [
        {
          amount: 1000,
          currency: 'USD',
          includes_tax: false,
        },
      ],
      commodity_type: 'physical',
    });

    await client.Products.Update('product-1', {
      name: 'Updated product',
    });

    expect(requests).toHaveLength(2);
    expect(requests[0]?.input).toBe('https://euwest.api.elasticpath.com/pcm/products');
    expect(requests[0]?.init?.body).toBe(
      JSON.stringify({
        data: {
          name: 'Starter product',
          slug: 'starter-product',
          sku: 'ABC-123',
          manage_stock: true,
          description: 'Starter description',
          price: [
            {
              amount: 1000,
              currency: 'USD',
              includes_tax: false,
            },
          ],
          commodity_type: 'physical',
          type: 'product',
        },
      }),
    );
    expect(requests[1]?.input).toBe('https://euwest.api.elasticpath.com/pcm/products/product-1');
    expect(requests[1]?.init?.body).toBe(
      JSON.stringify({
        data: {
          name: 'Updated product',
          type: 'product',
        },
      }),
    );
  });

  it('preserves the typed endpoint surface at compile time', () => {
    assertProductEndpointTypes();
    expect(true).toBe(true);
  });
});
