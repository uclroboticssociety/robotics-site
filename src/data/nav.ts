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
      // Advisory Team is temporarily unrouted (src/pages/about/_advisoryteam.astro)
      // - re-add this link when the section comes back.
      { href: "/join", label: "Join Us" },
    ],
  },
  {
    href: "/events",
    label: "Events",
  },
  // Top level rather than inside About: sponsors need to find this without
  // opening a dropdown. Deliberately not also left in the About children -
  // isCurrentBranch marks a parent current when any child matches, so the
  // duplicate would highlight both About and Sponsors on the same page.
  { href: "/about/sponsors", label: "Sponsors" },
  // Projects is temporarily unrouted (src/pages/_projects*) - re-add this
  // link when the section comes back.
];

export const joinLink = { href: "/join", label: "Join Us" };
