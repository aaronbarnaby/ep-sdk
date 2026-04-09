import type { UrlFilterParams } from '../../types';
import type { Identifiable, Resource, ResourcePage } from '../../types/core';
import type { PcmJob } from '../../types/pcm';
import type {
  CreateChildrenSortOrderBody,
  Node,
  NodeProduct,
  NodeRelationship,
  NodeRelationshipBase,
  NodeRelationshipParent,
  NodesEndpoint,
} from '../nodes';

export interface HierarchyBase {
  type: 'hierarchy';
  attributes: {
    name: string;
    description?: string;
    slug?: string;
    created_at?: string;
    updated_at?: string;
    published_at?: string;
    admin_attributes?: { [key: string]: string };
    shopper_attributes?: { [key: string]: string };
  };
  meta?: {
    owner?: 'organization' | 'store';
  };
}

export interface Hierarchy extends Identifiable, HierarchyBase {
  relationships?: {
    children?: {
      data: {
        type: 'node';
        id: string;
      }[];
    };
  };
}

export type HierarchyResource = Resource<Hierarchy>;
export type HierarchyPage = ResourcePage<Hierarchy>;
export type CreateHierarchyBody = Omit<HierarchyBase, 'type'>;
export type UpdateHierarchyBody = Identifiable & {
  attributes: Partial<HierarchyBase['attributes']>;
  meta?: HierarchyBase['meta'];
};

export interface DuplicateHierarchyBody {
  attributes: {
    name?: string;
    description?: string;
    include_products?: boolean;
  };
}

export type DuplicateHierarchyJob = PcmJob;

export interface HierarchyFilter extends UrlFilterParams {
  eq?: {
    name?: string;
    slug?: string;
  };
}

export type HierarchySort = 'name' | '-name';

export interface HierarchyRelationshipsEndpoint {
  Limit(value: number): this;
  Offset(value: number): this;
  Create(
    hierarchyId: string,
    nodeId: string,
    body: NodeRelationshipBase[],
    token?: string,
  ): Promise<Resource<NodeRelationship>>;
  Update(
    hierarchyId: string,
    nodeId: string,
    body: NodeRelationshipBase[],
    token?: string,
  ): Promise<Resource<NodeRelationship>>;
  Delete(
    hierarchyId: string,
    nodeId: string,
    body: NodeRelationshipBase[],
    token?: string,
  ): Promise<void>;
  Products(hierarchyId: string, nodeId: string, token?: string): Promise<ResourcePage<NodeProduct>>;
  ChangeParent(
    hierarchyId: string,
    nodeId: string,
    body: NodeRelationshipParent,
    token?: string,
  ): Promise<void>;
  DeleteParent(hierarchyId: string, nodeId: string, token?: string): Promise<void>;
  CreateChildrenSortOrder(
    hierarchyId: string,
    nodeId: string,
    body: CreateChildrenSortOrderBody[],
    token?: string,
  ): Promise<void>;
}

export interface HierarchiesEndpointShape {
  Nodes: NodesEndpoint;
  Relationships: HierarchyRelationshipsEndpoint;
  Children(id: string, token?: string): Promise<ResourcePage<Node>>;
  Duplicate(
    hierarchyId: string,
    body: DuplicateHierarchyBody,
    token?: string,
  ): Promise<Resource<DuplicateHierarchyJob>>;
  GetNodesByIds(nodeIds: string[], token?: string): Promise<ResourcePage<Node>>;
}
