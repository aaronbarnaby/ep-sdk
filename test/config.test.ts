import { describe, expect, it } from 'bun:test';

import { DEFAULT_HOST, ElasticPath, MemoryStorageFactory, createClient, gateway } from '../src';

describe('gateway', () => {
  it('creates a client with legacy-friendly config keys', () => {
    const client = gateway({
      client_id: 'client-id',
      client_secret: 'client-secret',
      headers: {
        'EP-Beta-Features': 'account-management',
      },
    });

    expect(client).toBeInstanceOf(ElasticPath);
    expect(client.config.clientId).toBe('client-id');
    expect(client.config.clientSecret).toBe('client-secret');
    expect(client.config.host).toBe(DEFAULT_HOST);
    expect(client.config.version).toBe('v2');
    expect(client.config.headers['EP-Beta-Features']).toBe('account-management');
    expect(client.storage).toBeInstanceOf(MemoryStorageFactory);
    expect(client.request.storage).toBe(client.storage);
  });

  it('preserves createClient as an alias for gateway', () => {
    const client = createClient();

    expect(client).toBeInstanceOf(ElasticPath);
  });
});
