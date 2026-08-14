import type { CollectionEntry } from "astro:content";
import type { ImageMetadata } from "astro";
import { initiatives, type EventInitiative } from "../data/events";

export type EventEntry = CollectionEntry<"events">;

/**
 * Image lookup for event folders.
 *
 * The glob keys are literal filesystem paths, complete with the original spaces
 * and capitals ("/src/content/events/Board Games/1.png"). They must therefore be
 * derived from `entry.filePath`, never from `entry.id` — `id` is the slugified
 * URL ("board-games") and looking up with it silently yields undefined, which
 * the templates would swallow into src="".
 */
const eventImages = import.meta.glob<ImageMetadata>(
  "/src/content/events/**/*.{png,jpg,jpeg,webp,gif,svg}",
  { eager: true, import: "default" }
);

/** "src/content/events/Board Games/index.md" -> "Board Games" */
export const folderOf = (entry: EventEntry) =>
  (entry.filePath ?? "")
    .replace(/^src\/content\/events\//, "")
    .split("/")
    .slice(0, -1)
    .join("/");

/**
 * First image sitting directly beside the entry's index.md, or undefined.
 * Sorted naturally so "2.png" precedes "10.png".
 *
 * Three events (CAD Workshop, MATLAB Drone Simulation, PCB Workshop) have no
 * images at all. Callers must handle undefined by rendering the gradient
 * fallback rather than an empty <img>.
 */
export const thumbnailOf = (entry: EventEntry): ImageMetadata | undefined => {
  const prefix = `/src/content/events/${folderOf(entry)}/`;
  const key = Object.keys(eventImages)
    .filter((path) => path.startsWith(prefix) && !path.slice(prefix.length).includes("/"))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))[0];

  return key ? eventImages[key] : undefined;
};

/** The category an event belongs to, from its first recognised tag. */
export const categoryOf = (entry: EventEntry): EventInitiative | undefined =>
  initiatives.find((initiative) => entry.data.tags?.includes(initiative.tag));

export type EventStatus = "upcoming" | "today" | "past";

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

/**
 * Status is computed at build time, so it refreshes on each deploy rather than
 * continuously. That is accurate enough for a list; the hero countdown runs
 * client-side and is always live.
 *
 * There is no end-time field on events, so an event's duration is unknown —
 * "today" is as precise as the data allows, and we do not guess a run length.
 */
export const statusOf = (entry: EventEntry, now = new Date()): EventStatus => {
  const start = new Date(entry.data.date);
  if (sameDay(start, now)) return "today";
  return start.getTime() > now.getTime() ? "upcoming" : "past";
};

export const statusLabel = (status: EventStatus) =>
  status === "upcoming" ? "Upcoming" : status === "today" ? "Today" : "Recap";

export const byDateDesc = (a: EventEntry, b: EventEntry) =>
  new Date(b.data.date).getTime() - new Date(a.data.date).getTime();

export const byDateAsc = (a: EventEntry, b: EventEntry) =>
  new Date(a.data.date).getTime() - new Date(b.data.date).getTime();

/** Soonest event still ahead of us, or undefined if there are none. */
export const nextEvent = (entries: EventEntry[], now = new Date()) =>
  [...entries]
    .filter((entry) => new Date(entry.data.date).getTime() >= now.getTime())
    .sort(byDateAsc)[0];

export const mostRecentEvent = (entries: EventEntry[]) => [...entries].sort(byDateDesc)[0];

// Dates carry explicit offsets and the society is in London, so format in that
// zone explicitly — otherwise output depends on the build machine's timezone.
const LONDON = "Europe/London";

/** "Fri 23 Oct" — set uppercase by CSS in row and meta contexts. */
export const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    timeZone: LONDON,
  });

/** "Fri 23 Oct 2026, 18:00" */
export const longDate = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: LONDON,
  });
