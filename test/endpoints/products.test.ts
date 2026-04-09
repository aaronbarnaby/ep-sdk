import { describe, expect, it } from 'bun:test';

import { ProductsEndpoint, createClient, gateway } from '../../src';
import type {
  CreateProductBody,
  ProductAttachmentBody,
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
  const sort: ProductSort = '-name';
  const include: ProductInclude = 'main_image';
  const createBody: CreateProductBody = {
    attributes: {
      name: 'Starter product',
      slug: 'starter-product',
      sku: 'ABC-123',
      description: 'Starter description',
      commodity_type: 'physical',
    },
  };
  const updateBody: UpdateProductBody = {
    id: 'product-1',
    attributes: {
      name: 'Updated product',
    },
  };
  const attachmentBody: ProductAttachmentBody = {
    filter: 'eq(sku,ABC-123)',
    node_ids: ['node-1'],
  };

  const endpoint = client.Products.Filter(filter).Sort(sort).With([include]);
  const pagePromise: Promise<ProductPage> = endpoint.All();
  const getPromise: Promise<ProductResource> = client.Products.Get('product-1');
  const createPromise: Promise<ProductResource> = client.Products.Create(createBody);
  const updatePromise: Promise<ProductResource> = client.Products.Update('product-1', updateBody);
  const childrenPromise = client.Products.GetChildren('product-1');
  const nodesPromise = client.Products.GetNodes('product-1');
  const attachPromise = client.Products.AttachNodes(attachmentBody);
  const detachPromise = client.Products.DetachNodes(attachmentBody);

  void pagePromise;
  void getPromise;
  void createPromise;
  void updatePromise;
  void childrenPromise;
  void nodesPromise;
  void attachPromise;
  void detachPromise;
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
      .Sort('-name')
      .With(['main_image', 'component_products'])
      .All();

    expect(requests).toHaveLength(1);
    expect(requests[0]?.input).toBe(
      'https://euwest.api.elasticpath.com/pcm/products?include=main_image,component_products&sort=-name&filter=eq(sku,ABC-123)',
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
      attributes: {
        name: 'Starter product',
        slug: 'starter-product',
        sku: 'ABC-123',
        description: 'Starter description',
        commodity_type: 'physical',
      },
    });

    await client.Products.Update('product-1', {
      id: 'product-1',
      attributes: {
        name: 'Updated product',
      },
    });

    expect(requests).toHaveLength(2);
    expect(requests[0]?.input).toBe('https://euwest.api.elasticpath.com/pcm/products');
    expect(requests[0]?.init?.body).toBe(
      JSON.stringify({
        data: {
          attributes: {
            name: 'Starter product',
            slug: 'starter-product',
            sku: 'ABC-123',
            description: 'Starter description',
            commodity_type: 'physical',
          },
          type: 'product',
        },
      }),
    );
    expect(requests[1]?.input).toBe('https://euwest.api.elasticpath.com/pcm/products/product-1');
    expect(requests[1]?.init?.body).toBe(
      JSON.stringify({
        data: {
          id: 'product-1',
          attributes: {
            name: 'Updated product',
          },
          type: 'product',
        },
      }),
    );
  });

  it('builds children and nodes requests for product sub-endpoints', async () => {
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
            links: {
              current: null,
            },
            meta: {
              page: {
                current: 1,
                limit: 25,
                offset: 10,
                total: 0,
              },
              results: {
                total: 0,
              },
            },
          }),
        );
      },
    });

    await client.Products.Filter({ eq: { sku: 'ABC-123' } })
      .Sort('-name')
      .With('main_image')
      .Limit(25)
      .Offset(10)
      .GetChildren('product-1');

    await client.Products.Limit(25).Offset(10).GetNodes('product-1');

    expect(requests).toHaveLength(2);
    expect(requests[0]?.input).toBe(
      'https://euwest.api.elasticpath.com/pcm/products/product-1/children?include=main_image&sort=-name&page[limit]=25&page[offset]=10&filter=eq(sku,ABC-123)',
    );
    expect(requests[1]?.input).toBe(
      'https://euwest.api.elasticpath.com/pcm/products/product-1/nodes?page[limit]=25&page[offset]=10',
    );
  });

  it('attaches and detaches nodes for products', async () => {
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

    const body: ProductAttachmentBody = {
      filter: 'eq(sku,ABC-123)',
      node_ids: ['node-1', 'node-2'],
    };

    await client.Products.AttachNodes(body);
    await client.Products.DetachNodes(body);

    expect(requests).toHaveLength(2);
    expect(requests[0]?.input).toBe('https://euwest.api.elasticpath.com/pcm/products/attach_nodes');
    expect(requests[0]?.init?.body).toBe(
      JSON.stringify({
        data: body,
      }),
    );
    expect(requests[1]?.input).toBe('https://euwest.api.elasticpath.com/pcm/products/detach_nodes');
    expect(requests[1]?.init?.body).toBe(
      JSON.stringify({
        data: body,
      }),
    );
  });

  it('preserves the typed endpoint surface at compile time', () => {
    assertProductEndpointTypes();
    expect(true).toBe(true);
  });
});
