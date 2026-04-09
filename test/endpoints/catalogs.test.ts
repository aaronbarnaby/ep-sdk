import { describe, expect, it } from 'bun:test';

import { CatalogsEndpoint, createClient } from '../../src';
import { createMockClient, parseJsonBody } from '../helpers/http';

function assertCatalogsEndpointTypes(): void {
  const client = createClient();
  const createBody = { name: 'Summer catalog' } as unknown as Parameters<
    CatalogsEndpoint['Create']
  >[0];
  const updateBody = { name: 'Summer 2025' } as unknown as Parameters<
    CatalogsEndpoint['Update']
  >[1];
  const ruleBody = { name: 'B2B rule' } as unknown as Parameters<
    CatalogsEndpoint['Rules']['Create']
  >[0];
  const updateRuleBody = { name: 'B2B rule' } as unknown as Parameters<
    CatalogsEndpoint['Rules']['Update']
  >[1];

  const pagePromise = client.Catalogs.Limit(10).All();
  const getPromise = client.Catalogs.Get('catalog-1');
  const createPromise = client.Catalogs.Create(createBody);
  const updatePromise = client.Catalogs.Update('catalog-1', updateBody);
  const nodesPromise = client.Catalogs.Nodes.All();
  const releasePromise = client.Catalogs.Releases.All('catalog-1');
  const rulesPromise = client.Catalogs.Rules.All();
  const createRulePromise = client.Catalogs.Rules.Create(ruleBody);
  const updateRulePromise = client.Catalogs.Rules.Update('rule-1', updateRuleBody);

  void pagePromise;
  void getPromise;
  void createPromise;
  void updatePromise;
  void nodesPromise;
  void releasePromise;
  void rulesPromise;
  void createRulePromise;
  void updateRulePromise;
}

