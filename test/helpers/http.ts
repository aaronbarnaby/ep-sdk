import { gateway } from '../../src';

export type CapturedRequest = {
  input: string;
  init: RequestInit | undefined;
};

export const resolveInput = (input: string | URL | Request): string => {
  if (typeof input === 'string') {
    return input;
  }

  if (input instanceof URL) {
    return input.toString();
  }

  return input.url;
};

type MockClientOptions = {
  response?: Response;
  fetch?: (request: CapturedRequest) => Response | Promise<Response>;
};

export const createMockClient = (options: MockClientOptions = {}) => {
  const requests: CapturedRequest[] = [];

  const client = gateway({
    client_id: 'client-id',
    custom_authenticator: () =>
      Promise.resolve({
        access_token: 'token-123',
        expires: Math.floor(Date.now() / 1000) + 60,
      }),
    custom_fetch: async (input, init) => {
      const request = {
        input: resolveInput(input),
        init,
      };

      requests.push(request);

      if (options.fetch) {
        return options.fetch(request);
      }

      return (
        options.response ??
        Response.json({
          data: [],
        })
      );
    },
  });

  return {
    client,
    requests,
  };
};

export const parseJsonBody = (request: CapturedRequest | undefined): unknown => {
  const body = request?.init?.body;

  if (typeof body !== 'string') {
    return body;
  }

  return JSON.parse(body) as unknown;
};

export const getHeaders = (request: CapturedRequest | undefined): Headers => {
  return new Headers(request?.init?.headers);
};
