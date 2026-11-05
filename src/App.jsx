import { Link, Route, Routes } from "react-router-dom";
import Arrow from "./components/Arrow";
import SiteLayout from "./components/SiteLayout";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Experience from "./pages/Experience";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Skills from "./pages/Skills";

function NotFound() {
  return (
    <section className="not-found" aria-labelledby="not-found-title">
      <p className="eyebrow">404 / PAGE NOT FOUND</p>
      <h1 id="not-found-title">This page isn’t here.</h1>
      <Link className="text-link" to="/">Return to the home page <Arrow /></Link>
    </section>
  );
}

export default function App() {
  return (
    <SiteLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </SiteLayout>
  );
}
