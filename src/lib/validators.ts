export function isResolveRequestBody(body: unknown): body is { url: string; accept_terms: boolean } {
  if (!body || typeof body !== 'object') return false;
  const candidate = body as Record<string, unknown>;
  return typeof candidate.url === 'string' && typeof candidate.accept_terms === 'boolean';
}
