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

/**
 * Every image directly inside one folder of src/assets, e.g. assetsIn("hero"),
 * sorted by file name with numbers in counting order (2 before 10). `name` is
 * the file name without its extension. Used where a folder IS the list, so
 * adding a photo means dropping a file in and nothing else.
 */
export const assetsIn = (folder: string): { image: ImageMetadata; name: string }[] => {
  const prefix = `/src/assets/${folder}/`;
  return Object.keys(files)
    .filter((path) => path.startsWith(prefix) && !path.slice(prefix.length).includes("/"))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((path) => ({
      image: files[path],
      name: path.slice(prefix.length).replace(/\.[^.]+$/, ""),
    }));
};
