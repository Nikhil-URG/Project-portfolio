import { defineMiddleware } from "astro:middleware";

const SESSION_COOKIE = "keystatic-session";

/**
 * Guards the Keystatic API routes.
 * - /api/keystatic/created-login stays reachable (that's how you get a cookie)
 * - every other Keystatic API call requires a session cookie -> 401
 * - /keystatic (injected admin UI route) redirects to /admin, which renders
 *   the sign-in screen for unauthenticated visitors and the editor otherwise
 */
export const onRequest = defineMiddleware((context, next) => {
  const path = context.url.pathname;

  const isLoginRoute = path === "/api/keystatic/created-login";
  const isKeystaticApi = path.startsWith("/api/keystatic");
  const isInjectedUi = path === "/keystatic" || path.startsWith("/keystatic/");

  if (isInjectedUi) {
    return context.redirect("/admin");
  }

  if (isKeystaticApi && !isLoginRoute) {
    const session = context.cookies.get(SESSION_COOKIE);
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return next();
});
