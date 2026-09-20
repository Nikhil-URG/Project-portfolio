import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import keystatic from "@keystatic/astro";
import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel";

export default defineConfig({
  site: "https://project-portfolio-nikhil-ravi1.vercel.app",
  output: "server",
  adapter: vercel(),
  integrations: [react(), mdx(), keystatic()],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      // @keystatic/* imports the astro:env/server virtual module; the esbuild
      // dep scanner can't resolve it, so keep these out of pre-bundling.
      exclude: ["@keystatic/astro", "@keystatic/core"],
    },
    ssr: {
      // ...and make Vite transform them through the plugin chain at SSR.
      noExternal: ["@keystatic/astro", "@keystatic/core"],
    },
  },
  redirectTrailingSlash: false,
});
