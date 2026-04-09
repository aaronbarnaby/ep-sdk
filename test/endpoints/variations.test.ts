import { describe, expect, it } from 'bun:test';

import { VariationsEndpoint, createClient } from '../../src';
import { createMockClient, parseJsonBody } from '../helpers/http';

function assertVariationsEndpointTypes(): void {
  const client = createClient();
  const createBody = { name: 'Size' } as unknown as Parameters<VariationsEndpoint['Create']>[0];
  const updateBody = { name: 'Colour' } as unknown as Parameters<VariationsEndpoint['Update']>[1];
  const optionBody = { name: 'Small' } as unknown as Parameters<
    VariationsEndpoint['CreateOption']
  >[1];
  const updateOptionBody = { name: 'Small' } as unknown as Parameters<
    VariationsEndpoint['UpdateOption']
  >[2];
  const modifierBody = { name: 'Extra cheese' } as unknown as Parameters<
    VariationsEndpoint['CreateModifier']
  >[2];

  const pagePromise = client.Variations.Limit(10).All();
  const getPromise = client.Variations.Get('variation-1');
  const createPromise = client.Variations.CreateVariation(createBody);
  const updatePromise = client.Variations.UpdateVariation('variation-1', updateBody);
  const optionPromise = client.Variations.Option('variation-1', 'option-1');
  const optionsPromise = client.Variations.Options('variation-1');
  const createOptionPromise = client.Variations.CreateOption('variation-1', optionBody);
  const updateOptionPromise = client.Variations.UpdateOption(
    'variation-1',
    'option-1',
    updateOptionBody,
  );
  const deleteOptionPromise = client.Variations.DeleteOption('variation-1', 'option-1');
  const modifierPromise = client.Variations.Modifier('variation-1', 'option-1', 'modifier-1');
  const modifiersPromise = client.Variations.Modifiers('variation-1', 'option-1');
  const createModifierPromise = client.Variations.CreateModifier(
    'variation-1',
    'option-1',
    modifierBody,
  );
  const updateModifierPromise = client.Variations.UpdateModifier(
    'variation-1',
    'option-1',
    'modifier-1',
    modifierBody,
  );
  const deleteModifierPromise = client.Variations.DeleteModifier(
    'variation-1',
    'option-1',
    'modifier-1',
  );

  void pagePromise;
  void getPromise;
  void createPromise;
  void updatePromise;
  void optionPromise;
  void optionsPromise;
  void createOptionPromise;
  void updateOptionPromise;
  void deleteOptionPromise;
  void modifierPromise;
  void modifiersPromise;
  void createModifierPromise;
  void updateModifierPromise;
  void deleteModifierPromise;
}

