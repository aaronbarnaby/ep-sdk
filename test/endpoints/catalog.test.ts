import { describe, expect, it } from 'bun:test';

import { ShopperCatalogEndpoint } from '../../src';
import { createClient } from '../../src';
import { createMockClient, getHeaders, parseJsonBody } from '../helpers/http';

function assertCatalogEndpointTypes(): void {
  const client = createClient();
  const nodeFilter = { eq: { slug: 'boots' } } as Parameters<
    ShopperCatalogEndpoint['Nodes']['Filter']
  >[0];
  const productFilter = { eq: { sku: 'ABC-123' } } as Parameters<
    ShopperCatalogEndpoint['Products']['Filter']
  >[0];
  const include = 'main_image' as Parameters<ShopperCatalogEndpoint['Products']['With']>[0];

  const getPromise = client.ShopperCatalog.Get();
  const nodesPromise = client.ShopperCatalog.Nodes.Filter(nodeFilter).All();
  const nodePromise = client.ShopperCatalog.Nodes.Get('node-1');
  const nodeChildrenPromise = client.ShopperCatalog.Nodes.GetNodeChildren('node-1');
  const nodeProductsPromise = client.ShopperCatalog.Nodes.GetNodeProducts('node-1');
  const hierarchiesPromise = client.ShopperCatalog.Hierarchies.All();
  const hierarchyPromise = client.ShopperCatalog.Hierarchies.Get('hierarchy-1');
  const hierarchyChildrenPromise =
    client.ShopperCatalog.Hierarchies.GetHierarchyChildren('hierarchy-1');
  const hierarchyNodesPromise = client.ShopperCatalog.Hierarchies.GetHierarchyNodes('hierarchy-1');
  const productsPromise = client.ShopperCatalog.Products.Filter(productFilter).With(include).All();
  const configurePromise = client.ShopperCatalog.Products.Configure('product-1', {
    variation: {
      option: 1,
    },
  });
  const productPromise = client.ShopperCatalog.Products.With(include).Get('product-1');
  const byNodePromise = client.ShopperCatalog.Products.GetProductsByNode('node-1');
  const byHierarchyPromise = client.ShopperCatalog.Products.GetProductsByHierarchy('hierarchy-1');
  const childrenPromise = client.ShopperCatalog.Products.GetProductChildren('product-1');
  const relatedPromise = client.ShopperCatalog.Products.GetRelatedProducts('product-1', 'upsell');

  void getPromise;
  void nodesPromise;
  void nodePromise;
  void nodeChildrenPromise;
  void nodeProductsPromise;
  void hierarchiesPromise;
  void hierarchyPromise;
  void hierarchyChildrenPromise;
  void hierarchyNodesPromise;
  void productsPromise;
  void configurePromise;
  void productPromise;
  void byNodePromise;
  void byHierarchyPromise;
  void childrenPromise;
  void relatedPromise;
}

describe('catalog endpoint', () => {
  it('exposes Catalog as a versionless property endpoint', () => {
    const client = createClient();

    expect(client.ShopperCatalog).toBeInstanceOf(ShopperCatalogEndpoint);
    expect(client.ShopperCatalog.config.version).toBeUndefined();
    expect(typeof client.ShopperCatalog.Products.Configure).toBe('function');
  });

  it('builds shopper catalog root, node, and hierarchy requests with forwarded headers', async () => {
    const { client, requests } = createMockClient();

    await client.ShopperCatalog.Get(undefined, {
      'EP-Context-Tag': 'web-store',
      'X-MOLTIN-LANGUAGE': 'fr',
    });
    await client.ShopperCatalog.Nodes.Filter({ eq: { slug: 'boots' } } as Parameters<
      ShopperCatalogEndpoint['Nodes']['Filter']
    >[0])
      .Limit(10)
      .All(undefined, { 'EP-Channel': 'channel-1' });
    await client.ShopperCatalog.Nodes.GetNodeProducts('node-1', undefined, {
      'EP-Channel': 'channel-1',
    });
    await client.ShopperCatalog.Hierarchies.GetHierarchyNodes('hierarchy-1', undefined, {
      'EP-Channel': 'channel-1',
    });

    expect(requests).toHaveLength(4);
    expect(requests[0]?.input).toBe('https://euwest.api.elasticpath.com/catalog');
    expect(requests[1]?.input).toBe(
      'https://euwest.api.elasticpath.com/catalog/nodes?page[limit]=10&filter=eq(slug,boots)',
    );
    expect(requests[2]?.input).toBe(
      'https://euwest.api.elasticpath.com/catalog/nodes/node-1/relationships/products',
    );
    expect(requests[3]?.input).toBe(
      'https://euwest.api.elasticpath.com/catalog/hierarchies/hierarchy-1/nodes',
    );
    expect(getHeaders(requests[0]).get('EP-Context-Tag')).toBe('web-store');
    expect(getHeaders(requests[0]).get('X-MOLTIN-LANGUAGE')).toBe('fr');
    expect(getHeaders(requests[1]).get('EP-Channel')).toBe('channel-1');
  });

  it('builds shopper catalog product requests without a version prefix', async () => {
    const { client, requests } = createMockClient();
    const selectedOptions = {
      variation: {
        option: 1,
      },
    };

    await client.ShopperCatalog.Products.With(
      'main_image' as Parameters<ShopperCatalogEndpoint['Products']['With']>[0],
    )
      .Limit(5)
      .All(undefined, { 'EP-Context-Tag': 'web-store' });
    await client.ShopperCatalog.Products.Configure('product-1', selectedOptions, undefined, {
      'X-MOLTIN-CURRENCY': 'USD',
    });
    await client.ShopperCatalog.Products.With(
      'main_image' as Parameters<ShopperCatalogEndpoint['Products']['With']>[0],
    ).Get('product-1');
    await client.ShopperCatalog.Products.GetProductsByNode('node-1');
    await client.ShopperCatalog.Products.GetProductsByHierarchy('hierarchy-1');
    await client.ShopperCatalog.Products.GetProductChildren('product-1');
    await client.ShopperCatalog.Products.GetRelatedProducts('product-1', 'upsell');

    expect(requests).toHaveLength(7);
    expect(requests[0]?.input).toBe(
      'https://euwest.api.elasticpath.com/catalog/products?include=main_image&page[limit]=5',
    );
    expect(requests[1]?.input).toBe(
      'https://euwest.api.elasticpath.com/catalog/products/product-1/configure',
    );
    expect(requests[2]?.input).toBe(
      'https://euwest.api.elasticpath.com/catalog/products/product-1?include=main_image',
    );
    expect(requests[3]?.input).toBe(
      'https://euwest.api.elasticpath.com/catalog/nodes/node-1/relationships/products',
    );
    expect(requests[4]?.input).toBe(
      'https://euwest.api.elasticpath.com/catalog/hierarchies/hierarchy-1/products',
    );
    expect(requests[5]?.input).toBe(
      'https://euwest.api.elasticpath.com/catalog/products/product-1/relationships/children',
    );
    expect(requests[6]?.input).toBe(
      'https://euwest.api.elasticpath.com/catalog/products/product-1/relationships/upsell/products',
    );
    expect(requests[1]?.init?.method).toBe('POST');
    expect(parseJsonBody(requests[1])).toEqual({
      data: {
        selected_options: selectedOptions,
      },
    });
    expect(getHeaders(requests[1]).get('X-MOLTIN-CURRENCY')).toBe('USD');
  });

  it('preserves the typed endpoint surface at compile time', () => {
    assertCatalogEndpointTypes();
    expect(true).toBe(true);
  });
});
