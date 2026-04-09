# Elastic Path Commerce Cloud TypeScript SDK

[![npm version](https://img.shields.io/npm/v/@aaronbarnaby/ep-sdk.svg)](https://www.npmjs.com/package/@aaronbarnaby/ep-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This repository is a personal TypeScript-first rewrite to the original [@elasticpath/js-sdk](https://github.com/elasticpath/js-sdk).

> This repository is currently in process and dosn't cover all Elastic Path endpoints at this time.
>
> Use at your own risk.

## Requirements

- Bun 1.3+
- Node.js 22+

## Install

```bash
bun install
```

## Available Commands

```bash
bun run lint
bun run typecheck
bun run build
bun run test
bun run test-output
bun run playground
bun run playground:dist
bun run release:dry-run
```

## Current API Surface

The starter entrypoint preserves the legacy `gateway(...)` shape while using a TypeScript-native implementation.

```ts
import { gateway } from '@aaronbarnaby/ep-sdk'

const client = gateway({
  client_id: process.env.EP_CLIENT_ID,
  client_secret: process.env.EP_CLIENT_SECRET,
  headers: {
    'EP-Beta-Features': 'account-management'
  }
})

const products = await client.request.send('/products', 'GET')
console.log(products)
```

Supported foundation pieces today:

- Typed gateway and client factory
- Shared request factory with auth support
- Legacy-friendly config keys such as `client_id`, `client_secret`, `custom_fetch`, and `custom_authenticator`
- Dual ESM and CJS package output
- bun:test test suite and JUnit output for CI
- CLI playground for local manual testing

## Playground

The playground is a Bun CLI script intended for quick local verification outside the test suite.

By default it runs in dry-run mode and only prints the resolved configuration:

```bash
bun run playground
```

To run a live request, create a local `.env` from `.env.example` and set `EP_RUN_LIVE=true`.

```bash
bun run playground
```

Useful environment variables:

- `EP_CLIENT_ID`
- `EP_CLIENT_SECRET`
- `EP_HOST`
- `EP_API_PATH`
- `EP_BETA_FEATURES`
- `EP_RUN_LIVE`

## Build Output

The build is handled by `tsup` and emits:

- `dist/index.js` for ESM consumers
- `dist/index.cjs` for CommonJS consumers
- `dist/index.d.ts` for type definitions

## Release

Publishing is handled with semantic-release from `main` and publishes to npm as `@aaronbarnaby/ep-sdk`.
