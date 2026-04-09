import { describe, expect, it } from 'bun:test';

import { FlowsEndpoint, createClient } from '../../src';
import { createMockClient, parseJsonBody } from '../helpers/http';

function assertFlowsEndpointTypes(): void {
  const client = createClient();
  const filter = { eq: { slug: 'products' } } as Parameters<FlowsEndpoint['Filter']>[0];
  const createBody = { slug: 'products' } as Parameters<FlowsEndpoint['Create']>[0];
  const updateBody = { slug: 'products-v2' } as Parameters<FlowsEndpoint['Update']>[1];
  const entryBody = { sku: 'ABC-123' } as Parameters<FlowsEndpoint['CreateEntry']>[1];
  const relationshipBody = {} as Parameters<FlowsEndpoint['CreateEntryRelationship']>[3];

  const pagePromise = client.Flows.Filter(filter).All();
  const getPromise = client.Flows.Get('flow-1');
  const createPromise = client.Flows.Create(createBody);
  const updatePromise = client.Flows.Update('flow-1', updateBody);
  const entriesPromise = client.Flows.GetEntries('products');
  const entryPromise = client.Flows.GetEntry('products', 'entry-1');
  const fieldsPromise = client.Flows.GetFields('products');
  const createEntryPromise = client.Flows.CreateEntry('products', entryBody);
  const updateEntryPromise = client.Flows.UpdateEntry('products', 'entry-1', entryBody);
  const deleteEntryPromise = client.Flows.DeleteEntry('products', 'entry-1');
  const createRelationshipPromise = client.Flows.CreateEntryRelationship(
    'products',
    'entry-1',
    'related-products',
    relationshipBody,
  );
  const updateRelationshipPromise = client.Flows.UpdateEntryRelationship(
    'products',
    'entry-1',
    'related-products',
    relationshipBody,
  );
  const deleteRelationshipPromise = client.Flows.DeleteEntryRelationship(
    'products',
    'entry-1',
    'related-products',
  );

  void pagePromise;
  void getPromise;
  void createPromise;
  void updatePromise;
  void entriesPromise;
  void entryPromise;
  void fieldsPromise;
  void createEntryPromise;
  void updateEntryPromise;
  void deleteEntryPromise;
  void createRelationshipPromise;
  void updateRelationshipPromise;
  void deleteRelationshipPromise;
}

describe('flows endpoint', () => {
  it('exposes Flows as a property endpoint', () => {
    const client = createClient();

    expect(client.Flows).toBeInstanceOf(FlowsEndpoint);
    expect(client.Flows.config.version).toBe('v2');
    expect(typeof client.Flows.GetEntries).toBe('function');
  });

  it('builds flow, entry, relationship, and attribute requests', async () => {
    const { client, requests } = createMockClient();
    const createBody = { slug: 'products' } as Parameters<FlowsEndpoint['Create']>[0];
    const updateBody = { slug: 'products-v2' } as Parameters<FlowsEndpoint['Update']>[1];
    const entryBody = { sku: 'ABC-123' } as Parameters<FlowsEndpoint['CreateEntry']>[1];

    await client.Flows.GetEntries('products');
    await client.Flows.GetEntry('products', 'entry-1');
    await client.Flows.GetFields('products');
    await client.Flows.Create(createBody);
    await client.Flows.Update('flow-1', updateBody);
    await client.Flows.CreateEntry('products', entryBody);
    await client.Flows.UpdateEntry('products', 'entry-1', entryBody);
    await client.Flows.DeleteEntry('products', 'entry-1');
    await client.Flows.CreateEntryRelationship('products', 'entry-1', 'related-products', {
      data: [],
    });
    await client.Flows.UpdateEntryRelationship('products', 'entry-1', 'related-products', {
      data: [],
    });
    await client.Flows.DeleteEntryRelationship('products', 'entry-1', 'related-products');

    expect(requests).toHaveLength(11);
    expect(requests[0]?.input).toBe('https://euwest.api.elasticpath.com/v2/flows/products/entries');
    expect(requests[1]?.input).toBe(
      'https://euwest.api.elasticpath.com/v2/flows/products/entries/entry-1',
    );
    expect(requests[2]?.input).toBe('https://euwest.api.elasticpath.com/v2/flows/products/fields');
    expect(requests[3]?.input).toBe('https://euwest.api.elasticpath.com/v2/flows');
    expect(requests[4]?.input).toBe('https://euwest.api.elasticpath.com/v2/flows/flow-1');
    expect(requests[5]?.input).toBe('https://euwest.api.elasticpath.com/v2/flows/products/entries');
    expect(requests[6]?.input).toBe(
      'https://euwest.api.elasticpath.com/v2/flows/products/entries/entry-1',
    );
    expect(requests[7]?.input).toBe(
      'https://euwest.api.elasticpath.com/v2/flows/products/entries/entry-1',
    );
    expect(requests[8]?.input).toBe(
      'https://euwest.api.elasticpath.com/v2/flows/products/entries/entry-1/relationships/related-products',
    );
    expect(requests[9]?.input).toBe(
      'https://euwest.api.elasticpath.com/v2/flows/products/entries/entry-1/relationships/related-products',
    );
    expect(requests[10]?.input).toBe(
      'https://euwest.api.elasticpath.com/v2/flows/products/entries/entry-1/relationships/related-products',
    );
    expect(requests[4]?.init?.method).toBe('PUT');
    expect(parseJsonBody(requests[3])).toEqual({
      data: {
        slug: 'products',
        type: 'flow',
      },
    });
    expect(parseJsonBody(requests[4])).toEqual({
      data: {
        slug: 'products-v2',
        type: 'flow',
      },
    });
    expect(parseJsonBody(requests[5])).toEqual({
      data: {
        sku: 'ABC-123',
        type: 'entry',
      },
    });
    expect(parseJsonBody(requests[6])).toEqual({
      data: {
        sku: 'ABC-123',
        type: 'entry',
      },
    });
    expect(parseJsonBody(requests[8])).toEqual({
      data: {
        data: [],
      },
    });
    expect(parseJsonBody(requests[9])).toEqual({
      data: {
        data: [],
      },
    });
    expect(parseJsonBody(requests[10])).toEqual(undefined);
  });

  it('preserves the typed endpoint surface at compile time', () => {
    assertFlowsEndpointTypes();
    expect(true).toBe(true);
  });
});
