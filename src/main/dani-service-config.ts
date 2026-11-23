export interface DaniServiceConfig {
  accountApi: string;
  configured: boolean;
}
/** A local development endpoint is not a hosted-service readiness claim. */
export function daniServiceConfig(value: string | undefined): DaniServiceConfig {
  if (!value?.trim()) return { accountApi: "http://127.0.0.1:3100", configured: false };
  const url = new URL(value);
  const loopback = url.hostname === "127.0.0.1" || url.hostname === "localhost";
  if (url.username || url.password || url.search || url.hash || url.pathname !== "/") throw new Error("DANI_AUTH_API_URL must be an origin without credentials, query or path.");
  if (url.hostname === "openbot.run" || url.hostname.endsWith(".openbot.run")) throw new Error("Configure a Dani-owned service, not the upstream account service.");
  if (url.protocol !== "https:" && !(url.protocol === "http:" && loopback)) throw new Error("DANI_AUTH_API_URL requires HTTPS or HTTP loopback.");
  return { accountApi: url.origin, configured: true };
}
