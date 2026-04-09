import { describe, expect, it } from 'bun:test';

import { AccountsEndpoint, createClient } from '../../src';
import { createMockClient, parseJsonBody } from '../helpers/http';

function assertAccountsEndpointTypes(): void {
  const client = createClient();
  const filter = { eq: { name: 'Primary account' } } as Parameters<AccountsEndpoint['Filter']>[0];
  const createBody = { name: 'Primary account' } as Parameters<AccountsEndpoint['Create']>[0];
  const updateBody = { name: 'Updated account' } as Parameters<AccountsEndpoint['Update']>[1];
  const relationshipBody = [{ id: 'tag-1', type: 'account_tag' }] as Parameters<
    AccountsEndpoint['AddAccountTags']
  >[1];

  const pagePromise = client.Accounts.Filter(filter).All();
  const getPromise = client.Accounts.Get('account-1');
  const createPromise = client.Accounts.Create(createBody);
  const updatePromise = client.Accounts.Update('account-1', updateBody);
  const addTagsPromise = client.Accounts.AddAccountTags('account-1', relationshipBody);
  const deleteTagsPromise = client.Accounts.DeleteAccountTags('account-1', relationshipBody);

  void pagePromise;
  void getPromise;
  void createPromise;
  void updatePromise;
  void addTagsPromise;
  void deleteTagsPromise;
}

describe('accounts endpoint', () => {
  it('exposes Accounts as a property endpoint', () => {
    const client = createClient();

    expect(client.Accounts).toBeInstanceOf(AccountsEndpoint);
    expect(client.Accounts.config.version).toBe('v2');
    expect(typeof client.Accounts.AddAccountTags).toBe('function');
  });

  it('builds CRUD and relationship requests for accounts', async () => {
    const { client, requests } = createMockClient();
    const createBody = { name: 'Primary account' } as Parameters<AccountsEndpoint['Create']>[0];
    const updateBody = { name: 'Updated account' } as Parameters<AccountsEndpoint['Update']>[1];
    const relationshipBody = [{ id: 'tag-1', type: 'account_tag' }] as Parameters<
      AccountsEndpoint['AddAccountTags']
    >[1];

    await client.Accounts.Filter({ eq: { name: 'Primary account' } } as Parameters<
      AccountsEndpoint['Filter']
    >[0])
      .Limit(25)
      .All();
    await client.Accounts.Create(createBody);
    await client.Accounts.Update('account-1', updateBody);
    await client.Accounts.AddAccountTags('account-1', relationshipBody);
    await client.Accounts.DeleteAccountTags('account-1', relationshipBody);

    expect(requests).toHaveLength(5);
    expect(requests[0]?.input).toBe(
      'https://euwest.api.elasticpath.com/v2/accounts?page[limit]=25&filter=eq(name,Primary%20account)',
    );
    expect(requests[1]?.input).toBe('https://euwest.api.elasticpath.com/v2/accounts');
    expect(requests[2]?.input).toBe('https://euwest.api.elasticpath.com/v2/accounts/account-1');
    expect(requests[3]?.input).toBe(
      'https://euwest.api.elasticpath.com/v2/accounts/account-1/relationships/account-tags',
    );
    expect(requests[4]?.input).toBe(
      'https://euwest.api.elasticpath.com/v2/accounts/account-1/relationships/account-tags',
    );
    expect(requests[2]?.init?.method).toBe('PUT');
    expect(requests[3]?.init?.method).toBe('POST');
    expect(requests[4]?.init?.method).toBe('DELETE');
    expect(parseJsonBody(requests[1])).toEqual({
      data: {
        name: 'Primary account',
        type: 'account',
      },
    });
    expect(parseJsonBody(requests[2])).toEqual({
      data: {
        name: 'Updated account',
        type: 'account',
      },
    });
    expect(parseJsonBody(requests[3])).toEqual({
      data: relationshipBody,
    });
    expect(parseJsonBody(requests[4])).toEqual({
      data: relationshipBody,
    });
  });

  it('preserves the typed endpoint surface at compile time', () => {
    assertAccountsEndpointTypes();
    expect(true).toBe(true);
  });
});
