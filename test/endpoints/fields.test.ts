import { describe, expect, it } from 'bun:test';

import { FieldsEndpoint, createClient } from '../../src';
import { createMockClient, parseJsonBody } from '../helpers/http';

function assertFieldsEndpointTypes(): void {
  const client = createClient();
  const filter = { eq: { slug: 'material' } } as Parameters<FieldsEndpoint['Filter']>[0];
  const createBody = { name: 'Material' } as Parameters<FieldsEndpoint['Create']>[0];
  const updateBody = { name: 'Fabric' } as Parameters<FieldsEndpoint['Update']>[1];

  const pagePromise = client.Fields.Filter(filter).All();
  const getPromise = client.Fields.Get('field-1');
  const attributesPromise = client.Fields.Attributes();
  const createPromise = client.Fields.Create(createBody);
  const updatePromise = client.Fields.Update('field-1', updateBody);
  const deletePromise = client.Fields.Delete('field-1');

  void pagePromise;
  void getPromise;
  void attributesPromise;
  void createPromise;
  void updatePromise;
  void deletePromise;
}

describe('fields endpoint', () => {
  it('exposes Fields as a property endpoint', () => {
    const client = createClient();

    expect(client.Fields).toBeInstanceOf(FieldsEndpoint);
    expect(client.Fields.config.version).toBe('v2');
    expect(typeof client.Fields.Attributes).toBe('function');
  });

  it('builds list, attributes, create, update, and delete requests for fields', async () => {
    const { client, requests } = createMockClient();
    const createBody = { name: 'Material' } as Parameters<FieldsEndpoint['Create']>[0];
    const updateBody = { name: 'Fabric' } as Parameters<FieldsEndpoint['Update']>[1];

    await client.Fields.Filter({ eq: { slug: 'material' } } as Parameters<
      FieldsEndpoint['Filter']
    >[0])
      .Limit(10)
      .All();
    await client.Fields.Attributes();
    await client.Fields.Create(createBody);
    await client.Fields.Update('field-1', updateBody);
    await client.Fields.Delete('field-1');

    expect(requests).toHaveLength(5);
    expect(requests[0]?.input).toBe(
      'https://euwest.api.elasticpath.com/v2/fields?page[limit]=10&filter=eq(slug,material)',
    );
    expect(requests[1]?.input).toBe('https://euwest.api.elasticpath.com/v2/fields/attributes');
    expect(requests[2]?.input).toBe('https://euwest.api.elasticpath.com/v2/fields');
    expect(requests[3]?.input).toBe('https://euwest.api.elasticpath.com/v2/fields/field-1');
    expect(requests[4]?.input).toBe('https://euwest.api.elasticpath.com/v2/fields/field-1');
    expect(requests[3]?.init?.method).toBe('PUT');
    expect(requests[4]?.init?.method).toBe('DELETE');
    expect(parseJsonBody(requests[2])).toEqual({
      data: {
        name: 'Material',
        type: 'field',
      },
    });
    expect(parseJsonBody(requests[3])).toEqual({
      data: {
        name: 'Fabric',
        type: 'field',
      },
    });
  });

  it('preserves the typed endpoint surface at compile time', () => {
    assertFieldsEndpointTypes();
    expect(true).toBe(true);
  });
});
