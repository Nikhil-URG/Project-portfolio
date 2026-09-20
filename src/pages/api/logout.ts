import type { APIRoute } from "astro";

/**
 * Logout — clears the admin session cookie.
 */
export const GET: APIRoute = async ({ cookies, redirect }) => {
  cookies.delete("keystatic-session", { path: "/" });
  return redirect("/admin");
};
