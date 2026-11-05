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
    desc: "A two-player chess engine in C++ and SFML. It generates legal moves, uses perft checks, animates pieces, and can flip the board for local play.",
    stack: ["C++", "SFML", "Perft testing"],
  },
  {
    title: "TipBeam",
    tag: "PERSONAL PROJECT",
    desc: "A tipping page for Thai streamers that creates PromptPay QR codes and sends donation alerts to a browser overlay in OBS.",
    stack: ["TypeScript", "PromptPay API", "OBS overlay"],
  },
  {
    title: "This Portfolio",
    tag: "PERSONAL PROJECT",
    desc: "The site you are viewing: a React portfolio built with Vite, with separate pages for my experience, projects, skills, and contact details.",
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
