import { CRUDExtend } from '../../extends/crud';
import type { ResolvedElasticPathConfig } from '../../types';
import { buildURL } from '../../utils/helpers';
import type {
  CreateCustomApiBody,
  CreateCustomApiEntryBody,
  CreateCustomApiFieldBody,
  CustomApiEntryPage,
  CustomApiEntryResource,
  CustomApiFieldPage,
  CustomApiFieldResource,
  CustomApiFilter,
  CustomApiPage,
  CustomApiResource,
  CustomApiSort,
  UpdateCustomApiBody,
  UpdateCustomApiEntryBody,
  UpdateCustomApiFieldBody,
} from './types';

export class CustomApisEndpoint extends CRUDExtend<
  CustomApiResource,
  CustomApiPage,
  CreateCustomApiBody,
  UpdateCustomApiBody,
  CustomApiFilter,
  CustomApiSort
> {
  constructor(config: ResolvedElasticPathConfig) {
    super(config);

    this.endpoint = 'settings/extensions/custom-apis';
    this.injectResourceType = false;
    this.updateMethod = 'PUT';
  }

  GetFields(customApiId: string, token?: string) {
    const response = this.request.send<CustomApiFieldPage>(
      buildURL(`${this.endpoint}/${customApiId}/fields`, {
        limit: this.limit,
        offset: this.offset,
        sort: this.sort,
      }),
      'GET',
      { token },
    );
    this.resetProps();

    return response;
  }

  GetField(customApiId: string, customApiFieldId: string, token?: string) {
    const response = this.request.send<CustomApiFieldResource>(
      `${this.endpoint}/${customApiId}/fields/${customApiFieldId}`,
      'GET',
      { token },
    );
    this.resetProps();

    return response;
  }

  CreateField(customApiId: string, body: CreateCustomApiFieldBody, token?: string) {
    const response = this.request.send<CustomApiFieldResource>(
      `${this.endpoint}/${customApiId}/fields`,
      'POST',
      {
        body,
        token,
      },
    );
    this.resetProps();

    return response;
  }

  UpdateField(
    customApiId: string,
    customApiFieldId: string,
    body: UpdateCustomApiFieldBody,
    token?: string,
  ) {
    const response = this.request.send<CustomApiFieldResource>(
      `${this.endpoint}/${customApiId}/fields/${customApiFieldId}`,
      'PUT',
      {
        body,
        token,
      },
    );
    this.resetProps();

    return response;
  }

  DeleteField(customApiId: string, customApiFieldId: string, token?: string) {
    const response = this.request.send<void>(
      `${this.endpoint}/${customApiId}/fields/${customApiFieldId}`,
      'DELETE',
      { token },
    );
    this.resetProps();

    return response;
  }

  GetEntries<TEntry = Record<string, unknown>>(customApiId: string, token?: string) {
    const response = this.request.send<CustomApiEntryPage<TEntry>>(
      buildURL(`${this.endpoint}/${customApiId}/entries`, {
        limit: this.limit,
        offset: this.offset,
        sort: this.sort,
        filter: this.filter,
      }),
      'GET',
      { token },
    );
    this.resetProps();

    return response;
  }

  GetEntry<TEntry = Record<string, unknown>>(
    customApiId: string,
    customApiEntryId: string,
    token?: string,
  ) {
    const response = this.request.send<CustomApiEntryResource<TEntry>>(
      `${this.endpoint}/${customApiId}/entries/${customApiEntryId}`,
      'GET',
      { token },
    );
    this.resetProps();

    return response;
  }

  CreateEntry<TEntry = Record<string, unknown>>(
    customApiId: string,
    body: CreateCustomApiEntryBody,
    token?: string,
  ) {
    const response = this.request.send<CustomApiEntryResource<TEntry>>(
      `${this.endpoint}/${customApiId}/entries`,
      'POST',
      {
        body,
        token,
      },
    );
    this.resetProps();

    return response;
  }

  UpdateEntry<TEntry = Record<string, unknown>>(
    customApiId: string,
    customApiEntryId: string,
    body: UpdateCustomApiEntryBody,
    token?: string,
  ) {
    const response = this.request.send<CustomApiEntryResource<TEntry>>(
      `${this.endpoint}/${customApiId}/entries/${customApiEntryId}`,
      'PUT',
      {
        body,
        token,
      },
    );
    this.resetProps();

    return response;
  }

  DeleteEntry(customApiId: string, customApiEntryId: string, token?: string) {
    const response = this.request.send<void>(
      `${this.endpoint}/${customApiId}/entries/${customApiEntryId}`,
      'DELETE',
      { token },
    );
    this.resetProps();

    return response;
  }

  GetEntriesBySlug<TEntry = Record<string, unknown>>(slug: string, token?: string) {
    const response = this.request.send<CustomApiEntryPage<TEntry>>(
      buildURL(`extensions/${slug}`, {
        limit: this.limit,
        offset: this.offset,
        sort: this.sort,
        filter: this.filter,
      }),
      'GET',
      { token },
    );
    this.resetProps();

    return response;
  }

  GetEntryBySlug<TEntry = Record<string, unknown>>(slug: string, entryId: string, token?: string) {
    const response = this.request.send<CustomApiEntryResource<TEntry>>(
      `extensions/${slug}/${entryId}`,
      'GET',
      {
        token,
      },
    );
    this.resetProps();

    return response;
  }

  CreateEntryBySlug<TEntry = Record<string, unknown>>(
    slug: string,
    body: CreateCustomApiEntryBody,
    token?: string,
  ) {
    const response = this.request.send<CustomApiEntryResource<TEntry>>(
      `extensions/${slug}`,
      'POST',
      {
        body,
        token,
      },
    );
    this.resetProps();

    return response;
  }

  UpdateEntryBySlug<TEntry = Record<string, unknown>>(
    slug: string,
    entryId: string,
    body: UpdateCustomApiEntryBody,
    token?: string,
  ) {
    const response = this.request.send<CustomApiEntryResource<TEntry>>(
      `extensions/${slug}/${entryId}`,
      'PUT',
      {
        body,
        token,
      },
    );
    this.resetProps();

    return response;
  }

  DeleteEntryBySlug(slug: string, entryId: string, token?: string) {
    const response = this.request.send<void>(`extensions/${slug}/${entryId}`, 'DELETE', {
      token,
    });
    this.resetProps();

    return response;
  }
}
