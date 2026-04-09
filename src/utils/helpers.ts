import type { BuildUrlParams, UrlQueryParams } from '../types';
import { formatQueryString } from './formatQueryString';

function buildQueryParams(params: BuildUrlParams) {
  const {
    includes,
    sort,
    limit,
    offset,
    filter,
    useTemplateSlugs,
    total_method,
    ...additionalParams
  } = params;
  const query: UrlQueryParams = {};

  if (includes) {
    query.include = includes;
  }

  if (sort) {
    query.sort = `${sort}`;
  }

  if (limit !== undefined && limit !== null) {
    query.limit = `[limit]=${limit}`;
  }

  if (offset) {
    query.offset = `[offset]=${offset}`;
  }

  if (filter) {
    query.filter = filter;
  }

  if (useTemplateSlugs) {
    query.useTemplateSlugs = useTemplateSlugs;
  }

  if (total_method) {
    query.total_method = total_method;
  }

  // Add any additional parameters with URI encoding
  Object.keys(additionalParams).forEach(key => {
    if (additionalParams[key] !== undefined && additionalParams[key] !== null) {
      query[key] = additionalParams[key];
    }
  });

  return Object.keys(query)
    .map(k => formatQueryString(k, query[k]))
    .join('&');
}

export function formatQueryParams(query: UrlQueryParams) {
  return Object.keys(query)
    .map(k => formatQueryString(k, query[k]))
    .join('&');
}

export function buildURL(endpoint: string, params: BuildUrlParams): string {
  // Check if any params are provided
  const hasParams = (Object.keys(params) as (keyof BuildUrlParams)[]).some(
    key => params[key] !== undefined && params[key] !== null,
  );

  if (hasParams) {
    const paramsString = buildQueryParams(params);

    if (paramsString) {
      return `${endpoint}?${paramsString}`;
    }
  }
  return endpoint;
}
