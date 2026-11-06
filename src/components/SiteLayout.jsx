import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Arrow from "./Arrow";
import BackToTop from "./BackToTop";
import PuppyMascot from "./PuppyMascot";
import { nav, pageMetadata } from "../data/portfolio";

export default function SiteLayout({ children }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setMenuOpen(false);
    document.getElementById("main-content")?.focus({ preventScroll: true });
  }, [location.pathname]);

  useEffect(() => {
    const metadata = pageMetadata[location.pathname] ?? {
      title: "Page not found — Phawat Tanajiranon",
      description: "The requested portfolio page could not be found.",
    };
    const currentUrl = new URL(window.location.href);
    currentUrl.search = "";
    currentUrl.hash = "";

    document.title = metadata.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", metadata.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", metadata.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", metadata.description);
    document.querySelector('meta[property="og:url"]')?.setAttribute("content", currentUrl.href);
    document.querySelector('meta[name="twitter:title"]')?.setAttribute("content", metadata.title);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute("content", metadata.description);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", currentUrl.href);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  return (
    <div className="site-shell">
      <BackToTop />
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="nav">
        <Link className="brand" to="/">
          <span className="brand-mark" aria-hidden="true">
            <img src={`${import.meta.env.BASE_URL}pt-mark.svg`} alt="" width="36" height="36" />
          </span>
          <strong>PHAWAT<br/>TANAJIRANON</strong>
          <PuppyMascot />
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {nav.map(([label, path]) => (
            <NavLink key={path} to={path} end data-label={label} className={({ isActive }) => isActive ? "active" : ""}>
              <span className="nav-link-label">{label}</span>
            </NavLink>
          ))}
        </nav>
        <button
          ref={menuButtonRef}
          className={`menu-toggle${menuOpen ? " is-open" : ""}`}
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
        <Link className="nav-cta" to="/contact">
          <span className="nav-cta-label">Let’s talk</span>
          <svg className="nav-cta-orbit" viewBox="0 0 120 46" preserveAspectRatio="none" aria-hidden="true" focusable="false">
            <defs>
              <linearGradient id="nav-cta-orbit-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop className="nav-cta-orbit-stop-caramel" offset="0%" />
                <stop className="nav-cta-orbit-stop-sand" offset="52%" />
                <stop className="nav-cta-orbit-stop-copper" offset="100%" />
              </linearGradient>
            </defs>
            <rect className="nav-cta-orbit-track" x="1" y="1" width="118" height="44" rx="22" pathLength="100" />
            <rect className="nav-cta-orbit-light" x="1" y="1" width="118" height="44" rx="22" pathLength="100" />
          </svg>
          <Arrow />
        </Link>
        <nav id="mobile-navigation" className={`mobile-nav${menuOpen ? " is-open" : ""}`} aria-label="Mobile navigation" aria-hidden={!menuOpen}>
          {nav.map(([label, path], index) => (
            <NavLink key={path} to={path} end className={({ isActive }) => isActive ? "active" : ""} tabIndex={menuOpen ? 0 : -1}>
              <span className="mobile-nav-index">0{index + 1}</span><span className="mobile-nav-label">{label}</span><Arrow />
            </NavLink>
          ))}
        </nav>
      </header>
      <main id="main-content" tabIndex={-1}>{children}</main>
      <footer className="footer">
        <span>© {new Date().getFullYear()} Phawat Tanajiranon</span>
        <span>Customer service · Computer Science · Thailand</span>
      </footer>
    </div>
  );
}
