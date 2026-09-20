import { config, fields, collection } from "@keystatic/core";

const isProd =
  typeof process !== "undefined" && process.env?.VERCEL === "1";

export default config({
  storage:
    isProd
      ? {
          kind: "github",
          repo: process.env.KEYSTATIC_GITHUB_REPO as `${string}/${string}`,
        }
      : { kind: "local" },
  ui: {
    brand: { name: "Nikhil Ravi — Admin" },
    navigation: {
      Content: ["projects"],
    },
  },
  collections: {
    projects: collection({
      label: "Projects",
      slugField: "title",
      path: "src/content/projects/*",
      format: { contentField: "body" },
      schema: {
        title: fields.slug({
          name: {
            label: "Title",
            validation: { length: { min: 1 } },
          },
        }),
        summary: fields.text({
          label: "Summary",
          multiline: true,
          validation: { length: { min: 1 } },
        }),
        tags: fields.array(fields.text({ label: "Tag" }), {
          label: "Tags",
          itemLabel: (props) => props.value,
        }),
        year: fields.text({
          label: "Year",
          validation: { length: { min: 4, max: 9 } },
        }),
        status: fields.select({
          label: "Status",
          options: [
            { label: "Active", value: "active" },
            { label: "Shipped", value: "shipped" },
            { label: "Archived", value: "archived" },
          ],
          defaultValue: "shipped",
        }),
        order: fields.integer({ label: "Sort order", defaultValue: 99 }),
        links: fields.array(
          fields.object({
            label: fields.text({ label: "Label" }),
            href: fields.url({ label: "URL" }),
          }),
          { label: "Links", itemLabel: (props) => props.fields.label.value },
        ),
        body: fields.markdoc({ label: "Body" }),
      },
    }),
  },
});
