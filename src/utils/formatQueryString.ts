import type { UrlFilterCondition, UrlFilterParams, UrlQueryParams } from '../types';
import { isFilterParams, isNestedFilterFields, isRecord } from './type-guards';

function isFilterCondition(
  value: UrlFilterParams[string],
): value is Exclude<UrlFilterParams[string], UrlFilterParams['or'] | undefined> {
  if (value === undefined) {
    return false;
  }

  if (!Array.isArray(value)) {
    return true;
  }

  return value.every(item => typeof item === 'string');
}

function formatFilterString(type: string, filter: UrlFilterCondition): string {
  // Handle is_null filter  usage { is_null: field } or { is_null: [field1, field2] }
  if (type === 'is_null') {
    if (Array.isArray(filter)) {
      return filter.map(item => `${type}(${String(item)})`).join(':');
    }

    if (!isRecord(filter)) {
      return `${type}(${String(filter)})`;
    }

    return `${type}([object Object])`;
  }

  if (!isRecord(filter)) {
    return `${type}(${String(filter)})`;
  }

  const filterStringArray = Object.entries(filter).flatMap(([key, value]) => {
    if (value === undefined) {
      return [];
    }

    let queryString: string;

    if (Array.isArray(value)) {
      queryString = `${key},${value.map(item => String(item)).join(',')}`;
    } else if (isNestedFilterFields(value)) {
      const nestedQueries = Object.entries(value)
        .filter(([, attrValue]) => attrValue !== undefined)
        .map(([attr, attrValue]) => `${key}.${attr},${String(attrValue)}`);

      if (nestedQueries.length === 0) {
        return [];
      }

      queryString = nestedQueries.join(':');
    } else {
      queryString = `${key},${String(value)}`;
    }

    return [`${type}(${queryString})`];
  });

  return filterStringArray.join(':');
}

export function formatQueryString(
  key: string,
  value: UrlQueryParams[keyof UrlQueryParams],
): string {
  if (key === 'filter' && isFilterParams(value)) {
    const filterValues: string[] = [];

    // Handle 'or' conditions if they exist
    if (Array.isArray(value.or)) {
      const orQueries = value.or.map(filterGroup =>
        Object.entries(filterGroup)
          .flatMap(([filterType, filterValue]) =>
            isFilterCondition(filterValue) ? [formatFilterString(filterType, filterValue)] : [],
          )
          .join(':'),
      );
      filterValues.push(`(${orQueries.join('|')})`);
    }

    // Handle other filter types
    Object.entries(value).forEach(([filterType, filterValue]) => {
      if (filterType !== 'or' && isFilterCondition(filterValue)) {
        filterValues.push(formatFilterString(filterType, filterValue));
      }
    });

    return `${key}=${filterValues.join(':')}`;
  }

  const formattedValue = Array.isArray(value)
    ? value.map(item => String(item)).join(',')
    : isFilterParams(value)
      ? '[object Object]'
      : String(value);

  if (key === 'limit' || key === 'offset') {
    return `page${formattedValue}`;
  }

  if (key === 'total_method') {
    return `page[total_method]=${formattedValue}`;
  }

  return `${key}=${formattedValue}`;
}
