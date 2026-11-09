/**
 * Build public/favicon.ico from public/logo.png.
 *
 * The tab icon is /logo.svg (see src/layouts/Base.astro). favicon.ico is the
 * file some browsers, bookmark tools and link previews ask for by name, so it
 * should show the same logo. Re-run this whenever logo.png changes.
 *
 * Usage: node scripts/make_favicon.mjs
 *
 * Requires: nothing extra - it uses sharp, which Astro already installs.
 */

import { writeFile } from "node:fs/promises";
import sharp from "sharp";

const SOURCE = "public/logo.png";
const OUTPUT = "public/favicon.ico";
const SIZES = [16, 32, 48];

// The logo is taller than it is wide, so pad it to a square with a transparent
// background rather than stretching it.
const images = await Promise.all(
  SIZES.map((size) =>
    sharp(SOURCE)
      .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer()
  )
);

// An .ico file is a 6-byte header, then one 16-byte entry per size, then the
// images themselves. Each image is stored as a PNG, which every current
// browser reads.
const header = Buffer.alloc(6);
header.writeUInt16LE(1, 2); // file type: 1 = icon
header.writeUInt16LE(images.length, 4);

let offset = header.length + 16 * images.length;
const entries = images.map((image, i) => {
  const entry = Buffer.alloc(16);
  entry.writeUInt8(SIZES[i], 0); // width
  entry.writeUInt8(SIZES[i], 1); // height
  entry.writeUInt16LE(1, 4); // colour planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(image.length, 8);
  entry.writeUInt32LE(offset, 12);
  offset += image.length;
  return entry;
});

await writeFile(OUTPUT, Buffer.concat([header, ...entries, ...images]));
console.log(`Wrote ${OUTPUT} (${SIZES.join(", ")} px) from ${SOURCE}`);
