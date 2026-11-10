import type { CollectionEntry } from "astro:content";
import type { ImageMetadata } from "astro";
import { initiatives, type EventInitiative } from "../data/events";
import { statusAt, type EventStatus } from "./eventStatus";

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

/** "src/content/events/2025-2026/Board Games Oct 2025/index.md" -> "2025-2026/Board Games Oct 2025" */
export const folderOf = (entry: EventEntry) =>
  (entry.filePath ?? "")
    .replace(/^src\/content\/events\//, "")
    .split("/")
    .slice(0, -1)
    .join("/");

/** The event's own folder name, without the academic-year folder above it:
 *  "Board Games Oct 2025". This is the label shown in the events sidebar. */
export const folderNameOf = (entry: EventEntry) => folderOf(entry).split("/").pop() ?? "";

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

export { statusLabel, type EventStatus } from "./eventStatus";

/**
 * Status at build time. It is only refreshed when the site is rebuilt, so every
 * component that renders it also re-checks it in the browser — see
 * eventStatus.ts.
 */
export const statusOf = (entry: EventEntry, now = new Date()): EventStatus =>
  statusAt(entry.data.date, now);

export const byDateDesc = (a: EventEntry, b: EventEntry) =>
  new Date(b.data.date).getTime() - new Date(a.data.date).getTime();

export const byDateAsc = (a: EventEntry, b: EventEntry) =>
  new Date(a.data.date).getTime() - new Date(b.data.date).getTime();

export const mostRecentEvent = (entries: EventEntry[]) => [...entries].sort(byDateDesc)[0];

// Dates carry explicit offsets and the society is in London, so format in that
// zone explicitly — otherwise output depends on the build machine's timezone.
const LONDON = "Europe/London";

// UK academic years run September to August.
const academicYearStart = (iso: string) => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "numeric",
    timeZone: LONDON,
  }).formatToParts(new Date(iso));
  const year = Number(parts.find((p) => p.type === "year")?.value);
  const month = Number(parts.find((p) => p.type === "month")?.value);
  return month >= 9 ? year : year - 1;
};

/** "2025/2026" style UK academic-year label. */
export const academicYearOf = (entry: EventEntry) => {
  const start = academicYearStart(entry.data.date);
  return `${start}/${start + 1}`;
};

/** Events bucketed by academic year, most recent year first; events within
 *  each bucket keep whatever order the caller already sorted them in. */
export const groupByAcademicYear = (entries: EventEntry[]) => {
  const groups = new Map<string, EventEntry[]>();
  for (const entry of entries) {
    const year = academicYearOf(entry);
    if (!groups.has(year)) groups.set(year, []);
    groups.get(year)!.push(entry);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([year, events]) => ({ year, events }));
};

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
