import { describe, expect, it } from 'bun:test';

import { HierarchiesEndpoint, NodesEndpoint, createClient } from '../../src';
import { createMockClient, parseJsonBody } from '../helpers/http';

function assertHierarchiesEndpointTypes(): void {
  const client = createClient();
  const createBody = { name: 'Winter' } as unknown as Parameters<HierarchiesEndpoint['Create']>[0];
  const updateBody = { name: 'Winter 2025' } as unknown as Parameters<
    HierarchiesEndpoint['Update']
  >[1];
  const duplicateBody = { name: 'Winter Copy' } as unknown as Parameters<
    HierarchiesEndpoint['Duplicate']
  >[1];
  const relationshipBody = [{ id: 'product-1', type: 'product' }] as Parameters<
    HierarchiesEndpoint['Relationships']['Create']
  >[2];
  const parentBody = { id: 'node-0', type: 'node' } as Parameters<
    HierarchiesEndpoint['Relationships']['ChangeParent']
  >[2];
  const sortBody = [{ id: 'node-2', sort_order: 1 }] as unknown as Parameters<
    HierarchiesEndpoint['Relationships']['CreateChildrenSortOrder']
  >[2];

  const pagePromise = client.Hierarchies.Limit(10).All();
  const getPromise = client.Hierarchies.Get('hierarchy-1');
  const createPromise = client.Hierarchies.Create(createBody);
  const updatePromise = client.Hierarchies.Update('hierarchy-1', updateBody);
  const childrenPromise = client.Hierarchies.Children('hierarchy-1');
  const duplicatePromise = client.Hierarchies.Duplicate('hierarchy-1', duplicateBody);
  const nodesByIdsPromise = client.Hierarchies.GetNodesByIds(['node-1']);
  const nestedNodesPromise = client.Hierarchies.Nodes.GetNodeChildren('hierarchy-1', 'node-1');
  const createRelationshipPromise = client.Hierarchies.Relationships.Create(
    'hierarchy-1',
    'node-1',
    relationshipBody,
  );
  const updateRelationshipPromise = client.Hierarchies.Relationships.Update(
    'hierarchy-1',
    'node-1',
    relationshipBody,
  );
  const deleteRelationshipPromise = client.Hierarchies.Relationships.Delete(
    'hierarchy-1',
    'node-1',
    relationshipBody,
  );
  const productsPromise = client.Hierarchies.Relationships.Products('hierarchy-1', 'node-1');
  const changeParentPromise = client.Hierarchies.Relationships.ChangeParent(
    'hierarchy-1',
    'node-1',
    parentBody,
  );
  const deleteParentPromise = client.Hierarchies.Relationships.DeleteParent(
    'hierarchy-1',
    'node-1',
  );
  const sortPromise = client.Hierarchies.Relationships.CreateChildrenSortOrder(
    'hierarchy-1',
    'node-1',
    sortBody,
  );

  void pagePromise;
  void getPromise;
  void createPromise;
  void updatePromise;
  void childrenPromise;
  void duplicatePromise;
  void nodesByIdsPromise;
  void nestedNodesPromise;
  void createRelationshipPromise;
  void updateRelationshipPromise;
  void deleteRelationshipPromise;
  void productsPromise;
  void changeParentPromise;
  void deleteParentPromise;
  void sortPromise;
}

