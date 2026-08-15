export type Advisor = {
  name: string;
  title: string;
  department: string;
  email: string;
  expertise: string[];
  /** Path under public/. Omit and the tile falls back to initials. */
  image?: string;
};

export const facultyAdvisors: Advisor[] = [
  {
    name: "Wei Chen",
    title: "Director",
    department: "UCL Centre for Sustainability and Realtech Innovation",
    email: "wei.chen@ucl.ac.uk",
    expertise: [
      "Information and computing sciences",
      "AI",
      "Machine Learning",
      "Control engineering, mechatronics and robotics",
    ],
    image: "advisor/1.png",
  },
  {
    name: "Zhibin (Alex) Li",
    title: "Associate Professor",
    department: "Department of Computer Science",
    email: "alex.li@ucl.ac.uk",
    expertise: [
      "AI",
      "Optimisation",
      "Control engineering, mechatronics and robotics",
      "Machine learning",
      "Intelligent robotics",
    ],
    image: "advisor/2.png",
  },
  {
    name: "Chengxu Zhou",
    title: "Associate Professor",
    department: "Department of Computer Science",
    email: "chengxu.zhou@ucl.ac.uk",
    expertise: [
      "AI",
      "Intelligent mobility",
      "Intelligent robotics",
      "Assistive robots and technology",
      "Field robotics",
      "Control engineering, mechatronics and robotics",
    ],
    image: "advisor/3.png",
  },
];

export const researchMentors: Advisor[] = [
  {
    name: "Diran Yu",
    title: "PhD Candidate",
    department: "Bartlett School of Sustainable Construction",
    email: "diran.yu.22@ucl.ac.uk",
    expertise: [
      "Evacuation",
      "Virtual Reality",
      "Digital Twin",
      "Building Emergency Management",
      "Robot Application in Construction",
    ],
    image: "advisor/5.png",
  },
  {
    name: "Yunqi Huang",
    title: "PhD Candidate",
    department: "Department of Computer Science",
    email: "yunqi.huang.23@ucl.ac.uk",
    expertise: ["Tactile Sensing", "Soft Robotics", "Machine Learning"],
    image: "advisor/6.png",
  },
  {
    name: "Lingfan Bao",
    title: "PhD Candidate",
    department: "Department of Computer Science",
    email: "lingfan.bao.24@ucl.ac.uk",
    expertise: [
      "Legged robots",
      "Diffusion model",
      "Imitation learning",
      "Reinforcement learning",
      "Optimal control",
    ],
    image: "advisor/7.png",
  },
];
