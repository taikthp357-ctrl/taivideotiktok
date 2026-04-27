# Architecture

## User flow
1. User submits URL + usage-rights confirmation.
2. API normalizes URL, detects platform, checks rate limit and policy.
3. API calls platform adapter/provider.
4. Response is cleaned and returned as `ready`, `metadata_only`, `blocked`, or `failed`.

## API flow
- Endpoint: `POST /api/resolve`
- Server validates payload and never logs raw URLs.
- Policy-first behavior to protect legal/ads safety.

## Data handling
- No video storage.
- No long-term raw URL storage.
- Optional hash for ephemeral request correlation.

## Provider adapter
- `src/providers/*-provider.ts` wraps platform logic.
- External resolver is optional via ENV.

## Rate limit
- In-memory per key (IP or anonymous fallback).

## Ads safety
- Copy avoids misleading claims and copyright-violating promises.
