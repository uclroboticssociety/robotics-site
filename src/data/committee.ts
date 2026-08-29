export type Member = {
  name: string;
  role: string;
  /** Path under public/. Omit and the tile falls back to the member's initials. */
  photo?: string;
};

/**
 * The current committee, in the order they appear on the site.
 *
 * Photos live in src/assets/committee/ and are referenced by path relative to
 * src/assets — that is what lets Astro optimise them. A member without a photo
 * still renders (the tile shows their initials), so it is fine to add someone
 * before their headshot exists.
 */
export const committee: Member[] = [
  { name: "Xavier Parker", role: "President", photo: "committee/1.jpg" },
  { name: "Tara Kasayapanand", role: "VP, Treasurer", photo: "committee/2.jpg" },
  { name: "Ethan Hocquellet", role: "Technical Officer", photo: "committee/3.jpg" },
  { name: "Yash Joshi", role: "Welfare Officer", photo: "committee/4.jpg"},
  { name: "Rahul Ranjan", role: "Teaching Officer", photo: "committee/5.jpg" },
  { name: "Aryan Naik", role: "Teaching Officer", photo: "committee/6.jpg" },
  { name: "Aryan Dashti", role: "Teaching Officer", photo: "committee/7.jpg" },
  { name: "Edwin Readhead", role: "Industry Coordinator", photo: "committee/8.jpg" },
  { name: "Hailey Quek", role: "Design & Social Media Officer", photo: "committee/9.jpg" },
];

export const initialsOf = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
