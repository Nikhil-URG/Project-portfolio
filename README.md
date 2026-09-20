# Engineering Portfolio — Nikhil Ravi

A personal engineering portfolio built as a technical notebook rather than a
landing page: case studies for robotics and machine-learning projects, an
interactive skills graph, and a perception deep dive. The visual system is
deliberately restrained — editorial typography, hairline rules, hand-authored
SVG diagrams, and animation that communicates data flow rather than decorating.

## Overview

- **Static-first Astro site** with server routes only where required (admin CMS).
- **Case studies** for mobile robotics (ROS 2 navigation stack) and imitation
  learning (LeRobot SO101 / ACT), plus a perception-focused engineering page.
- **The Lab** — an interactive graph showing how technical areas feed each
  other (data → learning → perception → robotics, embedded/software → robotics).
- **Keystatic CMS** at `/admin` for editing project notes and content, backed by
  GitHub commits in production and the local filesystem in development.

## Tech Stack

| Layer | Choice |
| --- | --- |
| Framework | [Astro](https://astro.build) 5 (static output + Vercel adapter for server routes) |
| Language | TypeScript (strict) |
| Styling | [Tailwind CSS](https://tailwindcss.com) 4 with design tokens in CSS |
| Interactivity | React 19 islands (interactive diagrams only) |
| Content | MDX via Astro content collections + Zod schemas |
| CMS | [Keystatic](https://keystatic.com) with GitHub OAuth |
| Typography | Self-hosted variable fonts via Fontsource (no external requests) |
| Testing | Playwright (visual checks during development) |

## Requirements

- Node.js 22 or newer
- npm 10 or newer

## Local Development

```bash
npm install
npm run dev        # http://localhost:4321
```

Other commands:

```bash
npm run build      # production build (outputs to dist/ and .vercel/output/)
npm run preview    # serve the production build locally
npm run check      # Astro + TypeScript diagnostics
```

The public site runs without any configuration. The admin CMS at `/admin`
additionally requires environment variables — see below.

## Environment Variables (admin only)

Copy `.env.example` to `.env` and fill in the values. These are only needed to
use the `/admin` editor; the rest of the site works without them.

| Variable | Purpose |
| --- | --- |
| `KEYSTATIC_GITHUB_CLIENT_ID` | GitHub OAuth App client ID |
| `KEYSTATIC_GITHUB_CLIENT_SECRET` | GitHub OAuth App client secret |
| `PRIVATE_GITHUB_LOGIN` | The single GitHub username allowed to sign in at `/admin` |
| `KEYSTATIC_GITHUB_REPO` | `owner/repo` that Keystatic commits content to (production) |
| `KEYSTATIC_SECRET` | Random string used to sign the admin session cookie |

Create a GitHub OAuth App with **both** callback URLs:

```
http://localhost:4321/api/keystatic/github/oauth/callback
http://localhost:4321/api/keystatic/created-login
```

In development, Keystatic stores content locally on disk. In production it
commits to the repository configured in `KEYSTATIC_GITHUB_REPO`.

## Project Structure

```
src/
├── components/
│   ├── casestudy/        Case-study diagrams and interactive islands
│   ├── diagrams/         Homepage instrument-panel SVGs (scan field, trajectory)
│   ├── home/             The Lab connection-graph island
│   ├── perception/       Perception pipeline island
│   └── *.astro           Layout primitives (Nav, Footer, Section, ProjectCard, …)
├── content/
│   └── projects/         MDX project notes (Keystatic-managed)
├── data/
│   └── systems.ts        Featured systems + Lab graph data
├── layouts/
│   └── BaseLayout.astro  Document shell, metadata, reveal-on-scroll behavior
├── pages/                Routes (/, /work, /perception, /admin, API endpoints)
├── styles/
│   └── global.css        Design tokens, utilities, keyframes
├── consts.ts             Site metadata, navigation, links
└── middleware.ts         Auth guard for the admin API
```

## Deployment

The project is configured for [Vercel](https://vercel.com) (`@astrojs/vercel`).

1. Import the repository into Vercel — the Astro preset is detected automatically.
2. Add the five environment variables from the table above in
   **Project → Settings → Environment Variables**.
3. Register the production callback URLs on the GitHub OAuth App (same two
   paths as above, with your production domain).
4. Content edits made in `/admin` are committed to GitHub and trigger a
   redeploy automatically.

Most pages are prerendered static HTML; only the admin and its API routes run
as server functions.

## Credits

- [Astro](https://astro.build) — MIT
- [React](https://react.dev) — MIT
- [Tailwind CSS](https://tailwindcss.com) — MIT
- [Keystatic](https://keystatic.com) — MIT
- [@octokit/oauth-app](https://github.com/octokit/oauth-app.js) — MIT
- [@astrojs/vercel](https://github.com/withastro/astro) — MIT
- Typefaces via [Fontsource](https://fontsource.org): Space Grotesk, Source
  Serif 4, and JetBrains Mono — SIL Open Font License
- [Playwright](https://playwright.dev) — Apache-2.0 (development only)

All diagrams and illustrations are hand-authored inline SVG created for this
site. No stock imagery or third-party visual assets are used.

## Usage

The code is shared for reference. The written content, project descriptions,
and personal assets (including the CV) are © Nikhil Ravi and are not intended
for reuse.
