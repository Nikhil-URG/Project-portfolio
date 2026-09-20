import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    tags: z.array(z.string()),
    year: z.string().min(1),
    status: z.enum(["active", "shipped", "archived"]).default("shipped"),
    order: z.number().default(99),
    video: z.string().url().optional(),
    links: z
      .array(z.object({ label: z.string(), href: z.string().url() }))
      .optional(),
  }),
});

export const collections = { projects };
