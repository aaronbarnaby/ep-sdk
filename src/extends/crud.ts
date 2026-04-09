import { BaseExtend } from './base';
import type { HttpMethod, UrlFilterParams } from '../types';

function endpointResourceType(endpoint: string): string {
  const resourceSegment = endpoint.split('/').filter(Boolean).at(-1) ?? endpoint;

  if (resourceSegment.endsWith('ies')) {
    return `${resourceSegment.slice(0, -3)}y`;
  }

  if (resourceSegment.endsWith('s')) {
    return resourceSegment.slice(0, -1);
  }

  return resourceSegment;
}

export function mergeTypeIntoBody<TBody>(body: TBody, resourceType: string): TBody {
  if (body && typeof body === 'object' && !Array.isArray(body)) {
    return {
      ...(body as Record<string, unknown>),
      type: resourceType,
    } as TBody;
  }

  return body;
}

export class CRUDExtend<
  TItemResponse = unknown,
  TPageResponse = unknown,
  TCreateBody = unknown,
  TUpdateBody = unknown,
  TFilter extends UrlFilterParams = UrlFilterParams,
  TSort extends string = string,
  TInclude extends string = string,
  TDeleteResponse = unknown,
> extends BaseExtend<TItemResponse, TPageResponse, TFilter, TSort, TInclude> {
  protected createMethod: HttpMethod = 'POST';
  protected updateMethod: HttpMethod = 'POST';
  protected injectResourceType = true;
  protected resourceType?: string;

  Create<TResponse = TItemResponse, TBody extends TCreateBody = TCreateBody>(
    body: TBody,
    token?: string,
  ): Promise<TResponse> {
    const response = this.request.send<TResponse>(this.endpoint, this.createMethod, {
      body: this.injectResourceType ? mergeTypeIntoBody(body, this.resolveResourceType()) : body,
      token,
    });
    this.resetProps();

    return response;
  }

  Update<TResponse = TItemResponse, TBody extends TUpdateBody = TUpdateBody>(
    id: string,
    body: TBody,
    token?: string,
  ): Promise<TResponse> {
    const response = this.request.send<TResponse>(`${this.endpoint}/${id}`, this.updateMethod, {
      body: this.injectResourceType ? mergeTypeIntoBody(body, this.resolveResourceType()) : body,
      token,
    });
    this.resetProps();

    return response;
  }

  Delete<TResponse = TDeleteResponse>(id: string, token?: string): Promise<TResponse> {
    const response = this.request.send<TResponse>(`${this.endpoint}/${id}`, 'DELETE', {
      token,
    });
    this.resetProps();

    return response;
  }

  protected resolveResourceType(): string {
    return this.resourceType ?? endpointResourceType(this.endpoint);
  }
}
