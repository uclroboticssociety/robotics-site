import { defineCollection, z } from "astro:content";

const events = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.string(),          // ISO 字符串
    location: z.string().optional(),
    signup_url: z.string().url().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

const projects = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    repo: z.string().url().optional(),
    lead: z.string().optional(),
    status: z.enum(["active","paused","completed"]).default("active"),
  }),
});

export const collections = { events, projects };
