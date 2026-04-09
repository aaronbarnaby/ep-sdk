import { describe, expect, it } from 'bun:test';

import { PriceBookPricesEndpoint, PriceBooksEndpoint, createClient } from '../../src';
import { createMockClient, getHeaders, parseJsonBody } from '../helpers/http';

function assertPriceBooksEndpointTypes(): void {
  const client = createClient();
  const createBody = { name: 'Default price book' } as unknown as Parameters<
    PriceBooksEndpoint['Create']
  >[0];
  const updateBody = { name: 'EU price book' } as unknown as Parameters<
    PriceBooksEndpoint['Update']
  >[1];
  const priceBody = { sku: 'ABC-123' } as unknown as Parameters<
    PriceBookPricesEndpoint['Create']
  >[1];
  const updatePriceBody = { sku: 'ABC-123' } as unknown as Parameters<
    PriceBookPricesEndpoint['Update']
  >[2];
  const modifierBody = { name: 'Sale' } as unknown as Parameters<
    PriceBooksEndpoint['PriceModifiers']['Create']
  >[1];
  const updateModifierBody = { name: 'Sale' } as unknown as Parameters<
    PriceBooksEndpoint['PriceModifiers']['Update']
  >[2];

  const pagePromise = client.PriceBooks.Limit(10).All();
  const getPromise = client.PriceBooks.Get('pricebook-1');
  const createPromise = client.PriceBooks.Create(createBody);
  const updatePromise = client.PriceBooks.Update('pricebook-1', updateBody);
  const importPromise = client.PriceBooks.ImportProductPrices(new FormData());
  const pricesPromise = client.PriceBookPrices.All('pricebook-1');
  const createPricePromise = client.PriceBookPrices.Create('pricebook-1', priceBody);
  const updatePricePromise = client.PriceBookPrices.Update(
    'pricebook-1',
    'price-1',
    updatePriceBody,
  );
  const deletePricePromise = client.PriceBookPrices.Delete('pricebook-1', 'price-1');
  const createModifierPromise = client.PriceBooks.PriceModifiers.Create(
    'pricebook-1',
    modifierBody,
  );
  const updateModifierPromise = client.PriceBooks.PriceModifiers.Update(
    'pricebook-1',
    'modifier-1',
    updateModifierBody,
  );
  const deleteModifierPromise = client.PriceBooks.PriceModifiers.Delete(
    'pricebook-1',
    'modifier-1',
  );

  void pagePromise;
  void getPromise;
  void createPromise;
  void updatePromise;
  void importPromise;
  void pricesPromise;
  void createPricePromise;
  void updatePricePromise;
  void deletePricePromise;
  void createModifierPromise;
  void updateModifierPromise;
  void deleteModifierPromise;
}

