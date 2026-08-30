export type Member = {
  name: string;
  role: string;
  /** Path under public/. Omit and the tile falls back to the member's initials. */
  photo?: string;
  /** Full LinkedIn profile URL. Omit to hide the link/badge on this member's tile. */
  linkedin?: string;
};



export const committee: Member[] = [
  { name: "Xavier Parker", role: "President", photo: "committee/1.jpg", linkedin: "https://www.linkedin.com/in/xavier-parker1/" },
  { name: "Tara Kasayapanand", role: "VP, Treasurer", photo: "committee/2.jpg", linkedin: "https://www.linkedin.com/in/tara-kasayapanand/" },
  { name: "Ethan Hocquellet", role: "Technical Officer", photo: "committee/3.jpg", linkedin: "https://www.linkedin.com/in/ethanhocquellet/" },
  { name: "Yash Joshi", role: "Welfare Officer", photo: "committee/4.jpg", linkedin: "https://www.linkedin.com/in/yash-joshi-6575b1280/" },
  { name: "Rahul Ranjan", role: "Teaching Officer", photo: "committee/5.jpg", linkedin: "https://www.linkedin.com/in/rahul-ranjan-529492264/" },
  { name: "Aryan Naik", role: "Teaching Officer", photo: "committee/6.jpg", linkedin: "https://www.linkedin.com/in/aryan-naik06/" },
  { name: "Aryan Dashti", role: "Teaching Officer", photo: "committee/7.jpg", linkedin: "https://www.linkedin.com/in/aryan-dashti-89b011293/" },
  { name: "Edwin Readhead", role: "Industry Coordinator", photo: "committee/8.jpg", linkedin: "https://www.linkedin.com/in/edwin-redhead/" },
  { name: "Hailey Quek", role: "Design & Social Media Officer", photo: "committee/9.jpg", linkedin: "https://www.linkedin.com/in/hailey-quek/" },
];

export const initialsOf = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
