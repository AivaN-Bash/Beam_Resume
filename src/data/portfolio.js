export const nav = [
  ["About", "/about"],
  ["Experience", "/experience"],
  ["Projects", "/projects"],
  ["Skills", "/skills"],
  ["Contact", "/contact"],
];

export const projects = [
  {
    title: "Hotel Self Check-in",
    tag: "LIVE WEB APP",
    desc: "A bilingual, touch-friendly hotel kiosk for guests to check in, receive a room assignment and demo QR key, or check out an active stay. The React frontend connects to a Spring Boot API and PostgreSQL database; identity checks, deposits, and QR keys are simulations.",
    stack: ["English and Thai kiosk", "React + Spring Boot", "PostgreSQL", "Check-in and check-out"],
    url: "https://frontend-nine-kohl-nzqk24mi4s.vercel.app/",
    action: "Try the hotel kiosk",
    demoUrl: "https://github.com/AivaN-Bash/Hotel_Checkin",
    demoAction: "View source on GitHub",
  },
  {
    title: "Watt Wise",
    tag: "LIVE WEB APP",
    desc: "Estimate a home electricity bill by choosing common appliances and how long you use them. The site also lets you preview the calculator on phone, tablet, and desktop screen sizes.",
    stack: ["Electricity bill calculator", "Appliance estimates", "Phone and desktop previews"],
    url: "https://aivan-bash.github.io/Watt-Wise/",
    action: "Try the calculator and mockup tester",
  },
  {
    title: "Simple Chess",
    tag: "DESKTOP + WEB",
    desc: "Play chess against a friend or the computer in either a Windows desktop app or a browser version. Both versions handle standard chess rules, show available moves, and detect checkmate; the browser game also lets you drag or click pieces to move them.",
    stack: ["Windows and browser versions", "Play with a friend or computer", "Full chess rules"],
    url: "https://github.com/AivaN-Bash/simple_chess_java",
    action: "View source on GitHub",
    demoUrl: "https://aivan-bash.github.io/simple_chess_java/",
    demoAction: "View website version",
  },
  {
    title: "Val Analyst",
    tag: "LIVE WEB APP",
    desc: "An evidence-first VALORANT player analyzer that runs entirely in your browser. Enter a recent match sample and answer 30 tactical questions to review seven performance dimensions, behavioral tendencies, and their supporting evidence. Formulas, sample limits, and missing data stay visible; analysis snapshots are saved only in this browser. Includes a VCT Reference link for professional match research.",
    stack: ["30 tactical questions", "7 performance dimensions", "Browser-only analysis", "VCT research reference"],
    url: "https://aivan-bash.github.io/Val_-Analyst/",
    action: "View web app",
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

export const contactInfo = {
  email: "beamstary@gmail.com",
  phoneHref: "tel:+66864736645",
  phoneDisplay: "086 473 6645",
  location: "Bang Bo, Samut Prakan, Thailand",
  openTo: "Customer service, hospitality, support, or junior tech roles",
  githubUrl: "https://github.com/AivaN-Bash",
};

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
    description: "Personal software projects including a bilingual hotel self check-in kiosk, electricity cost estimation, Java chess, and VALORANT analysis.",
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