describe('price-books endpoint', () => {
  it('exposes PriceBooks and PriceBookPrices as property endpoints', () => {
    const client = createClient();

    expect(client.PriceBooks).toBeInstanceOf(PriceBooksEndpoint);
    expect(client.PriceBooks.config.version).toBe('pcm');
    expect(client.PriceBookPrices).toBeInstanceOf(PriceBookPricesEndpoint);
    expect(typeof client.PriceBooks.PriceModifiers.Create).toBe('function');
  });

  it('builds price book, price, modifier, and import requests', async () => {
    const { client, requests } = createMockClient();
    const createBody = { name: 'Default price book' } as unknown as Parameters<
      PriceBooksEndpoint['Create']
    >[0];
    const updateBody = { name: 'EU price book' } as unknown as Parameters<
      PriceBooksEndpoint['Update']
    >[1];
    const priceBody = { sku: 'ABC-123' } as unknown as Parameters<
      PriceBookPricesEndpoint['Create']
    >[1];
    const updatePriceBody = { sku: 'ABC-123' } as unknown as Parameters<
      PriceBookPricesEndpoint['Update']
    >[2];
    const modifierBody = { name: 'Sale' } as unknown as Parameters<
      PriceBooksEndpoint['PriceModifiers']['Create']
    >[1];
    const updateModifierBody = { name: 'Sale' } as unknown as Parameters<
      PriceBooksEndpoint['PriceModifiers']['Update']
    >[2];
    const formData = new FormData();

    formData.set('file', 'prices.csv');

    await client.PriceBooks.Limit(10).All();
    await client.PriceBooks.Create(createBody);
    await client.PriceBooks.Update('pricebook-1', updateBody);
    await client.PriceBooks.ImportProductPrices(formData);
    await client.PriceBookPrices.Limit(5).All('pricebook-1');
    await client.PriceBookPrices.Create('pricebook-1', priceBody);
    await client.PriceBookPrices.Update('pricebook-1', 'price-1', updatePriceBody);
    await client.PriceBookPrices.Delete('pricebook-1', 'price-1');
    await client.PriceBooks.PriceModifiers.Create('pricebook-1', modifierBody);
    await client.PriceBooks.PriceModifiers.Update('pricebook-1', 'modifier-1', updateModifierBody);
    await client.PriceBooks.PriceModifiers.Delete('pricebook-1', 'modifier-1');

    expect(requests).toHaveLength(11);
    expect(requests[0]?.input).toBe(
      'https://euwest.api.elasticpath.com/pcm/pricebooks?page[limit]=10',
    );
    expect(requests[1]?.input).toBe('https://euwest.api.elasticpath.com/pcm/pricebooks');
    expect(requests[2]?.input).toBe(
      'https://euwest.api.elasticpath.com/pcm/pricebooks/pricebook-1',
    );
    expect(requests[3]?.input).toBe('https://euwest.api.elasticpath.com/pcm/pricebooks/import');
    expect(requests[4]?.input).toBe(
      'https://euwest.api.elasticpath.com/pcm/pricebooks/pricebook-1/prices?page[limit]=5',
    );
    expect(requests[5]?.input).toBe(
      'https://euwest.api.elasticpath.com/pcm/pricebooks/pricebook-1/prices',
    );
    expect(requests[6]?.input).toBe(
      'https://euwest.api.elasticpath.com/pcm/pricebooks/pricebook-1/prices/price-1',
    );
    expect(requests[7]?.input).toBe(
      'https://euwest.api.elasticpath.com/pcm/pricebooks/pricebook-1/prices/price-1',
    );
    expect(requests[8]?.input).toBe(
      'https://euwest.api.elasticpath.com/pcm/pricebooks/pricebook-1/modifiers',
    );
    expect(requests[9]?.input).toBe(
      'https://euwest.api.elasticpath.com/pcm/pricebooks/pricebook-1/modifiers/modifier-1',
    );
    expect(requests[10]?.input).toBe(
      'https://euwest.api.elasticpath.com/pcm/pricebooks/pricebook-1/modifiers/modifier-1',
    );
    expect(requests[2]?.init?.method).toBe('PUT');
    expect(requests[6]?.init?.method).toBe('PUT');
    expect(requests[9]?.init?.method).toBe('PUT');
    expect(parseJsonBody(requests[1])).toEqual({
      data: {
        name: 'Default price book',
        type: 'pricebook',
      },
    });
    expect(parseJsonBody(requests[2])).toEqual({
      data: {
        name: 'EU price book',
        type: 'pricebook',
      },
    });
    expect(requests[3]?.init?.body).toBe(formData);
    expect(getHeaders(requests[3]).get('Content-Type')).toBeNull();
    expect(parseJsonBody(requests[5])).toEqual({
      data: {
        sku: 'ABC-123',
        type: 'product-price',
      },
    });
    expect(parseJsonBody(requests[6])).toEqual({
      data: {
        sku: 'ABC-123',
        type: 'product-price',
      },
    });
    expect(parseJsonBody(requests[8])).toEqual({
      data: {
        name: 'Sale',
        type: 'price-modifier',
      },
    });
    expect(parseJsonBody(requests[9])).toEqual({
      data: {
        name: 'Sale',
        type: 'price-modifier',
      },
    });
  });

  it('preserves the typed endpoint surface at compile time', () => {
    assertPriceBooksEndpointTypes();
    expect(true).toBe(true);
  });
});
