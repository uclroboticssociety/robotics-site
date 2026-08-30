import type { CollectionEntry } from "astro:content";
import type { ImageMetadata } from "astro";

export type ProjectEntry = CollectionEntry<"projects">;

/** See the note in lib/events.ts — these keys are real paths, not slugs. */
const projectImages = import.meta.glob<ImageMetadata>(
  "/src/content/projects/**/*.{png,jpg,jpeg,webp,gif,svg}",
  { eager: true, import: "default" }
);

/** "src/content/projects/VLA1/index.md" -> "VLA1" */
export const folderOf = (entry: ProjectEntry) =>
  (entry.filePath ?? "")
    .replace(/^src\/content\/projects\//, "")
    .split("/")
    .slice(0, -1)
    .join("/");

/**
 * Card cover. By convention that is 0.png beside the entry's index.md; if it is
 * missing we fall back to the first image in the folder, and finally to
 * undefined so the card renders its gradient panel rather than an empty <img>.
 */
export const coverOf = (entry: ProjectEntry): ImageMetadata | undefined => {
  const prefix = `/src/content/projects/${folderOf(entry)}/`;
  const direct = Object.keys(projectImages)
    .filter((path) => path.startsWith(prefix) && !path.slice(prefix.length).includes("/"))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const key = direct.find((path) => path.endsWith("/0.png")) ?? direct[0];
  return key ? projectImages[key] : undefined;
};
