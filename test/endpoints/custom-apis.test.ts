import { describe, expect, it } from 'bun:test';

import { CustomApisEndpoint, createClient } from '../../src';
import { createMockClient, parseJsonBody } from '../helpers/http';

function assertCustomApisEndpointTypes(): void {
  const client = createClient();
  const filter = { eq: { slug: 'inventory' } } as Parameters<CustomApisEndpoint['Filter']>[0];
  const sort = '-name' as Parameters<CustomApisEndpoint['Sort']>[0];
  const createBody = { slug: 'inventory' } as Parameters<CustomApisEndpoint['Create']>[0];
  const updateBody = { slug: 'inventory-v2' } as Parameters<CustomApisEndpoint['Update']>[1];
  const fieldBody = { name: 'sku' } as Parameters<CustomApisEndpoint['CreateField']>[1];
  const entryBody = { sku: 'ABC-123' } as Parameters<CustomApisEndpoint['CreateEntry']>[1];

  const pagePromise = client.CustomApis.Filter(filter).Sort(sort).All();
  const getPromise = client.CustomApis.Get('api-1');
  const createPromise = client.CustomApis.Create(createBody);
  const updatePromise = client.CustomApis.Update('api-1', updateBody);
  const fieldsPromise = client.CustomApis.GetFields('api-1');
  const fieldPromise = client.CustomApis.GetField('api-1', 'field-1');
  const createFieldPromise = client.CustomApis.CreateField('api-1', fieldBody);
  const updateFieldPromise = client.CustomApis.UpdateField('api-1', 'field-1', fieldBody);
  const deleteFieldPromise = client.CustomApis.DeleteField('api-1', 'field-1');
  const entriesPromise = client.CustomApis.GetEntries('api-1');
  const entryPromise = client.CustomApis.GetEntry('api-1', 'entry-1');
  const createEntryPromise = client.CustomApis.CreateEntry('api-1', entryBody);
  const updateEntryPromise = client.CustomApis.UpdateEntry('api-1', 'entry-1', entryBody);
  const deleteEntryPromise = client.CustomApis.DeleteEntry('api-1', 'entry-1');
  const slugEntriesPromise = client.CustomApis.GetEntriesBySlug('inventory');
  const slugEntryPromise = client.CustomApis.GetEntryBySlug('inventory', 'entry-1');
  const slugCreatePromise = client.CustomApis.CreateEntryBySlug('inventory', entryBody);
  const slugUpdatePromise = client.CustomApis.UpdateEntryBySlug('inventory', 'entry-1', entryBody);
  const slugDeletePromise = client.CustomApis.DeleteEntryBySlug('inventory', 'entry-1');

  void pagePromise;
  void getPromise;
  void createPromise;
  void updatePromise;
  void fieldsPromise;
  void fieldPromise;
  void createFieldPromise;
  void updateFieldPromise;
  void deleteFieldPromise;
  void entriesPromise;
  void entryPromise;
  void createEntryPromise;
  void updateEntryPromise;
  void deleteEntryPromise;
  void slugEntriesPromise;
  void slugEntryPromise;
  void slugCreatePromise;
  void slugUpdatePromise;
  void slugDeletePromise;
}