describe('hierarchies endpoint', () => {
  it('exposes Hierarchies with nested Nodes and Relationships', () => {
    const client = createClient();

    expect(client.Hierarchies).toBeInstanceOf(HierarchiesEndpoint);
    expect(client.Hierarchies.config.version).toBe('pcm');
    expect(client.Hierarchies.Nodes).toBeInstanceOf(NodesEndpoint);
    expect(typeof client.Hierarchies.Relationships.ChangeParent).toBe('function');
  });

  it('builds hierarchy CRUD, duplicate, child, and lookup requests', async () => {
    const { client, requests } = createMockClient();
    const updateBody = { name: 'Winter 2025' } as unknown as Parameters<
      HierarchiesEndpoint['Update']
    >[1];
    const duplicateBody = { name: 'Winter Copy' } as unknown as Parameters<
      HierarchiesEndpoint['Duplicate']
    >[1];

    const emptyResult = await client.Hierarchies.GetNodesByIds([]);

    expect(emptyResult.data).toHaveLength(0);
    expect(requests).toHaveLength(0);

    await client.Hierarchies.Limit(5).Offset(10).Children('hierarchy-1');
    await client.Hierarchies.Duplicate('hierarchy-1', duplicateBody);
    await client.Hierarchies.Update('hierarchy-1', updateBody);
    await client.Hierarchies.GetNodesByIds(['node-1', 'node-2']);
    await client.Hierarchies.Nodes.Limit(15).GetNodeChildren('hierarchy-1', 'node-1');

    expect(requests).toHaveLength(5);
    expect(requests[0]?.input).toBe(
      'https://euwest.api.elasticpath.com/pcm/hierarchies/hierarchy-1/children?page[limit]=5&page[offset]=10',
    );
    expect(requests[1]?.input).toBe(
      'https://euwest.api.elasticpath.com/pcm/hierarchies/hierarchy-1/duplicate_job',
    );
    expect(requests[2]?.input).toBe(
      'https://euwest.api.elasticpath.com/pcm/hierarchies/hierarchy-1',
    );
    expect(requests[3]?.input).toBe(
      'https://euwest.api.elasticpath.com/pcm/hierarchies/nodes?filter=in(id,node-1,node-2)&include_hierarchies=true',
    );
    expect(requests[4]?.input).toBe(
      'https://euwest.api.elasticpath.com/pcm/hierarchies/hierarchy-1/nodes/node-1/children?page[limit]=15',
    );
    expect(requests[2]?.init?.method).toBe('POST');
    expect(parseJsonBody(requests[1])).toEqual({
      data: {
        name: 'Winter Copy',
      },
    });
    expect(parseJsonBody(requests[2])).toEqual({
      data: {
        name: 'Winter 2025',
        type: 'hierarchy',
      },
    });
  });

  it('builds hierarchy relationship requests', async () => {
    const { client, requests } = createMockClient();
    const relationshipBody = [{ id: 'product-1', type: 'product' }] as Parameters<
      HierarchiesEndpoint['Relationships']['Create']
    >[2];
    const parentBody = { id: 'node-0', type: 'node' } as Parameters<
      HierarchiesEndpoint['Relationships']['ChangeParent']
    >[2];
    const sortBody = [{ id: 'node-2', sort_order: 1 }] as unknown as Parameters<
      HierarchiesEndpoint['Relationships']['CreateChildrenSortOrder']
    >[2];

    await client.Hierarchies.Relationships.Create('hierarchy-1', 'node-1', relationshipBody);
    await client.Hierarchies.Relationships.Update('hierarchy-1', 'node-1', relationshipBody);
    await client.Hierarchies.Relationships.Delete('hierarchy-1', 'node-1', relationshipBody);
    await client.Hierarchies.Relationships.Limit(10).Offset(20).Products('hierarchy-1', 'node-1');
    await client.Hierarchies.Relationships.ChangeParent('hierarchy-1', 'node-1', parentBody);
    await client.Hierarchies.Relationships.DeleteParent('hierarchy-1', 'node-1');
    await client.Hierarchies.Relationships.CreateChildrenSortOrder(
      'hierarchy-1',
      'node-1',
      sortBody,
    );

    expect(requests).toHaveLength(7);
    expect(requests[0]?.input).toBe(
      'https://euwest.api.elasticpath.com/pcm/hierarchies/hierarchy-1/nodes/node-1/relationships/products',
    );
    expect(requests[1]?.input).toBe(
      'https://euwest.api.elasticpath.com/pcm/hierarchies/hierarchy-1/nodes/node-1/relationships/products',
    );
    expect(requests[2]?.input).toBe(
      'https://euwest.api.elasticpath.com/pcm/hierarchies/hierarchy-1/nodes/node-1/relationships/products',
    );
    expect(requests[3]?.input).toBe(
      'https://euwest.api.elasticpath.com/pcm/hierarchies/hierarchy-1/nodes/node-1/products?page[limit]=10&page[offset]=20',
    );
    expect(requests[4]?.input).toBe(
      'https://euwest.api.elasticpath.com/pcm/hierarchies/hierarchy-1/nodes/node-1/relationships/parent',
    );
    expect(requests[5]?.input).toBe(
      'https://euwest.api.elasticpath.com/pcm/hierarchies/hierarchy-1/nodes/node-1/relationships/parent',
    );
    expect(requests[6]?.input).toBe(
      'https://euwest.api.elasticpath.com/pcm/hierarchies/hierarchy-1/nodes/node-1/relationships/children',
    );
    expect(parseJsonBody(requests[0])).toEqual({ data: relationshipBody });
    expect(parseJsonBody(requests[1])).toEqual({ data: relationshipBody });
    expect(parseJsonBody(requests[2])).toEqual({ data: relationshipBody });
    expect(parseJsonBody(requests[4])).toEqual({ data: parentBody });
    expect(parseJsonBody(requests[6])).toEqual({ data: sortBody });
  });

  it('preserves the typed endpoint surface at compile time', () => {
    assertHierarchiesEndpointTypes();
    expect(true).toBe(true);
  });
});
