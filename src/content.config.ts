import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { slug } from "github-slugger";

// Events are filed in academic-year folders ("2025-2026/Board Games Oct 2025/
// index.md") to keep the content folder tidy, but the year folder is left out
// of the URL: that page is /events/board-games-oct-2025, not
// /events/2025-2026/board-games-oct-2025. The month and year are already in
// the event's own folder name, and leaving it out means moving an event between
// year folders never breaks a link.
//
// Everything else matches Astro's default: each folder name is slugified the
// same way ("Board Games Oct 2025" -> "board-games-oct-2025") and a trailing
// "index" is dropped, so results.md beside index.md still gets a nested URL.
const eventId = ({ entry }: { entry: string }) =>
  entry
    .replace(/\.md$/, "")
    .split("/")
    .filter((segment, i) => !(i === 0 && /^\d{4}-\d{4}$/.test(segment)))
    .map((segment) => slug(segment))
    .join("/")
    .replace(/\/index$/, "");

const events = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/events", generateId: eventId }),
  schema: z.object({
    title: z.string(),
    date: z.string(),          // ISO 8601 string
    location: z.string().optional(),
    signup_url: z.string().url().optional(),
    tags: z.array(z.string()).optional(),
    countdown: z.boolean().optional(),
    countdown_units: z.array(z.enum(["days", "hours", "minutes", "seconds"])).optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    repo: z.string().url().optional(),
    lead: z.string().optional(),
    status: z.enum(["active","paused","completed"]).default("active"),
  }),
});

export const collections = { events, projects };
