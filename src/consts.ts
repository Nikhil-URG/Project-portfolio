import fs from "node:fs";
import path from "node:path";

export interface SiteLink {
  label: string;
  href: string;
  external?: boolean;
}

export const SITE = {
  name: "Nikhil Ravi",
  role: "MSc Autonomous Systems · H-BRS",
  tagline: "Engineering notebook — robotics, vision & learning systems",
  url: "https://project-portfolio-nikhil-ravi1.vercel.app",
  description:
    "Personal engineering portfolio of Nikhil Ravi — MSc Autonomous Systems student at H-BRS working across robotics, computer vision, machine learning and embedded systems.",
  links: {
    github: "https://github.com/Nikhil-URG",
    linkedin: "https://www.linkedin.com/in/nikhil-ravi-6bb7b584",
    email: "mailto:nikhil.urg@gmail.com",
    cv: "/cv.pdf",
  },
} as const;

export const HAS_CV = fs.existsSync(
  path.join(process.cwd(), "public", "cv.pdf"),
);

export const SOCIAL_LINKS: SiteLink[] = [
  ...(SITE.links.github
    ? [{ label: "GitHub", href: SITE.links.github, external: true }]
    : []),
  ...(SITE.links.linkedin
    ? [{ label: "LinkedIn", href: SITE.links.linkedin, external: true }]
    : []),
  { label: "Email", href: SITE.links.email, external: true },
  ...(HAS_CV ? [{ label: "CV", href: SITE.links.cv, external: true }] : []),
];

export const NAV = [
  { href: "/work", label: "Work" },
  { href: "/#lab", label: "The Lab" },
  { href: "/#experience", label: "Experience" },
  { href: "/#contact", label: "Contact" },
] as const;

export const HERO_AREAS = [
  "Robotics",
  "Computer Vision",
  "Machine Learning",
  "Embedded Systems",
] as const;
