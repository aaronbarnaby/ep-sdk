import { CRUDExtend, mergeTypeIntoBody } from '../../extends/crud';
import type { ResolvedElasticPathConfig } from '../../types';
import type { RelationshipToMany, ResourceList } from '../../types/core';
import { buildURL } from '../../utils/helpers';
import type {
  CreateFlowBody,
  FlowEntryBase,
  FlowEntryPage,
  FlowEntryResource,
  FlowFieldList,
  FlowPage,
  FlowResource,
  UpdateFlowBody,
} from './types';

export class FlowsEndpoint extends CRUDExtend<
  FlowResource,
  FlowPage,
  CreateFlowBody,
  UpdateFlowBody
> {
  constructor(config: ResolvedElasticPathConfig) {
    super(config);

    this.endpoint = 'flows';
    this.resourceType = 'flow';
    this.updateMethod = 'PUT';
  }

  GetEntries<TEntry = Record<string, unknown>>(slug: string, token?: string) {
    const response = this.request.send<FlowEntryPage<TEntry>>(
      buildURL(`${this.endpoint}/${slug}/entries`, {
        limit: this.limit,
        offset: this.offset,
      }),
      'GET',
      { token },
    );
    this.resetProps();

    return response;
  }

  GetEntry<TEntry = Record<string, unknown>>(slug: string, entryId: string, token?: string) {
    const response = this.request.send<FlowEntryResource<TEntry>>(
      `${this.endpoint}/${slug}/entries/${entryId}`,
      'GET',
      { token },
    );
    this.resetProps();

    return response;
  }

  GetFields(slug: string, token?: string) {
    const response = this.request.send<FlowFieldList>(`${this.endpoint}/${slug}/fields`, 'GET', {
      token,
    });
    this.resetProps();

    return response;
  }

  CreateEntry<TBody extends Omit<FlowEntryBase, 'type'> = Omit<FlowEntryBase, 'type'>>(
    slug: string,
    body: TBody,
    token?: string,
  ) {
    const response = this.request.send<FlowEntryResource>(
      `${this.endpoint}/${slug}/entries`,
      'POST',
      {
        body: mergeTypeIntoBody(body, 'entry'),
        token,
      },
    );
    this.resetProps();

    return response;
  }

  UpdateEntry<TBody extends Record<string, unknown> = Record<string, unknown>>(
    slug: string,
    entryId: string,
    body: TBody,
    token?: string,
  ) {
    const response = this.request.send<FlowEntryResource>(
      `${this.endpoint}/${slug}/entries/${entryId}`,
      'PUT',
      {
        body: mergeTypeIntoBody(body, 'entry'),
        token,
      },
    );
    this.resetProps();

    return response;
  }

  DeleteEntry(slug: string, entryId: string, token?: string) {
    const response = this.request.send<void>(
      `${this.endpoint}/${slug}/entries/${entryId}`,
      'DELETE',
      {
        token,
      },
    );
    this.resetProps();

    return response;
  }

  CreateEntryRelationship(
    flowSlug: string,
    entryId: string,
    fieldSlug: string,
    body: RelationshipToMany<string>,
    token?: string,
  ) {
    const response = this.request.send<ResourceList<unknown>>(
      `${this.endpoint}/${flowSlug}/entries/${entryId}/relationships/${fieldSlug}`,
      'POST',
      {
        body,
        token,
      },
    );
    this.resetProps();

    return response;
  }

  UpdateEntryRelationship(
    flowSlug: string,
    entryId: string,
    fieldSlug: string,
    body: RelationshipToMany<string>,
    token?: string,
  ) {
    const response = this.request.send<ResourceList<unknown>>(
      `${this.endpoint}/${flowSlug}/entries/${entryId}/relationships/${fieldSlug}`,
      'PUT',
      {
        body,
        token,
      },
    );
    this.resetProps();

    return response;
  }

  DeleteEntryRelationship(flowSlug: string, entryId: string, fieldSlug: string, token?: string) {
    const response = this.request.send<ResourceList<unknown>>(
      `${this.endpoint}/${flowSlug}/entries/${entryId}/relationships/${fieldSlug}`,
      'DELETE',
      {
        token,
      },
    );
    this.resetProps();

    return response;
  }
}