describe('variations endpoint', () => {
  it('exposes Variations as a property endpoint', () => {
    const client = createClient();

    expect(client.Variations).toBeInstanceOf(VariationsEndpoint);
    expect(client.Variations.config.version).toBe('pcm');
    expect(typeof client.Variations.CreateOption).toBe('function');
  });

  it('builds variation, option, and modifier requests', async () => {
    const { client, requests } = createMockClient();
    const createBody = { name: 'Size' } as unknown as Parameters<VariationsEndpoint['Create']>[0];
    const updateBody = { name: 'Colour' } as unknown as Parameters<VariationsEndpoint['Update']>[1];
    const optionBody = { name: 'Small' } as unknown as Parameters<
      VariationsEndpoint['CreateOption']
    >[1];
    const updateOptionBody = { name: 'Small' } as unknown as Parameters<
      VariationsEndpoint['UpdateOption']
    >[2];
    const modifierBody = { name: 'Extra cheese' } as unknown as Parameters<
      VariationsEndpoint['CreateModifier']
    >[2];

    await client.Variations.Limit(10).All();
    await client.Variations.CreateVariation(createBody);
    await client.Variations.UpdateVariation('variation-1', updateBody);
    await client.Variations.Option('variation-1', 'option-1');
    await client.Variations.Options('variation-1');
    await client.Variations.CreateOption('variation-1', optionBody);
    await client.Variations.UpdateOption('variation-1', 'option-1', updateOptionBody);
    await client.Variations.DeleteOption('variation-1', 'option-1');
    await client.Variations.Modifier('variation-1', 'option-1', 'modifier-1');
    await client.Variations.Modifiers('variation-1', 'option-1');
    await client.Variations.CreateModifier('variation-1', 'option-1', modifierBody);
    await client.Variations.UpdateModifier('variation-1', 'option-1', 'modifier-1', modifierBody);
    await client.Variations.DeleteModifier('variation-1', 'option-1', 'modifier-1');

    expect(requests).toHaveLength(13);
    expect(requests[0]?.input).toBe(
      'https://euwest.api.elasticpath.com/pcm/variations?page[limit]=10',
    );
    expect(requests[1]?.input).toBe('https://euwest.api.elasticpath.com/pcm/variations');
    expect(requests[2]?.input).toBe(
      'https://euwest.api.elasticpath.com/pcm/variations/variation-1',
    );
    expect(requests[3]?.input).toBe(
      'https://euwest.api.elasticpath.com/pcm/variations/variation-1/options/option-1',
    );
    expect(requests[4]?.input).toBe(
      'https://euwest.api.elasticpath.com/pcm/variations/variation-1/options',
    );
    expect(requests[5]?.input).toBe(
      'https://euwest.api.elasticpath.com/pcm/variations/variation-1/options',
    );
    expect(requests[6]?.input).toBe(
      'https://euwest.api.elasticpath.com/pcm/variations/variation-1/options/option-1',
    );
    expect(requests[7]?.input).toBe(
      'https://euwest.api.elasticpath.com/pcm/variations/variation-1/options/option-1',
    );
    expect(requests[8]?.input).toBe(
      'https://euwest.api.elasticpath.com/pcm/variations/variation-1/options/option-1/modifiers/modifier-1',
    );
    expect(requests[9]?.input).toBe(
      'https://euwest.api.elasticpath.com/pcm/variations/variation-1/options/option-1/modifiers',
    );
    expect(requests[10]?.input).toBe(
      'https://euwest.api.elasticpath.com/pcm/variations/variation-1/options/option-1/modifiers',
    );
    expect(requests[11]?.input).toBe(
      'https://euwest.api.elasticpath.com/pcm/variations/variation-1/options/option-1/modifiers/modifier-1',
    );
    expect(requests[12]?.input).toBe(
      'https://euwest.api.elasticpath.com/pcm/variations/variation-1/options/option-1/modifiers/modifier-1',
    );
    expect(requests[2]?.init?.method).toBe('PUT');
    expect(requests[6]?.init?.method).toBe('PUT');
    expect(requests[11]?.init?.method).toBe('PUT');
    expect(parseJsonBody(requests[1])).toEqual({
      data: {
        name: 'Size',
        type: 'product-variation',
      },
    });
    expect(parseJsonBody(requests[2])).toEqual({
      data: {
        name: 'Colour',
        type: 'product-variation',
      },
    });
    expect(parseJsonBody(requests[5])).toEqual({
      data: {
        name: 'Small',
        type: 'product-variation-option',
      },
    });
    expect(parseJsonBody(requests[6])).toEqual({
      data: {
        name: 'Small',
        type: 'product-variation-option',
      },
    });
    expect(parseJsonBody(requests[10])).toEqual({
      data: {
        name: 'Extra cheese',
        type: 'product-variation-modifier',
      },
    });
    expect(parseJsonBody(requests[11])).toEqual({
      data: {
        id: 'modifier-1',
        name: 'Extra cheese',
        type: 'product-variation-modifier',
      },
    });
  });

  it('preserves the typed endpoint surface at compile time', () => {
    assertVariationsEndpointTypes();
    expect(true).toBe(true);
  });
});
