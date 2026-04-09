import { describe, expect, it } from 'bun:test';

import type { ProductFilter } from '../src';
import type { BuildUrlParams, UrlQueryParams } from '../src/types';
import { formatQueryParams } from '../src/utils/helpers';

describe('query parameter formatting', () => {
  it('accepts product endpoint filter types', () => {
    const filter: ProductFilter = {
      eq: {
        sku: 'ABC-123',
        brand: {
          id: 'brand-1',
        },
      },
    };

    expect(formatQueryParams({ filter })).toBe('filter=eq(sku,ABC-123):eq(brand.id,brand-1)');
  });

  it('serializes nested filters and or groups', () => {
    const filter: NonNullable<BuildUrlParams['filter']> = {
      or: [{ eq: { status: 'live' } }, { like: { name: 'starter' } }],
      eq: {
        sku: 'ABC-123',
        product: {
          sku: 'child-sku',
        },
      },
      in: {
        slug: ['summer', 'winter'],
      },
      is_null: ['deleted_at', 'archived_at'],
    };

    expect(formatQueryParams({ filter })).toBe(
      'filter=(eq(status,live)|like(name,starter)):eq(sku,ABC-123):eq(product.sku,child-sku):in(slug,summer,winter):is_null(deleted_at):is_null(archived_at)',
    );
  });

  it('preserves pagination query formatting', () => {
    const query: UrlQueryParams = {
      limit: '[limit]=25',
      offset: '[offset]=50',
      total_method: 'exact',
    };

    expect(formatQueryParams(query)).toBe(
      'page[limit]=25&page[offset]=50&page[total_method]=exact',
    );
  });
});
