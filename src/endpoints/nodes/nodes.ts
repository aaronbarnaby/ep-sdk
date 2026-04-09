import { mergeTypeIntoBody } from '../../extends/crud';
import { BaseExtend } from '../../extends/base';
import type { ResolvedElasticPathConfig } from '../../types';
import { buildURL } from '../../utils/helpers';
import type {
  CreateNodeBody,
  NodeFilter,
  NodeList,
  NodePage,
  NodeResource,
  UpdateNodeBody,
} from './types';

export class NodesEndpoint extends BaseExtend<NodeResource, NodeList, NodeFilter> {
  constructor(config: ResolvedElasticPathConfig) {
    super({
      ...config,
      version: 'pcm',
    });

    this.endpoint = 'nodes';
  }

  All<TResponse = NodeList>(hierarchyId: string, token?: string): Promise<TResponse> {
    const response = this.request.send<TResponse>(
      buildURL(`hierarchies/${hierarchyId}/${this.endpoint}`, {
        filter: this.filter,
        limit: this.limit,
        offset: this.offset,
      }),
      'GET',
      { token },
    );
    this.resetProps();

    return response;
  }

  Get<TResponse = NodeResource>(
    hierarchyId: string,
    nodeId: string,
    token?: string,
  ): Promise<TResponse> {
    const response = this.request.send<TResponse>(
      `hierarchies/${hierarchyId}/${this.endpoint}/${nodeId}`,
      'GET',
      { token },
    );
    this.resetProps();

    return response;
  }

  Create(hierarchyId: string, body: CreateNodeBody, token?: string) {
    const response = this.request.send<NodeResource>(
      `hierarchies/${hierarchyId}/${this.endpoint}`,
      'POST',
      {
        body: mergeTypeIntoBody(body, 'node'),
        token,
      },
    );
    this.resetProps();

    return response;
  }

  Update(hierarchyId: string, nodeId: string, body: UpdateNodeBody, token?: string) {
    const response = this.request.send<NodeResource>(
      `hierarchies/${hierarchyId}/${this.endpoint}/${nodeId}`,
      'PUT',
      {
        body: mergeTypeIntoBody(body, 'node'),
        token,
      },
    );
    this.resetProps();

    return response;
  }

  Delete(hierarchyId: string, nodeId: string, token?: string) {
    const response = this.request.send<void>(
      `hierarchies/${hierarchyId}/${this.endpoint}/${nodeId}`,
      'DELETE',
      {
        token,
      },
    );
    this.resetProps();

    return response;
  }

  GetNodeChildren(hierarchyId: string, nodeId: string, token?: string) {
    const response = this.request.send<NodePage>(
      buildURL(`hierarchies/${hierarchyId}/${this.endpoint}/${nodeId}/children`, {
        filter: this.filter,
        limit: this.limit,
        offset: this.offset,
      }),
      'GET',
      { token },
    );
    this.resetProps();

    return response;
  }
}
