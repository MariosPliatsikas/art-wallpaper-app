// Only this server-side module reads the credential. Never return upstream URLs/errors.
const allowed = new Set(['classification', 'keyword', 'q', 'yearmade', 'hasimage', 'size', 'sort']);
const fields = ['id', 'title', 'people', 'dated', 'primaryimageurl', 'url', 'classification', 'copyright', 'creditline', 'medium'];

export async function GET(request) {
  const headers = { 'Cache-Control': 'no-store' };
  const fail = (status, error) => Response.json({ error }, { status, headers });
  const params = new URL(request.url).searchParams;
  for (const [name, value] of params) {
    if (!allowed.has(name) || params.getAll(name).length !== 1 || value.length > 120) {
      return fail(400, 'Invalid Harvard search parameters');
    }
  }
  const years = params.get('yearmade');
  if (years && !/^-?\d{1,4}--?\d{1,4}$/.test(years)) return fail(400, 'Invalid date range');
  const key = process.env.HARVARD_API_KEY;
  if (!key?.trim()) return fail(503, 'Harvard is temporarily unavailable');
  const upstream = new URL('https://api.harvardartmuseums.org/object');
  for (const name of ['classification', 'keyword', 'q', 'yearmade']) {
    if (params.has(name)) upstream.searchParams.set(name, params.get(name));
  }
  upstream.searchParams.set('apikey', key.trim());
  upstream.searchParams.set('hasimage', '1');
  upstream.searchParams.set('size', '100');
  upstream.searchParams.set('sort', 'random');
  try {
    const response = await fetch(upstream, { signal: AbortSignal.timeout(10000), redirect: 'error' });
    if (!response.ok) {
      console.error('Harvard upstream status', response.status);
      return fail(response.status === 429 ? 429 : 502, 'Harvard is temporarily unavailable');
    }
    const data = await response.json();
    if (!Array.isArray(data.records)) return fail(502, 'Invalid Harvard response');
    const records = data.records.map(item => Object.fromEntries(fields.filter(f => item[f] !== undefined).map(f => [f, item[f]])));
    // Cache batches; the browser still chooses a random artwork from the batch.
    return Response.json({ records }, { headers: {
      'Cache-Control': 'public, max-age=60',
      'Vercel-CDN-Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=300',
    } });
  } catch {
    console.error('Harvard upstream request failed');
    return fail(502, 'Harvard is temporarily unavailable');
  }
}

export function POST() {
  return Response.json({ error: 'Method not allowed' }, { status: 405, headers: { Allow: 'GET', 'Cache-Control': 'no-store' } });
}
