import type { APIRoute } from "astro";
import { OAuthApp } from "@octokit/oauth-app";

/**
 * GitHub OAuth login + callback for the /admin access gate.
 * GET /api/keystatic/created-login            -> redirect to GitHub
 * GET /api/keystatic/created-login?code=...   -> verify, restrict to owner, set cookie
 *
 * Only the GitHub account named in PRIVATE_GITHUB_LOGIN may authenticate.
 * Uses the same OAuth app as Keystatic (KEYSTATIC_GITHUB_* env vars).
 */

const GITHUB_CLIENT_ID = import.meta.env.KEYSTATIC_GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = import.meta.env.KEYSTATIC_GITHUB_CLIENT_SECRET;
const ALLOWED_LOGIN = import.meta.env.PRIVATE_GITHUB_LOGIN; // your GitHub username, e.g. "nikhilravi"

const app = new OAuthApp({
  clientType: "oauth-app",
  clientId: GITHUB_CLIENT_ID!,
  clientSecret: GITHUB_CLIENT_SECRET!,
});

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  const code = url.searchParams.get("code");

  // Step 1: no code yet — bounce to GitHub's authorize URL
  if (!code) {
    if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET || !ALLOWED_LOGIN) {
      return new Response(
        "Missing KEYSTATIC_GITHUB_CLIENT_ID / KEYSTATIC_GITHUB_CLIENT_SECRET / PRIVATE_GITHUB_LOGIN env vars.",
        { status: 500 },
      );
    }
    const redirectUri = `${url.origin}/api/keystatic/created-login`;
    return redirect(
      `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=repo`,
    );
  }

  // Step 2: GitHub called us back with a code — exchange it and check identity
  try {
    const { authentication } = await app.createToken({ code });
    const token = (authentication as { token: string }).token;

    const res = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
    });
    if (!res.ok) return redirect("/admin?error=github");
    const user = (await res.json()) as { login: string };

    if (user.login !== ALLOWED_LOGIN) {
      return redirect("/admin?error=not-authorized");
    }

    cookies.set("keystatic-session", token, {
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8, // 8 hours
    });

    return redirect("/admin");
  } catch {
    return redirect("/admin?error=oauth");
  }
};
