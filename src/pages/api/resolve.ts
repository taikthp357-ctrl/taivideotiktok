import type { APIRoute } from 'astro';
import { detectPlatform } from '../../lib/detect-platform';
import { normalizeUrl } from '../../lib/normalize-url';
import { checkPolicy } from '../../lib/policy-checker';
import { checkRateLimit } from '../../lib/rate-limit';
import { cleanResolveResult } from '../../lib/response-cleaner';
import { hashUrl } from '../../lib/url-hash';
import { isResolveRequestBody } from '../../lib/validators';
import { getProvider } from '../../providers';

const jsonHeaders = {
  'Cache-Control': 'no-store',
  'Content-Type': 'application/json'
};

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    const body = await request.json();
    if (!isResolveRequestBody(body)) {
      return new Response(JSON.stringify({ status: 'failed', reason: 'Invalid request body.' }), { status: 400, headers: jsonHeaders });
    }

    const normalized = normalizeUrl(body.url);
    if (!normalized.ok || !normalized.normalizedUrl) {
      return new Response(JSON.stringify({ status: 'failed', reason: normalized.error ?? 'Invalid URL.' }), {
        status: 400,
        headers: jsonHeaders
      });
    }

    const platform = detectPlatform(normalized.normalizedUrl);
    const rateKey = clientAddress || 'anonymous';
    const rateLimit = checkRateLimit(rateKey);
    if (!rateLimit.allowed) {
      return new Response(JSON.stringify({ status: 'blocked', platform, reason: 'Rate limit exceeded. Try again later.' }), {
        status: 429,
        headers: jsonHeaders
      });
    }

    const policyResult = checkPolicy({ platform, acceptTerms: body.accept_terms });
    if (policyResult) {
      if (policyResult.status === 'metadata_only') {
        const provider = getProvider(platform);
        if (provider) {
          const metadata = await provider.resolve({
            url: body.url,
            normalizedUrl: normalized.normalizedUrl,
            platform,
            acceptTerms: body.accept_terms,
            requestId: await hashUrl(normalized.normalizedUrl)
          });
          return new Response(JSON.stringify(cleanResolveResult({ ...metadata, status: 'metadata_only' })), { headers: jsonHeaders });
        }
      }
      return new Response(JSON.stringify(cleanResolveResult(policyResult)), { headers: jsonHeaders });
    }

    const provider = getProvider(platform);
    if (!provider) {
      return new Response(JSON.stringify({ status: 'blocked', platform, reason: 'No provider is available for this platform.' }), {
        headers: jsonHeaders
      });
    }

    const requestId = await hashUrl(normalized.normalizedUrl);
    const result = await provider.resolve({
      url: body.url,
      normalizedUrl: normalized.normalizedUrl,
      platform,
      acceptTerms: body.accept_terms,
      requestId
    });

    return new Response(JSON.stringify(cleanResolveResult(result)), { headers: jsonHeaders });
  } catch {
    return new Response(JSON.stringify({ status: 'failed', reason: 'Unable to process request right now.' }), {
      status: 500,
      headers: jsonHeaders
    });
  }
};

export const ALL: APIRoute = async () =>
  new Response(JSON.stringify({ status: 'failed', reason: 'Method not allowed.' }), { status: 405, headers: jsonHeaders });
