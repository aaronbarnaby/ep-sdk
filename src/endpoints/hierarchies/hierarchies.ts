import { mergeTypeIntoBody } from '../../extends/crud';
import { CRUDExtend } from '../../extends/crud';
import { BaseExtend } from '../../extends/base';
import type { ResolvedElasticPathConfig } from '../../types';
import type { Resource, ResourcePage } from '../../types/core';
import { buildURL } from '../../utils/helpers';
import { NodesEndpoint } from '../nodes';
import type {
  CreateChildrenSortOrderBody,
  Node,
  NodeProduct,
  NodeRelationship,
  NodeRelationshipBase,
  NodeRelationshipParent,
} from '../nodes';
import type {
  CreateHierarchyBody,
  DuplicateHierarchyBody,
  DuplicateHierarchyJob,
  HierarchiesEndpointShape,
  HierarchyFilter,
  HierarchyPage,
  HierarchyRelationshipsEndpoint,
  HierarchyResource,
  HierarchySort,
  UpdateHierarchyBody,
} from './types';

class HierarchyNodeRelationshipsEndpoint
  extends BaseExtend<Resource<NodeRelationship>, ResourcePage<NodeProduct>>
  implements HierarchyRelationshipsEndpoint
{
  constructor(config: ResolvedElasticPathConfig) {
    super({
      ...config,
      version: 'pcm',
    });

    this.endpoint = 'relationships/products';
  }

  Create(hierarchyId: string, nodeId: string, body: NodeRelationshipBase[], token?: string) {
    const response = this.request.send<Resource<NodeRelationship>>(
      `hierarchies/${hierarchyId}/nodes/${nodeId}/${this.endpoint}`,
      'POST',
      {
        body,
        token,
      },
    );
    this.resetProps();

    return response;
  }

  Update(hierarchyId: string, nodeId: string, body: NodeRelationshipBase[], token?: string) {
    const response = this.request.send<Resource<NodeRelationship>>(
      `hierarchies/${hierarchyId}/nodes/${nodeId}/${this.endpoint}`,
      'PUT',
      {
        body,
        token,
      },
    );
    this.resetProps();

    return response;
  }

  Delete(hierarchyId: string, nodeId: string, body: NodeRelationshipBase[], token?: string) {
    const response = this.request.send<void>(
      `hierarchies/${hierarchyId}/nodes/${nodeId}/${this.endpoint}`,
      'DELETE',
      {
        body,
        token,
      },
    );
    this.resetProps();

    return response;
  }

  Products(hierarchyId: string, nodeId: string, token?: string) {
    const response = this.request.send<ResourcePage<NodeProduct>>(
      buildURL(`hierarchies/${hierarchyId}/nodes/${nodeId}/products`, {
        limit: this.limit,
        offset: this.offset,
      }),
      'GET',
      { token },
    );
    this.resetProps();

    return response;
  }

  ChangeParent(hierarchyId: string, nodeId: string, body: NodeRelationshipParent, token?: string) {
    const response = this.request.send<void>(
      `hierarchies/${hierarchyId}/nodes/${nodeId}/relationships/parent`,
      'PUT',
      {
        body,
        token,
      },
    );
    this.resetProps();

    return response;
  }

  DeleteParent(hierarchyId: string, nodeId: string, token?: string) {
    const response = this.request.send<void>(
      `hierarchies/${hierarchyId}/nodes/${nodeId}/relationships/parent`,
      'DELETE',
      { token },
    );
    this.resetProps();

    return response;
  }

  CreateChildrenSortOrder(
    hierarchyId: string,
    nodeId: string,
    body: CreateChildrenSortOrderBody[],
    token?: string,
  ) {
    const response = this.request.send<void>(
      `hierarchies/${hierarchyId}/nodes/${nodeId}/relationships/children`,
      'POST',
      {
        body,
        token,
      },
    );
    this.resetProps();

    return response;
  }
}

export class HierarchiesEndpoint
  extends CRUDExtend<
    HierarchyResource,
    HierarchyPage,
    CreateHierarchyBody,
    UpdateHierarchyBody,
    HierarchyFilter,
    HierarchySort
  >
  implements HierarchiesEndpointShape
{
  readonly Nodes: NodesEndpoint;
  readonly Relationships: HierarchyRelationshipsEndpoint;

  constructor(config: ResolvedElasticPathConfig) {
    const endpointConfig: ResolvedElasticPathConfig = {
      ...config,
      version: 'pcm',
    };

    super(endpointConfig);

    this.endpoint = 'hierarchies';
    this.resourceType = 'hierarchy';
    this.Nodes = new NodesEndpoint(endpointConfig);
    this.Relationships = new HierarchyNodeRelationshipsEndpoint(endpointConfig);
  }

  Children(id: string, token?: string) {
    const response = this.request.send<ResourcePage<Node>>(
      buildURL(`${this.endpoint}/${id}/children`, {
        limit: this.limit,
        offset: this.offset,
      }),
      'GET',
      { token },
    );
    this.resetProps();

    return response;
  }

  Duplicate(hierarchyId: string, body: DuplicateHierarchyBody, token?: string) {
    const response = this.request.send<Resource<DuplicateHierarchyJob>>(
      `${this.endpoint}/${hierarchyId}/duplicate_job`,
      'POST',
      {
        body,
        token,
      },
    );
    this.resetProps();

    return response;
  }

  GetNodesByIds(nodeIds: string[], token?: string) {
    if (nodeIds.length === 0) {
      return Promise.resolve({
        data: [],
        links: {
          current: null,
        },
        meta: {
          page: {
            current: 1,
            limit: 100,
            offset: 0,
            total: 0,
          },
          results: {
            total: 0,
          },
        },
      });
    }

    const response = this.request.send<ResourcePage<Node>>(
      buildURL('hierarchies/nodes', {
        filter: {
          in: {
            id: nodeIds,
          },
        },
        include_hierarchies: true,
      }),
      'GET',
      { token },
    );
    this.resetProps();

    return response;
  }

  override Update<
    TResponse = HierarchyResource,
    TBody extends UpdateHierarchyBody = UpdateHierarchyBody,
  >(id: string, body: TBody, token?: string): Promise<TResponse> {
    const response = this.request.send<TResponse>(`${this.endpoint}/${id}`, 'POST', {
      body: mergeTypeIntoBody(body, 'hierarchy'),
      token,
    });
    this.resetProps();

    return response;
  }
}
