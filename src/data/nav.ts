export type Child = { href: string; label: string };
export type Item = { href: string; label: string; children?: Child[] };

export const menu: Item[] = [
  { href: "/", label: "Home" },
  {
    href: "/about",
    label: "About",
    children: [
      { href: "/about/mission", label: "Mission" },
      { href: "/about/committee", label: "Committee" },
      { href: "/about/alumni", label: "Alumni" },
      { href: "/about/sponsors", label: "Sponsors" },
    ],
  },
  { href: "/blog", label: "Blog" },
  {
    href: "/events",
    label: "Events",
    children: [
      { href: "/events/workshops", label: "Workshops" },
      { href: "/events/hackathons", label: "Hackathons" },
      { href: "/events/challenges", label: "Challenges" },
      { href: "/events/socials", label: "Socials" },
    ],
  },
  { href: "/projects", label: "Projects" },
];

export const joinLink = { href: "/join", label: "Join Us" };
