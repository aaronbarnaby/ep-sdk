import RequestFactory from '../factories/request';
import type { ResolvedElasticPathConfig, UrlFilterParams } from '../types';
import { buildURL } from '../utils/helpers';

type IncludeValues<TInclude extends string> = readonly TInclude[] | TInclude;

export class BaseExtend<
  TItemResponse = unknown,
  TPageResponse = unknown,
  TFilter extends UrlFilterParams = UrlFilterParams,
  TSort extends string = string,
  TInclude extends string = string,
> {
  readonly request: RequestFactory;
  readonly config: ResolvedElasticPathConfig;

  constructor(config: ResolvedElasticPathConfig) {
    this.request = new RequestFactory(config);
    this.config = config;
  }

  protected endpoint: string = '';
  protected includes?: string;
  protected sort?: TSort;
  protected limit?: number;
  protected offset?: number;
  protected filter?: TFilter;

  Filter(filter: TFilter) {
    this.filter = filter;
    return this;
  }

  Limit(value: number) {
    this.limit = value;
    return this;
  }

  Offset(value: number) {
    this.offset = value;
    return this;
  }

  Sort(value: TSort) {
    this.sort = value;
    return this;
  }

  With(includes: IncludeValues<TInclude>) {
    const includeValues = Array.isArray(includes) ? includes : [includes];

    if (includeValues.length > 0) {
      this.includes = includeValues.join(',').toLowerCase();
    }

    return this;
  }

  All<TResponse = TPageResponse>(token?: string): Promise<TResponse> {
    const response = this.request.send<TResponse>(
      buildURL(this.endpoint, this.getParams()),
      'GET',
      { token },
    );
    this.resetProps();

    return response;
  }

  Get<TResponse = TItemResponse>(id: string, token?: string): Promise<TResponse> {
    const response = this.request.send<TResponse>(
      buildURL(`${this.endpoint}/${id}`, { includes: this.includes }),
      'GET',
      { token },
    );
    this.resetProps();

    return response;
  }

  protected getParams() {
    const { includes, sort, limit, offset, filter } = this;
    return { includes, sort, limit, offset, filter };
  }

  protected resetProps() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const inst = this;
    (['includes', 'sort', 'limit', 'offset', 'filter'] as (keyof this)[]).forEach(
      e => delete inst[e],
    );
  }
}
