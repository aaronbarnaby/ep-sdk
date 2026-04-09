import { describe, expect, it } from 'bun:test';

import { CustomRelationshipsEndpoint, createClient } from '../../src';
import { createMockClient, parseJsonBody } from '../helpers/http';

function assertCustomRelationshipsEndpointTypes(): void {
  const client = createClient();
  const filter = { eq: { slug: 'related-accessories' } } as Parameters<
    CustomRelationshipsEndpoint['Filter']
  >[0];
  const createBody = { slug: 'related-accessories' } as unknown as Parameters<
    CustomRelationshipsEndpoint['Create']
  >[0];
  const updateBody = { slug: 'featured-products' } as unknown as Parameters<
    CustomRelationshipsEndpoint['Update']
  >[1];

  const pagePromise = client.CustomRelationships.Filter(filter).All();
  const getPromise = client.CustomRelationships.Get('relationship-1');
  const createPromise = client.CustomRelationships.Create(createBody);
  const updatePromise = client.CustomRelationships.Update('relationship-1', updateBody);
  const deletePromise = client.CustomRelationships.Delete('relationship-1');

  void pagePromise;
  void getPromise;
  void createPromise;
  void updatePromise;
  void deletePromise;
}

describe('custom-relationships endpoint', () => {
  it('exposes CustomRelationships as a property endpoint', () => {
    const client = createClient();

    expect(client.CustomRelationships).toBeInstanceOf(CustomRelationshipsEndpoint);
    expect(client.CustomRelationships.config.version).toBe('pcm');
    expect(typeof client.CustomRelationships.All).toBe('function');
  });

  it('builds PCM CRUD requests for custom relationships', async () => {
    const { client, requests } = createMockClient();
    const createBody = { slug: 'related-accessories' } as unknown as Parameters<
      CustomRelationshipsEndpoint['Create']
    >[0];
    const updateBody = { slug: 'featured-products' } as unknown as Parameters<
      CustomRelationshipsEndpoint['Update']
    >[1];

    await client.CustomRelationships.Filter({ eq: { slug: 'related-accessories' } } as Parameters<
      CustomRelationshipsEndpoint['Filter']
    >[0]).All();
    await client.CustomRelationships.Create(createBody);
    await client.CustomRelationships.Update('relationship-1', updateBody);
    await client.CustomRelationships.Delete('relationship-1');

    expect(requests).toHaveLength(4);
    expect(requests[0]?.input).toBe(
      'https://euwest.api.elasticpath.com/pcm/custom-relationships?filter=eq(slug,related-accessories)',
    );
    expect(requests[1]?.input).toBe('https://euwest.api.elasticpath.com/pcm/custom-relationships');
    expect(requests[2]?.input).toBe(
      'https://euwest.api.elasticpath.com/pcm/custom-relationships/relationship-1',
    );
    expect(requests[3]?.input).toBe(
      'https://euwest.api.elasticpath.com/pcm/custom-relationships/relationship-1',
    );
    expect(requests[2]?.init?.method).toBe('PUT');
    expect(parseJsonBody(requests[1])).toEqual({
      data: {
        slug: 'related-accessories',
        type: 'custom-relationship',
      },
    });
    expect(parseJsonBody(requests[2])).toEqual({
      data: {
        slug: 'featured-products',
        type: 'custom-relationship',
      },
    });
  });

  it('preserves the typed endpoint surface at compile time', () => {
    assertCustomRelationshipsEndpointTypes();
    expect(true).toBe(true);
  });
});
