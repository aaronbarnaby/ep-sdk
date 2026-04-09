import type { UrlFilterParams } from '../types';
import { BaseExtend } from './base';

type RequestBody = Record<string, unknown>;

function endpointResourceType(endpoint: string): string {
  if (endpoint.endsWith('ies')) {
    return `${endpoint.slice(0, -3)}y`;
  }

  if (endpoint.endsWith('s')) {
    return endpoint.slice(0, -1);
  }

  return endpoint;
}

export class CRUDExtend<
  TItemResponse = unknown,
  TPageResponse = unknown,
  TCreateBody extends RequestBody = RequestBody,
  TUpdateBody extends RequestBody = Partial<TCreateBody>,
  TFilter extends UrlFilterParams = UrlFilterParams,
  TSort extends string = string,
  TInclude extends string = string,
  TDeleteResponse = unknown,
> extends BaseExtend<TItemResponse, TPageResponse, TFilter, TSort, TInclude> {
  Create<TResponse = TItemResponse, TBody extends TCreateBody = TCreateBody>(
    body: TBody,
    token?: string,
  ): Promise<TResponse> {
    const response = this.request.send<TResponse>(this.endpoint, 'POST', {
      body: {
        ...body,
        type: endpointResourceType(this.endpoint),
      } as RequestBody,
      token,
    });
    this.resetProps(this);

    return response;
  }

  Update<TResponse = TItemResponse, TBody extends TUpdateBody = TUpdateBody>(
    id: string,
    body: TBody,
    token?: string,
  ): Promise<TResponse> {
    const response = this.request.send<TResponse>(`${this.endpoint}/${id}`, 'POST', {
      body: {
        ...body,
        type: endpointResourceType(this.endpoint),
      } as RequestBody,
      token,
    });
    this.resetProps(this);

    return response;
  }

  Delete<TResponse = TDeleteResponse>(id: string, token?: string): Promise<TResponse> {
    const response = this.request.send<TResponse>(`${this.endpoint}/${id}`, 'DELETE', {
      token,
    });
    this.resetProps(this);

    return response;
  }
}