describe('custom-apis endpoint', () => {
  it('exposes CustomApis as a property endpoint', () => {
    const client = createClient();

    expect(client.CustomApis).toBeInstanceOf(CustomApisEndpoint);
    expect(client.CustomApis.config.version).toBe('v2');
    expect(typeof client.CustomApis.GetEntriesBySlug).toBe('function');
  });

  it('builds CRUD, field, entry, and slug-based custom API requests', async () => {
    const { client, requests } = createMockClient();
    const createBody = { slug: 'inventory' } as Parameters<CustomApisEndpoint['Create']>[0];
    const updateBody = { slug: 'inventory-v2' } as Parameters<CustomApisEndpoint['Update']>[1];
    const fieldBody = { name: 'sku' } as Parameters<CustomApisEndpoint['CreateField']>[1];
    const entryBody = { sku: 'ABC-123' } as Parameters<CustomApisEndpoint['CreateEntry']>[1];

    await client.CustomApis.Sort('-name' as Parameters<CustomApisEndpoint['Sort']>[0])
      .Limit(5)
      .Offset(10)
      .Filter({ eq: { slug: 'inventory' } } as Parameters<CustomApisEndpoint['Filter']>[0])
      .All();
    await client.CustomApis.Create(createBody);
    await client.CustomApis.Update('api-1', updateBody);
    await client.CustomApis.Sort('-name' as Parameters<CustomApisEndpoint['Sort']>[0])
      .Limit(2)
      .Offset(4)
      .GetFields('api-1');
    await client.CustomApis.GetField('api-1', 'field-1');
    await client.CustomApis.CreateField('api-1', fieldBody);
    await client.CustomApis.UpdateField('api-1', 'field-1', fieldBody);
    await client.CustomApis.DeleteField('api-1', 'field-1');
    await client.CustomApis.Sort('-name' as Parameters<CustomApisEndpoint['Sort']>[0])
      .Limit(3)
      .Offset(6)
      .Filter({ eq: { sku: 'ABC-123' } } as Parameters<CustomApisEndpoint['Filter']>[0])
      .GetEntries('api-1');
    await client.CustomApis.GetEntry('api-1', 'entry-1');
    await client.CustomApis.CreateEntry('api-1', entryBody);
    await client.CustomApis.UpdateEntry('api-1', 'entry-1', entryBody);
    await client.CustomApis.DeleteEntry('api-1', 'entry-1');
    await client.CustomApis.Sort('-name' as Parameters<CustomApisEndpoint['Sort']>[0])
      .Limit(7)
      .Offset(14)
      .Filter({ eq: { sku: 'ABC-123' } } as Parameters<CustomApisEndpoint['Filter']>[0])
      .GetEntriesBySlug('inventory');
    await client.CustomApis.GetEntryBySlug('inventory', 'entry-1');
    await client.CustomApis.CreateEntryBySlug('inventory', entryBody);
    await client.CustomApis.UpdateEntryBySlug('inventory', 'entry-1', entryBody);
    await client.CustomApis.DeleteEntryBySlug('inventory', 'entry-1');

    expect(requests).toHaveLength(18);
    expect(requests[0]?.input).toBe(
      'https://euwest.api.elasticpath.com/v2/settings/extensions/custom-apis?sort=-name&page[limit]=5&page[offset]=10&filter=eq(slug,inventory)',
    );
    expect(requests[1]?.input).toBe(
      'https://euwest.api.elasticpath.com/v2/settings/extensions/custom-apis',
    );
    expect(requests[2]?.input).toBe(
      'https://euwest.api.elasticpath.com/v2/settings/extensions/custom-apis/api-1',
    );
    expect(requests[3]?.input).toBe(
      'https://euwest.api.elasticpath.com/v2/settings/extensions/custom-apis/api-1/fields?sort=-name&page[limit]=2&page[offset]=4',
    );
    expect(requests[4]?.input).toBe(
      'https://euwest.api.elasticpath.com/v2/settings/extensions/custom-apis/api-1/fields/field-1',
    );
    expect(requests[5]?.input).toBe(
      'https://euwest.api.elasticpath.com/v2/settings/extensions/custom-apis/api-1/fields',
    );
    expect(requests[6]?.input).toBe(
      'https://euwest.api.elasticpath.com/v2/settings/extensions/custom-apis/api-1/fields/field-1',
    );
    expect(requests[7]?.input).toBe(
      'https://euwest.api.elasticpath.com/v2/settings/extensions/custom-apis/api-1/fields/field-1',
    );
    expect(requests[8]?.input).toBe(
      'https://euwest.api.elasticpath.com/v2/settings/extensions/custom-apis/api-1/entries?sort=-name&page[limit]=3&page[offset]=6&filter=eq(sku,ABC-123)',
    );
    expect(requests[9]?.input).toBe(
      'https://euwest.api.elasticpath.com/v2/settings/extensions/custom-apis/api-1/entries/entry-1',
    );
    expect(requests[10]?.input).toBe(
      'https://euwest.api.elasticpath.com/v2/settings/extensions/custom-apis/api-1/entries',
    );
    expect(requests[11]?.input).toBe(
      'https://euwest.api.elasticpath.com/v2/settings/extensions/custom-apis/api-1/entries/entry-1',
    );
    expect(requests[12]?.input).toBe(
      'https://euwest.api.elasticpath.com/v2/settings/extensions/custom-apis/api-1/entries/entry-1',
    );
    expect(requests[13]?.input).toBe(
      'https://euwest.api.elasticpath.com/v2/extensions/inventory?sort=-name&page[limit]=7&page[offset]=14&filter=eq(sku,ABC-123)',
    );
    expect(requests[14]?.input).toBe(
      'https://euwest.api.elasticpath.com/v2/extensions/inventory/entry-1',
    );
    expect(requests[15]?.input).toBe('https://euwest.api.elasticpath.com/v2/extensions/inventory');
    expect(requests[16]?.input).toBe(
      'https://euwest.api.elasticpath.com/v2/extensions/inventory/entry-1',
    );
    expect(requests[17]?.input).toBe(
      'https://euwest.api.elasticpath.com/v2/extensions/inventory/entry-1',
    );
    expect(requests[2]?.init?.method).toBe('PUT');
    expect(requests[6]?.init?.method).toBe('PUT');
    expect(requests[11]?.init?.method).toBe('PUT');
    expect(requests[16]?.init?.method).toBe('PUT');
    expect(parseJsonBody(requests[1])).toEqual({ data: createBody });
    expect(parseJsonBody(requests[2])).toEqual({ data: updateBody });
    expect(parseJsonBody(requests[5])).toEqual({ data: fieldBody });
    expect(parseJsonBody(requests[6])).toEqual({ data: fieldBody });
    expect(parseJsonBody(requests[10])).toEqual({ data: entryBody });
    expect(parseJsonBody(requests[11])).toEqual({ data: entryBody });
    expect(parseJsonBody(requests[15])).toEqual({ data: entryBody });
    expect(parseJsonBody(requests[16])).toEqual({ data: entryBody });
  });

  it('preserves the typed endpoint surface at compile time', () => {
    assertCustomApisEndpointTypes();
    expect(true).toBe(true);
  });
});
