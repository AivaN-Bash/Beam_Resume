import { lazy, Suspense } from "react";
import { Link, Route, Routes } from "react-router-dom";
import Arrow from "./components/Arrow";
import SiteLayout from "./components/SiteLayout";

const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Experience = lazy(() => import("./pages/Experience"));
const Home = lazy(() => import("./pages/Home"));
const Projects = lazy(() => import("./pages/Projects"));
const Skills = lazy(() => import("./pages/Skills"));

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
      <Suspense fallback={<div className="route-loading" role="status">Loading page…</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </SiteLayout>
  );
}
