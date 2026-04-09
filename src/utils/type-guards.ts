import type {
  UrlFilterNestedFields,
  UrlFilterParams,
  UrlFilterValue,
  UrlQueryValue,
} from '../types';

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isNestedFilterFields(value: UrlFilterValue): value is UrlFilterNestedFields {
  return isRecord(value);
}

export function isFilterParams(value: UrlQueryValue): value is UrlFilterParams {
  return isRecord(value);
}