describe('catalogs endpoint', () => {
  it('exposes Catalogs as a versionless property endpoint', () => {
    const client = createClient();

    expect(client.Catalogs).toBeInstanceOf(CatalogsEndpoint);
    expect(client.Catalogs.config.version).toBeUndefined();
    expect(typeof client.Catalogs.Rules.Create).toBe('function');
  });

  it('builds versionless catalog CRUD and release requests', async () => {
    const { client, requests } = createMockClient();
    const createBody = { name: 'Summer catalog' } as unknown as Parameters<
      CatalogsEndpoint['Create']
    >[0];
    const updateBody = { name: 'Summer 2025' } as unknown as Parameters<
      CatalogsEndpoint['Update']
    >[1];

    await client.Catalogs.Filter({ eq: { slug: 'summer' } } as Parameters<
      CatalogsEndpoint['Filter']
    >[0])
      .Limit(10)
      .All();
    await client.Catalogs.Create(createBody);
    await client.Catalogs.Update('catalog-1', updateBody);
    await client.Catalogs.Releases.Limit(5).All('catalog-1');
    await client.Catalogs.GetCatalogReleases('catalog-1');
    await client.Catalogs.Releases.GetAllHierarchies('catalog-1', 'release-1');
    await client.Catalogs.Releases.Create('catalog-1');
    await client.Catalogs.DeleteCatalogRelease('catalog-1', 'release-1');
    await client.Catalogs.DeleteAllCatalogReleases('catalog-1');

    expect(requests).toHaveLength(9);
    expect(requests[0]?.input).toBe(
      'https://euwest.api.elasticpath.com/catalogs?page[limit]=10&filter=eq(slug,summer)',
    );
    expect(requests[1]?.input).toBe('https://euwest.api.elasticpath.com/catalogs');
    expect(requests[2]?.input).toBe('https://euwest.api.elasticpath.com/catalogs/catalog-1');
    expect(requests[3]?.input).toBe(
      'https://euwest.api.elasticpath.com/catalogs/catalog-1/releases?page[limit]=5',
    );
    expect(requests[4]?.input).toBe(
      'https://euwest.api.elasticpath.com/catalogs/catalog-1/releases',
    );
    expect(requests[5]?.input).toBe(
      'https://euwest.api.elasticpath.com/catalogs/catalog-1/releases/release-1/hierarchies',
    );
    expect(requests[6]?.input).toBe(
      'https://euwest.api.elasticpath.com/catalogs/catalog-1/releases',
    );
    expect(requests[7]?.input).toBe(
      'https://euwest.api.elasticpath.com/catalogs/catalog-1/releases/release-1',
    );
    expect(requests[8]?.input).toBe(
      'https://euwest.api.elasticpath.com/catalogs/catalog-1/releases',
    );
    expect(requests[2]?.init?.method).toBe('PUT');
    expect(parseJsonBody(requests[1])).toEqual({
      data: {
        name: 'Summer catalog',
        type: 'catalog',
      },
    });
    expect(parseJsonBody(requests[2])).toEqual({
      data: {
        name: 'Summer 2025',
        type: 'catalog',
      },
    });
    expect(parseJsonBody(requests[6])).toEqual({
      data: {},
    });
  });

  it('builds catalog node, product, and rule requests', async () => {
    const { client, requests } = createMockClient();
    const ruleBody = { name: 'B2B rule' } as unknown as Parameters<
      CatalogsEndpoint['Rules']['Create']
    >[0];
    const updateRuleBody = { name: 'B2B rule' } as unknown as Parameters<
      CatalogsEndpoint['Rules']['Update']
    >[1];

    await client.Catalogs.Nodes.Sort('name' as Parameters<CatalogsEndpoint['Nodes']['Sort']>[0])
      .Limit(5)
      .All();
    await client.Catalogs.Nodes.GetNodeChildrenFromCatalogReleases(
      'catalog-1',
      'release-1',
      'node-1',
    );
    await client.Catalogs.Products.With(
      'main_image' as Parameters<CatalogsEndpoint['Products']['With']>[0],
    )
      .Limit(10)
      .GetAllCatalogReleaseProducts('catalog-1', 'release-1');
    await client.Catalogs.Products.GetCatalogReleaseProductChildren(
      'catalog-1',
      'release-1',
      'product-1',
    );
    await client.Catalogs.Products.GetCatalogReleaseNodeProducts(
      'catalog-1',
      'release-1',
      'node-1',
    );
    await client.Catalogs.Products.GetCatalogReleaseHierarchyProducts(
      'catalog-1',
      'release-1',
      'hierarchy-1',
    );
    await client.Catalogs.Rules.Sort('-name' as Parameters<CatalogsEndpoint['Rules']['Sort']>[0])
      .Limit(3)
      .Filter({ eq: { name: 'B2B rule' } } as Parameters<CatalogsEndpoint['Rules']['Filter']>[0])
      .All();
    await client.Catalogs.Rules.Create(ruleBody);
    await client.Catalogs.Rules.Update('rule-1', updateRuleBody);

    expect(requests).toHaveLength(9);
    expect(requests[0]?.input).toBe(
      'https://euwest.api.elasticpath.com/catalogs/nodes?page[limit]=5',
    );
    expect(requests[1]?.input).toBe(
      'https://euwest.api.elasticpath.com/catalogs/catalog-1/releases/release-1/nodes/node-1/relationships/children',
    );
    expect(requests[2]?.input).toBe(
      'https://euwest.api.elasticpath.com/catalogs/catalog-1/releases/release-1/products?include=main_image&page[limit]=10',
    );
    expect(requests[3]?.input).toBe(
      'https://euwest.api.elasticpath.com/catalogs/catalog-1/releases/release-1/products/product-1/relationships/children',
    );
    expect(requests[4]?.input).toBe(
      'https://euwest.api.elasticpath.com/catalogs/catalog-1/releases/release-1/nodes/node-1/relationships/products',
    );
    expect(requests[5]?.input).toBe(
      'https://euwest.api.elasticpath.com/catalogs/catalog-1/releases/release-1/hierarchies/hierarchy-1/relationships/products',
    );
    expect(requests[6]?.input).toBe(
      'https://euwest.api.elasticpath.com/catalogs/rules?page[limit]=3&filter=eq(name,B2B%20rule)',
    );
    expect(requests[7]?.input).toBe('https://euwest.api.elasticpath.com/catalogs/rules');
    expect(requests[8]?.input).toBe('https://euwest.api.elasticpath.com/catalogs/rules/rule-1');
    expect(requests[8]?.init?.method).toBe('PUT');
    expect(parseJsonBody(requests[7])).toEqual({
      data: {
        name: 'B2B rule',
        type: 'catalog_rule',
      },
    });
    expect(parseJsonBody(requests[8])).toEqual({
      data: {
        name: 'B2B rule',
        type: 'catalog_rule',
      },
    });
  });

  it('preserves the typed endpoint surface at compile time', () => {
    assertCatalogsEndpointTypes();
    expect(true).toBe(true);
  });
});
