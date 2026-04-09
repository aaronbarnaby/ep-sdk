import { describe, expect, it } from 'bun:test';

import { AccountTagsEndpoint, createClient } from '../../src';
import { createMockClient, parseJsonBody } from '../helpers/http';

function assertAccountTagsEndpointTypes(): void {
  const client = createClient();
  const filter = { eq: { name: 'VIP' } } as Parameters<AccountTagsEndpoint['Filter']>[0];
  const createBody = { name: 'VIP' } as Parameters<AccountTagsEndpoint['Create']>[0];
  const updateBody = { name: 'Priority' } as Parameters<AccountTagsEndpoint['Update']>[1];

  const pagePromise = client.AccountTags.Filter(filter).All();
  const getPromise = client.AccountTags.Get('tag-1');
  const createPromise = client.AccountTags.Create(createBody);
  const updatePromise = client.AccountTags.Update('tag-1', updateBody);
  const deletePromise = client.AccountTags.Delete('tag-1');

  void pagePromise;
  void getPromise;
  void createPromise;
  void updatePromise;
  void deletePromise;
}

describe('account-tags endpoint', () => {
  it('exposes AccountTags as a property endpoint', () => {
    const client = createClient();

    expect(client.AccountTags).toBeInstanceOf(AccountTagsEndpoint);
    expect(client.AccountTags.config.version).toBe('v2');
    expect(typeof client.AccountTags.All).toBe('function');
  });

  it('builds list, create, update, and delete requests for account tags', async () => {
    const { client, requests } = createMockClient();
    const createBody = { name: 'VIP' } as Parameters<AccountTagsEndpoint['Create']>[0];
    const updateBody = { name: 'Priority' } as Parameters<AccountTagsEndpoint['Update']>[1];

    await client.AccountTags.Filter({ eq: { name: 'VIP' } } as Parameters<
      AccountTagsEndpoint['Filter']
    >[0])
      .Limit(10)
      .Offset(5)
      .All();
    await client.AccountTags.Create(createBody);
    await client.AccountTags.Update('tag-1', updateBody);
    await client.AccountTags.Delete('tag-1');

    expect(requests).toHaveLength(4);
    expect(requests[0]?.input).toBe(
      'https://euwest.api.elasticpath.com/v2/account-tags?page[limit]=10&page[offset]=5&filter=eq(name,VIP)',
    );
    expect(requests[1]?.input).toBe('https://euwest.api.elasticpath.com/v2/account-tags');
    expect(requests[2]?.input).toBe('https://euwest.api.elasticpath.com/v2/account-tags/tag-1');
    expect(requests[3]?.input).toBe('https://euwest.api.elasticpath.com/v2/account-tags/tag-1');
    expect(requests[2]?.init?.method).toBe('PUT');
    expect(requests[3]?.init?.method).toBe('DELETE');
    expect(parseJsonBody(requests[1])).toEqual({
      data: {
        name: 'VIP',
        type: 'account_tag',
      },
    });
    expect(parseJsonBody(requests[2])).toEqual({
      data: {
        name: 'Priority',
        type: 'account_tag',
      },
    });
  });

  it('preserves the typed endpoint surface at compile time', () => {
    assertAccountTagsEndpointTypes();
    expect(true).toBe(true);
  });
});
