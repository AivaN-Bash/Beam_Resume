export const nav = [
  ["About", "/about"],
  ["Experience", "/experience"],
  ["Projects", "/projects"],
  ["Skills", "/skills"],
  ["Contact", "/contact"],
];

export const projects = [
  {
    title: "Two-Player Chess Engine",
    tag: "PERSONAL PROJECT",
    desc: "A full two-player chess engine built in C++ with SFML graphics — legal-move generation checked against perft test suites, animated piece movement, and a board-flip option for local multiplayer.",
    stack: ["C++", "SFML", "Perft testing"],
  },
  {
    title: "TipBeam",
    tag: "PERSONAL PROJECT",
    desc: "A donation-alert and tipping platform for Thai streamers, with PromptPay QR generation and a live OBS browser-source overlay for on-stream alerts.",
    stack: ["TypeScript", "PromptPay API", "OBS overlay"],
  },
  {
    title: "This Portfolio",
    tag: "PERSONAL PROJECT",
    desc: "Designed and built this site end to end — a bilingual (EN/TH) single-page React app with route-based pages, animated typography, and a keyboard- and screen-reader-friendly navigation system.",
    stack: ["React", "Vite", "React Router"],
  },
];

export const skillGroups = [
  ["Customer service", ["Face-to-face support", "Rental bookings", "Documentation", "Teamwork"]],
  ["Systems & tech", ["Python", "Java", "HTML / CSS", "JavaScript", "React", "SQL / MySQL", "Git / GitHub"]],
  ["Office & creative", ["Microsoft Word", "PowerPoint", "Excel", "Canva", "Figma", "Photoshop", "Illustrator"]],
  ["Communication", ["English · TOEIC 810", "Thai · Native", "Cross-cultural teamwork", "Clear communication"]],
];

export const pageMetadata = {
  "/": {
    title: "Phawat Tanajiranon — Portfolio",
    description: "Customer service experience, international work, and a Computer Science foundation.",
  },
  "/about": {
    title: "About — Phawat Tanajiranon",
    description: "Learn about Phawat’s Computer Science studies, international work, and customer service experience.",
  },
  "/experience": {
    title: "Experience — Phawat Tanajiranon",
    description: "Education and customer-facing work experience at Dollywood and in hospitality.",
  },
  "/projects": {
    title: "Projects — Phawat Tanajiranon",
    description: "Personal software projects in chess, streaming tools, and web development.",
  },
  "/skills": {
    title: "Skills — Phawat Tanajiranon",
    description: "Customer service, computer, office, and communication skills.",
  },
  "/contact": {
    title: "Contact — Phawat Tanajiranon",
    description: "Contact Phawat about customer service, hospitality, support, and junior technology roles.",
  },
};
