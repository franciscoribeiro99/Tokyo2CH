/**
 * Decide whether this deployment is allowed to send real mail.
 *
 * Two traps this exists to avoid, both found in the live project rather than
 * imagined:
 *
 *   1. `CONTACT_DELIVERY_MODE` was set to an *empty string* in Vercel. `??`
 *      only falls back on null and undefined, so the intended default never
 *      applied and the mode became "", which is neither branch. A blank value
 *      now means unset.
 *   2. Vercel builds preview deployments with `NODE_ENV=production`. Keying
 *      only off NODE_ENV meant every pull-request preview would try to send
 *      real mail from the client's own mailbox. `VERCEL_ENV` is the one that
 *      distinguishes production from preview.
 *
 * Sending stays the default in production, because a contact form that
 * silently swallows leads is far worse than one that errors on first deploy.
 */
export function resolveDeliveryMode(): "log" | "provider" {
  const configured = process.env.CONTACT_DELIVERY_MODE?.trim();
  if (configured === "log" || configured === "provider") return configured;

  const vercelEnv = process.env.VERCEL_ENV;
  if (vercelEnv) return vercelEnv === "production" ? "provider" : "log";

  return process.env.NODE_ENV === "production" ? "provider" : "log";
}
