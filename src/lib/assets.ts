import type { ImageMetadata } from "astro";

/**
 * Lookup for site images that belong to a page rather than to a content entry
 * (committee portraits, advisor portraits, mission photos, sponsor logos).
 *
 * These live in src/assets/ rather than public/ so Astro can optimise them:
 * files under public/ are copied byte-for-byte and stay as multi-megabyte PNGs,
 * while these are converted to webp and emitted at the sizes actually used.
 *
 * Reference them by path relative to src/assets, e.g. asset("committee/1.png").
 * Anything genuinely static — favicon, logo — stays in public/.
 */
const files = import.meta.glob<ImageMetadata>(
  "/src/assets/**/*.{png,jpg,jpeg,webp,gif,svg}",
  { eager: true, import: "default" }
);

export const asset = (path?: string): ImageMetadata | undefined =>
  path ? files[`/src/assets/${path}`] : undefined;
