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
      { href: "/about/alumni", label: "Faculty Advisor" },
      { href: "/about/sponsors", label: "Sponsors" },
    ],
  },
  {
    href: "/events",
    label: "Events",
  },
  { href: "/projects", label: "Projects" },
];

export const joinLink = { href: "/join", label: "Join Us" };
