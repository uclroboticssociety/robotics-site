export type EventInitiative = {
  id: "workshops" | "hackathons" | "challenges" | "socials";
  title: string;
  emoji: string;
  href: string;
  description: string;
  tag: "workshop" | "hackathon" | "challenge" | "social";
};

export const initiatives: EventInitiative[] = [
  {
    id: "workshops",
    emoji: "💻",
    title: "Workshops",
    href: "/events",
    tag: "workshop",
    description:
      "Hands-on learning sessions to build your robotics skills. From basics to advanced topics—no prior experience needed. Join us to get started with hardware, software, and everything in between.",
  },
  {
    id: "hackathons",
    emoji: "🚀",
    title: "Hackathons",
    href: "/events",
    tag: "hackathon",
    description:
      "Intensive coding and building competitions to push your limits. Team up, prototype fast, and showcase your projects. Our hackathons are a great way to learn, compete, and connect with the community.",
  },
  {
    id: "challenges",
    emoji: "🏆",
    title: "Challenges",
    href: "/events",
    tag: "challenge",
    description:
      "Friendly competitions and challenges throughout the year. Test your skills, tackle real-world problems, and earn recognition. Open to all experience levels.",
  },
  {
    id: "socials",
    emoji: "🎉",
    title: "Socials",
    href: "/events",
    tag: "social",
    description:
      "Casual meetups, socials, and networking events. Get to know the society, make friends, and unwind. Perfect for anyone who wants to be part of the robotics community.",
  },
];
