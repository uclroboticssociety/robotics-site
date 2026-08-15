export type Sponsor = {
  /** Shown as the image alt text, so it must be the organisation's real name. */
  name: string;
  logo: string;
  url?: string;
};

/**
 * TODO (committee): these two entries carry no name — they were added as bare
 * image paths. Fill in the real organisation names so the logos have alt text
 * for screen readers, and add `url` if the sponsor wants to be linked.
 * src/assets/sponsors/ also contains 3.png and 4.png, which nothing renders.
 */
export const sponsors: Sponsor[] = [
  { name: "", logo: "sponsors/1.png" },
  { name: "", logo: "sponsors/2.png" },
];
