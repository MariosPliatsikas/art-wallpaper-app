# Harvard server proxy

Run client checks with `CI=true yarn test --watchAll=false --runInBand`, server checks with `node --test tests/harvard-api.test.mjs`, and build with `yarn build`.

For integrated local testing use `vercel dev` with a local, ignored `.env.local` containing `HARVARD_API_KEY`. CRA's `yarn start` alone does not serve the `/api` directory. Never put the credential in a `REACT_APP_` variable.

Before preview: configure sensitive `HARVARD_API_KEY` for the `fix/harvard-server-proxy` Preview branch in Vercel. Do not remove the old Production variable until the new production build is validated. The client no longer reads it, even if it is still configured.

Release checks: Harvard filters and random selection on iPhone/iMac; no apikey in browser requests or bundles; API response contains no upstream pagination URLs; missing server key gives 503; upstream failure gives sanitized 502/429. Verify the deployed function and CDN cache headers. Browser tests cannot be replaced by the mocked unit tests.

Cache: batches of 100 records for 1 hour in the CDN, 60 seconds in the browser; client chooses a random record. This reduces upstream requests but is not a global daily quota or abuse-proof rate limiter. Cache is per URL/region, and arbitrary search terms can create new entries. Remain on Hobby and monitor usage; no paid cache/database is required.

After production validation, rotate the already published Harvard key, set the replacement only as server-side HARVARD_API_KEY, redeploy, and revoke the old key. Historical previews/browser bundles can still contain the old credential; deleting its environment variable does not invalidate those copies.
