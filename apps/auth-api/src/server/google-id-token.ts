/**
 * Verifies a Google OpenID Connect ID token for mobile sign-in.
 *
 * No Firebase SDK is used: the RS256 signature is checked against Google's
 * public JWKS with WebCrypto, then issuer, audience, expiry and the verified
 * email claim are validated.
 */

const GOOGLE_JWKS_URL = "https://www.googleapis.com/oauth2/v3/certs";
const GOOGLE_ISSUERS = new Set(["accounts.google.com", "https://accounts.google.com"]);
const JWKS_MAX_AGE_FALLBACK_MS = 60 * 60 * 1000;

export class GoogleIdTokenError extends Error {
  constructor(readonly code: string) {
    super(code);
    this.name = "GoogleIdTokenError";
  }
}

interface JwksKey {
  kid?: string;
  alg?: string;
  use?: string;
  kty?: string;
  n?: string;
  e?: string;
}

interface JwksCache {
  keys: JwksKey[];
  expiresAt: number;
}

let jwksCache: JwksCache | null = null;

function base64UrlToBytes(value: string): Uint8Array<ArrayBuffer> {
  const base64 = value.replace(/-/gu, "+").replace(/_/gu, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

function decodeJsonPart(value: string): Record<string, unknown> {
  try {
    const binary = atob(value.replace(/-/gu, "+").replace(/_/gu, "/"));
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const parsed: unknown = JSON.parse(new TextDecoder().decode(bytes));
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      throw new GoogleIdTokenError("invalid_google_token");
    }
    return parsed as Record<string, unknown>;
  } catch (error) {
    if (error instanceof GoogleIdTokenError) throw error;
    throw new GoogleIdTokenError("invalid_google_token");
  }
}

async function googleSigningKeys(): Promise<JwksKey[]> {
  const now = Date.now();
  if (jwksCache && jwksCache.expiresAt > now) return jwksCache.keys;
  const response = await fetch(GOOGLE_JWKS_URL);
  if (!response.ok) throw new GoogleIdTokenError("google_keys_unavailable");
  const body = (await response.json()) as { keys?: JwksKey[] };
  if (!Array.isArray(body.keys)) throw new GoogleIdTokenError("google_keys_unavailable");
  let maxAgeMs = JWKS_MAX_AGE_FALLBACK_MS;
  const cacheControl = response.headers.get("Cache-Control") ?? "";
  const maxAgeMatch = /max-age=(\d+)/u.exec(cacheControl);
  if (maxAgeMatch) maxAgeMs = Math.min(Number(maxAgeMatch[1]) * 1000, 24 * 60 * 60 * 1000);
  jwksCache = { keys: body.keys, expiresAt: now + maxAgeMs };
  return body.keys;
}

/**
 * Verifies the token and returns the verified Google account email.
 * `clientIds` lists the OAuth client IDs accepted as the token audience.
 */
export async function verifyGoogleIdToken(token: string, clientIds: string[]): Promise<string> {
  const parts = token.split(".");
  if (parts.length !== 3 || clientIds.length === 0) throw new GoogleIdTokenError("invalid_google_token");
  const [encodedHeader, encodedPayload, encodedSignature] = parts as [string, string, string];
  const header = decodeJsonPart(encodedHeader);
  if (header.alg !== "RS256" || typeof header.kid !== "string") {
    throw new GoogleIdTokenError("invalid_google_token");
  }
  const keys = await googleSigningKeys();
  const jwk = keys.find(
    (key) => key.kid === header.kid && key.kty === "RSA" && (key.alg === undefined || key.alg === "RS256"),
  );
  if (!jwk) throw new GoogleIdTokenError("invalid_google_token");
  const cryptoKey = await crypto.subtle
    .importKey("jwk", { ...jwk, ext: true }, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"])
    .catch(() => {
      throw new GoogleIdTokenError("invalid_google_token");
    });
  const signed = new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`);
  const valid = await crypto.subtle
    .verify("RSASSA-PKCS1-v1_5", cryptoKey, base64UrlToBytes(encodedSignature), signed)
    .catch(() => false);
  if (!valid) throw new GoogleIdTokenError("invalid_google_token");
  const claims = decodeJsonPart(encodedPayload);
  if (typeof claims.iss !== "string" || !GOOGLE_ISSUERS.has(claims.iss)) {
    throw new GoogleIdTokenError("invalid_google_token");
  }
  const audiences = typeof claims.aud === "string" ? [claims.aud] : Array.isArray(claims.aud) ? claims.aud : [];
  if (!audiences.some((audience) => typeof audience === "string" && clientIds.includes(audience))) {
    throw new GoogleIdTokenError("invalid_google_token");
  }
  if (typeof claims.exp !== "number" || claims.exp * 1000 <= Date.now()) {
    throw new GoogleIdTokenError("invalid_google_token");
  }
  const email = claims.email;
  const verified = claims.email_verified === true || claims.email_verified === "true";
  if (typeof email !== "string" || !verified) throw new GoogleIdTokenError("google_email_unverified");
  return email;
}
