import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { GET, POST } from '../api/harvard.mjs';
const originalFetch = globalThis.fetch;
const originalKey = process.env.HARVARD_API_KEY;
afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalKey === undefined) delete process.env.HARVARD_API_KEY;
  else process.env.HARVARD_API_KEY = originalKey;
});
const req = query => new Request(`https://example.com/api/harvard${query}`);
test('missing server credential returns 503 without fetching', async () => {
  delete process.env.HARVARD_API_KEY;
  globalThis.fetch = () => { throw new Error('must not fetch'); };
  assert.equal((await GET(req(''))).status, 503);
});
test('forwards filters with server key and strips upstream navigation URLs', async () => {
  process.env.HARVARD_API_KEY = 'server-only-sentinel';
  globalThis.fetch = async url => {
    assert.equal(url.origin, 'https://api.harvardartmuseums.org');
    assert.equal(url.searchParams.get('apikey'), 'server-only-sentinel');
    assert.equal(url.searchParams.get('classification'), 'Paintings');
    return Response.json({ info: { next: `https://example.com/?apikey=server-only-sentinel` }, records: [{ id: 2, title: 'Art', primaryimageurl: 'https://example.com/image', secret: 'discard' }] });
  };
  const response = await GET(req('?classification=Paintings'));
  assert.equal(response.status, 200);
  assert.match(response.headers.get('Vercel-CDN-Cache-Control'), /s-maxage=3600/);
  const body = await response.text();
  assert.ok(!body.includes('server-only-sentinel'));
  assert.ok(!body.includes('secret'));
  assert.equal(JSON.parse(body).records[0].id, 2);
});
test('rejects arbitrary URLs, keys, duplicate filters and oversized searches', async () => {
  for (const query of ['?url=https://evil.test', '?apikey=client-key', '?q=a&q=b', '?q=' + 'a'.repeat(121), '?yearmade=invalid']) {
    assert.equal((await GET(req(query))).status, 400);
  }
});
test('upstream errors never return their body or URL and are not cached', async () => {
  process.env.HARVARD_API_KEY = 'server-only-sentinel';
  globalThis.fetch = async () => new Response('server-only-sentinel', { status: 403 });
  const response = await GET(req(''));
  assert.equal(response.status, 502);
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
  assert.ok(!(await response.text()).includes('server-only-sentinel'));
});
test('network failure is sanitized and POST is rejected', async () => {
  process.env.HARVARD_API_KEY = 'server-only-sentinel';
  globalThis.fetch = async () => { throw new Error('server-only-sentinel'); };
  const response = await GET(req(''));
  assert.equal(response.status, 502);
  assert.ok(!(await response.text()).includes('server-only-sentinel'));
  assert.equal(POST().status, 405);
});
