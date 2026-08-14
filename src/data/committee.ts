export type Member = {
  name: string;
  role: string;
  /** Path under public/. Omit and the tile falls back to the member's initials. */
  photo?: string;
};

/**
 * The current committee, in the order they appear on the site.
 * Photos live in public/committee/. A member without a photo still renders —
 * the tile shows their initials — so it is fine to add someone before their
 * headshot exists.
 */
export const committee: Member[] = [
  { name: "Morgan Zhang", role: "President", photo: "/committee/1.png" },
  { name: "Xavier Parker", role: "Treasurer", photo: "/committee/2.png" },
  { name: "Martin Chan", role: "Teaching Officer", photo: "/committee/3.png" },
  { name: "Taylan Arslan", role: "Teaching Officer", photo: "/committee/4.png" },
  { name: "Ian Qichen Yin", role: "Teaching Officer", photo: "/committee/11.png" },
  { name: "Mingxuan Song", role: "Technical Officer", photo: "/committee/5.png" },
  { name: "Akhilesh Pranav", role: "Industry Coordinator", photo: "/committee/6.png" },
  { name: "Tara Kasayapanand", role: "Head of Events", photo: "/committee/7.png" },
  { name: "Hailey Quek", role: "Design & Social Media Officer", photo: "/committee/8.png" },
  { name: "Hamnah Javed", role: "Head of Marketing", photo: "/committee/9.png" },
  { name: "Yizhong Yan", role: "Web Officer", photo: "/committee/10.png" },
];

/** "Morgan Zhang" -> "MZ". Used by the tile fallback when there is no photo. */
export const initialsOf = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
