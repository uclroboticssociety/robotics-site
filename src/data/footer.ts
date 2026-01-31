export type FooterLink = { href: string; label: string };
export type FooterColumn = { title: string; links: FooterLink[] };

export const footerColumns: FooterColumn[] = [
  {
    title: "About",
    links: [
      { href: "/about/mission", label: "Mission" },
      { href: "/about/committee", label: "Committee" },
      { href: "/about/advisoryteam", label: "Advisory Team" },
      { href: "/about/sponsors", label: "Sponsors" },
    ],
  },
  {
    title: "Events",
    links: [
      { href: "/events", label: "Workshops" },
      { href: "/events", label: "Hackathons" },
      { href: "/events", label: "Challenges" },
      { href: "/events", label: "Socials" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/projects", label: "Projects" },
      { href: "/join", label: "Join Us" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "#", label: "Code of Conduct" },
      { href: "#", label: "Privacy" },
    ],
  },
];

export const footerBottom = {
  signIn: { href: "#", label: "Sign in" },
  copy: "UCL Robotics Society",
};
