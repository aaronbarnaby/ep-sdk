import { describe, expect, it } from 'bun:test';

import { NodesEndpoint, createClient } from '../../src';
import { createMockClient, parseJsonBody } from '../helpers/http';

function assertNodesEndpointTypes(): void {
  const client = createClient();
  const createBody = { name: 'Shoes' } as unknown as Parameters<NodesEndpoint['Create']>[1];
  const updateBody = { name: 'Boots' } as unknown as Parameters<NodesEndpoint['Update']>[2];

  const pagePromise = client.Nodes.Limit(25).Offset(5).All('hierarchy-1');
  const getPromise = client.Nodes.Get('hierarchy-1', 'node-1');
  const createPromise = client.Nodes.Create('hierarchy-1', createBody);
  const updatePromise = client.Nodes.Update('hierarchy-1', 'node-1', updateBody);
  const deletePromise = client.Nodes.Delete('hierarchy-1', 'node-1');
  const childrenPromise = client.Nodes.GetNodeChildren('hierarchy-1', 'node-1');

  void pagePromise;
  void getPromise;
  void createPromise;
  void updatePromise;
  void deletePromise;
  void childrenPromise;
}

describe('nodes endpoint', () => {
  it('exposes Nodes as a property endpoint', () => {
    const client = createClient();

    expect(client.Nodes).toBeInstanceOf(NodesEndpoint);
    expect(client.Nodes.config.version).toBe('pcm');
    expect(typeof client.Nodes.GetNodeChildren).toBe('function');
  });

  it('builds PCM node CRUD and children requests', async () => {
    const { client, requests } = createMockClient();
    const createBody = { name: 'Shoes' } as unknown as Parameters<NodesEndpoint['Create']>[1];
    const updateBody = { name: 'Boots' } as unknown as Parameters<NodesEndpoint['Update']>[2];

    await client.Nodes.Limit(25).Offset(5).All('hierarchy-1');
    await client.Nodes.Get('hierarchy-1', 'node-1');
    await client.Nodes.Create('hierarchy-1', createBody);
    await client.Nodes.Update('hierarchy-1', 'node-1', updateBody);
    await client.Nodes.Delete('hierarchy-1', 'node-1');
    await client.Nodes.Limit(10).GetNodeChildren('hierarchy-1', 'node-1');

    expect(requests).toHaveLength(6);
    expect(requests[0]?.input).toBe(
      'https://euwest.api.elasticpath.com/pcm/hierarchies/hierarchy-1/nodes?page[limit]=25&page[offset]=5',
    );
    expect(requests[1]?.input).toBe(
      'https://euwest.api.elasticpath.com/pcm/hierarchies/hierarchy-1/nodes/node-1',
    );
    expect(requests[2]?.input).toBe(
      'https://euwest.api.elasticpath.com/pcm/hierarchies/hierarchy-1/nodes',
    );
    expect(requests[3]?.input).toBe(
      'https://euwest.api.elasticpath.com/pcm/hierarchies/hierarchy-1/nodes/node-1',
    );
    expect(requests[4]?.input).toBe(
      'https://euwest.api.elasticpath.com/pcm/hierarchies/hierarchy-1/nodes/node-1',
    );
    expect(requests[5]?.input).toBe(
      'https://euwest.api.elasticpath.com/pcm/hierarchies/hierarchy-1/nodes/node-1/children?page[limit]=10',
    );
    expect(requests[3]?.init?.method).toBe('PUT');
    expect(parseJsonBody(requests[2])).toEqual({
      data: {
        name: 'Shoes',
        type: 'node',
      },
    });
    expect(parseJsonBody(requests[3])).toEqual({
      data: {
        name: 'Boots',
        type: 'node',
      },
    });
  });

  it('preserves the typed endpoint surface at compile time', () => {
    assertNodesEndpointTypes();
    expect(true).toBe(true);
  });
});
