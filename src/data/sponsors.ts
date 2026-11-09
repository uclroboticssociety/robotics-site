export type Sponsor = {
  /** The organisation's real name, used as the logo's alt text. */
  name: string;
  /** Path under src/assets/, e.g. "sponsors/elo.png". Use a logo with a
   *  transparent background, trimmed close to the artwork. */
  logo: string;
  /** Their website. Its address is printed under the logo; without one,
   *  the logo is not a link. */
  url?: string;
};

/**
 * Order here is the order on /about/sponsors. An entry whose logo file is
 * missing is skipped rather than shown broken.
 */
export const sponsors: Sponsor[] = [
  { name: "MathWorks", logo: "sponsors/mathworks.svg", url: "https://www.mathworks.com" },
  { name: "ELO", logo: "sponsors/elo.png", url: "https://elo.inc" },
];
