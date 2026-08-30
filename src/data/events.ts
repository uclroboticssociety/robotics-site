export type EventCategoryId = "workshops" | "hackathons" | "challenges" | "socials";
export type EventTag = "workshop" | "hackathon" | "challenge" | "social";

export type EventInitiative = {
  id: EventCategoryId;
  /** Plural, used as the sidebar heading. */
  title: string;
  /** Singular, used on category tags and status rows. Set in mono uppercase by CSS. */
  label: string;
  href: string;
  /** The frontmatter tag in src/content/events/<folder>/index.md that maps here. */
  tag: EventTag;
  description: string;
};

// Category icons were emoji; they clash with this palette, so categories are
// identified by their mono uppercase label instead. Do not reintroduce emoji.
export const initiatives: EventInitiative[] = [
  {
    id: "workshops",
    title: "Workshops",
    label: "Workshop",
    href: "/events",
    tag: "workshop",
    description:
      "Hands-on learning sessions to build your robotics skills. From basics to advanced topics—no prior experience needed. Join us to get started with hardware, software, and everything in between.",
  },
  {
    id: "hackathons",
    title: "Hackathons",
    label: "Hackathon",
    href: "/events",
    tag: "hackathon",
    description:
      "Intensive coding and building competitions to push your limits. Team up, prototype fast, and showcase your projects. Our hackathons are a great way to learn, compete, and connect with the community.",
  },
  {
    id: "challenges",
    title: "Challenges",
    label: "Challenge",
    href: "/events",
    tag: "challenge",
    description:
      "Friendly competitions and challenges throughout the year. Test your skills, tackle real-world problems, and earn recognition. Open to all experience levels.",
  },
  {
    id: "socials",
    title: "Socials",
    label: "Social",
    href: "/events",
    tag: "social",
    description:
      "Casual meetups, socials, and networking events. Get to know the society, make friends, and unwind. Perfect for anyone who wants to be part of the robotics community.",
  },
];
