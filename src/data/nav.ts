export type Child = { href: string; label: string };
export type Item = { href: string; label: string; children?: Child[] };

export const menu: Item[] = [
  { href: "/", label: "Home" },
  {
    href: "/about/mission",
    label: "About",
    children: [
      { href: "/about/mission", label: "Mission" },
      { href: "/about/committee", label: "Committee" },
      { href: "/about/advisoryteam", label: "Advisory Team" },
      { href: "/about/sponsors", label: "Sponsors" },
      { href: "/join", label: "Join Us" },
    ],
  },
  {
    href: "/events",
    label: "Events",
  },
  // Projects is temporarily unrouted (src/pages/_projects*) - re-add this
  // link when the section comes back.
];

export const joinLink = { href: "/join", label: "Join Us" };
