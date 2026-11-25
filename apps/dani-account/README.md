# dani-account

Cloudflare Worker at auth.dani.danlab.dev. Google sign-in (same account on mobile and desktop) plus per-user sync in D1.

- `GET /v1/google/start?redirect=dani-dex://auth` starts sign-in. Redirect must be `dani-dex://...` or `http://127.0.0.1|localhost`.
- `GET /v1/google/callback` is the Google OAuth redirect URI. Returns to the app with `#token=<session>`.
- `GET /v1/me`, `POST /v1/logout`.
- `GET /v1/restore` full restore, `GET /v1/sync?since=<ts>` changes.
- `PUT|DELETE /v1/sync/<kind>/<id>` with `{data, version}`. Kinds: settings, agent, provider-config, conversation. Secrets and provider tokens are never synced.

Deploy: create D1 `dani-account`, set `database_id`, `wrangler secret put GOOGLE_CLIENT_ID|GOOGLE_CLIENT_SECRET|STATE_SECRET`, `npm run migrate && npm run deploy`.
