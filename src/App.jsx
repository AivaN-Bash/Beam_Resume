import React, { useEffect, useState } from "react";
import { Link, NavLink, Route, Routes, useLocation } from "react-router-dom";

const nav = [
  ["About", "/about"],
  ["Experience", "/experience"],
  ["Skills", "/skills"],
  ["Contact", "/contact"],
];

function Layout({ children }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="nav">
        <Link className="brand" to="/">
          <span>PT</span>
          <strong>PHAWAT<br/>TANAJIRANON</strong>
        </Link>
        <nav className="desktop-nav">
          {nav.map(([label, path]) => (
            <NavLink key={path} to={path} className={({isActive}) => isActive ? "active" : ""}>
              {label}
            </NavLink>
          ))}
        </nav>
        <button
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
        <Link className="nav-cta" to="/contact">Let’s talk ↗</Link>
        <nav id="mobile-navigation" className={`mobile-nav${menuOpen ? " is-open" : ""}`} aria-hidden={!menuOpen}>
          {nav.map(([label, path]) => (
            <NavLink key={path} to={path} className={({isActive}) => isActive ? "active" : ""} tabIndex={menuOpen ? 0 : -1}>
              <span>0{nav.findIndex(([, navPath]) => navPath === path) + 1}</span>{label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main id="main-content">{children}</main>
      <footer className="footer">
        <span>© {new Date().getFullYear()} Phawat Tanajiranon</span>
        <span>Customer service · Computer Science · Thailand</span>
      </footer>
    </div>
  );
}

function Arrow() { return <span className="arrow">↗</span>; }

function BilingualTitle({ english, thai }) {
  const [showThai, setShowThai] = useState(false);

  useEffect(() => {
    const titleTimer = window.setInterval(() => {
      setShowThai((showThaiTitle) => !showThaiTitle);
    }, 5000);

    return () => window.clearInterval(titleTimer);
  }, []);

  return (
    <h1 className={`page-title-switch${showThai ? " show-thai" : ""}`} aria-live="polite">
      <span className="page-title-option page-title-english" aria-hidden={showThai}>{english}</span>
      <span className="page-title-option page-title-thai" aria-hidden={!showThai}>{thai}</span>
    </h1>
  );
}

function Home() {
  const [showThaiName, setShowThaiName] = useState(false);

  useEffect(() => {
    const nameTimer = window.setInterval(() => {
      setShowThaiName((showThai) => !showThai);
    }, 5000);

    return () => window.clearInterval(nameTimer);
  }, []);

  return (
    <div className="page home">
      <section className="hero">
        <div className="eyebrow">PORTFOLIO / 2026 <span className="eyebrow-divider">/</span> CUSTOMER SERVICE + TECHNICAL</div>
        <h1 className={`hero-name${showThaiName ? " show-thai" : ""}`} aria-live="polite">
          <span className="name-option name-option-english" aria-hidden={showThaiName}>PHAWAT<br/><em>TANAJIRANON</em></span>
          <span className="name-option name-option-thai" aria-hidden={!showThaiName}>ภวัต<br/><span>ธนาจิรานนท์</span></span>
        </h1>
        <div className="hero-bottom">
          <p className="hero-lead">Customer service experience.<br/>A Computer Science foundation.<br/>Ready to learn and contribute.</p>
          <div className="hero-note">
            <span>01</span>
            <p>Customer service experience, Computer Science study, and TOEIC 810. I bring calm communication, practical problem solving, and an adaptable approach to every new team.</p>
          </div>
        </div>
      </section>

      <section className="statement section">
        <div className="section-label">01 / PROFILE</div>
        <div>
          <h2>Customer service experience with a <em>technical mindset.</em></h2>
          <p className="large-copy">I combine face-to-face service experience with a Computer Science foundation. I learn systems quickly, communicate clearly in English, and stay dependable when work gets busy. My international experience taught me how to adapt to new teams, customers, and routines.</p>
          <Link className="text-link" to="/about">Read my story <Arrow/></Link>
        </div>
      </section>

      <section className="fit-strip section">
        <div className="section-label">02 / EVIDENCE</div>
        <div className="fact-grid">
          <div className="fact"><strong>TOEIC 810</strong><span>English · CEFR B2</span></div>
          <div className="fact"><strong>DOLLYWOOD · USA</strong><span>Rental and retail service</span></div>
          <div className="fact"><strong>COMPUTER SCIENCE</strong><span>Three years at ABAC</span></div>
        </div>
      </section>

      <section className="index-section section">
        <div className="section-label">03 / INDEX</div>
        <div className="index-list">
          <Link to="/experience" className="index-link"><span>01</span><strong>Experience</strong><small>Work, study, and what I learned</small><Arrow/></Link>
          <Link to="/skills" className="index-link"><span>02</span><strong>Skills</strong><small>Tools, languages, and working strengths</small><Arrow/></Link>
          <Link to="/contact" className="index-link"><span>03</span><strong>Contact</strong><small>Roles and conversations I am open to</small><Arrow/></Link>
        </div>
      </section>

      <section className="closing section">
        <p>OPEN TO THE NEXT GOOD FIT</p>
        <h2>LET’S TALK ABOUT<br/><em>THE WORK.</em></h2>
        <Link className="button" to="/contact">Get in touch <Arrow/></Link>
      </section>
    </div>
  );
}

function About() {
  return <Page title={<>About<br/><em>me.</em></>} thaiTitle={<>เกี่ยวกับ<br/><span>ฉัน</span></>} index="01">
    <div className="split">
      <div className="section-label">MY STORY</div>
      <div className="content">
        <h2>Technical foundations gave me confidence. <em>Service experience gave me perspective.</em></h2>
        <p>I studied Computer Science at Assumption University for three years, building a foundation in programming, problem solving, and practical technology. I chose to leave before completing the degree, but the experience continues to shape how I learn and work.</p>
        <p>Through Work & Travel, I worked at Dollywood in the United States from March to June 2023. I helped customers with scooter rentals, explained safe operation, processed bookings, maintained records, and communicated in English every day.</p>
        <p>I have also supported front-of-house service as a waiter. Across both environments, I learned to listen carefully, stay organized, solve small problems quickly, and keep a friendly attitude when the pace picks up.</p>
      </div>
    </div>
    <div className="quote">“Being new to something is not a weakness. It’s a reason to learn faster.”</div>
  </Page>;
}

function Experience() {
  return <Page title={<>Experience<br/><em>in motion.</em></>} thaiTitle={<>ประสบการณ์<br/><span>การทำงาน</span></>} index="02">
    <div className="timeline">
      <div className="timeline-item">
        <div className="time">2021 — 2023<br/><small>ABAC · BANGNA</small></div>
        <div><h2>Computer Science</h2><p>Completed three years of university study at Assumption University. Coursework included programming fundamentals, computing, and problem solving.</p><span className="tag">EDUCATION</span></div>
      </div>
      <div className="timeline-item">
        <div className="time">MAR — JUN 2023<br/><small>USA</small></div>
        <div><h2>Dollywood Rental & Retail</h2><p>Assisted customers with scooter rentals, explained safe operation, processed computer-based bookings, maintained documentation, supported locker issues, and prepared equipment for the next day.</p><span className="tag">WORK & TRAVEL</span></div>
      </div>
      <div className="timeline-item">
        <div className="time">PART-TIME<br/><small>1 MONTH</small></div>
        <div><h2>Family Restaurant</h2><p>Supported front-of-house service as a waiter and helped maintain a friendly, organized, customer-focused environment.</p><span className="tag">HOSPITALITY</span></div>
      </div>
    </div>
    <div className="callout"><span>THE TAKEAWAY</span><strong>I bring real customer-facing practice, clear English communication, and the technical confidence to learn a new system quickly.</strong></div>
  </Page>;
}

const skillGroups = [
  ["Customer service", ["Face-to-face support", "Rental bookings", "Documentation", "Teamwork"]],
  ["Systems & tech", ["Python", "Java", "HTML / CSS", "JavaScript", "React", "SQL / MySQL", "Git / GitHub"]],
  ["Office & creative", ["Microsoft Word", "PowerPoint", "Excel", "Canva", "Figma", "Photoshop", "Illustrator"]],
  ["Communication", ["English · TOEIC 810", "Thai · Native", "Cross-cultural teamwork", "Clear communication"]],
];

function Skills() {
  return <Page title={<>Skills<br/><em>& toolkit.</em></>} thaiTitle={<>ทักษะ<br/><span>และเครื่องมือ</span></>} index="03">
    <div className="skill-list">
      {skillGroups.map(([name, skills], i) => (
        <section className="skill-row" key={name}>
          <span>0{i+1}</span>
          <h2>{name}</h2>
          <div>{skills.map(s => <span className="skill-pill" key={s}>{s}</span>)}</div>
        </section>
      ))}
    </div>
    <div className="skills-note"><strong>How I work</strong><p>I’m comfortable learning new tools when the job requires them. My strongest advantage is combining customer awareness, a technical foundation, and the adaptability to contribute in a new environment.</p></div>
  </Page>;
}

function Contact() {
  return <Page title={<>Let’s make<br/><em>contact.</em></>} thaiTitle={<>ติดต่อ<br/><span>ฉัน</span></>} index="04">
    <div className="contact-grid">
      <div>
        <p className="large-copy">I’m open to customer service, hospitality, support, and technology-focused opportunities. I bring English communication, international work experience, computer skills, and a genuine willingness to learn.</p>
        <div className="contact-actions">
          <a className="button" href="mailto:beamstary@gmail.com">Email me <Arrow/></a>
          <a className="text-link" href="tel:0864736645">086 473 6645 <Arrow/></a>
        </div>
      </div>
      <div className="contact-details">
        <span>EMAIL</span>
        <p>beamstary@gmail.com</p>
        <span>LOCATION</span>
        <p>Bang Bo, Samut Prakan, Thailand</p>
        <span>OPEN TO</span>
        <p>Customer service · Hospitality · Support · Junior tech roles</p>
      </div>
    </div>
    <div className="placeholder-note">Available for conversations about roles where service, communication, and practical computer skills matter.</div>
  </Page>;
}

function Page({ title, thaiTitle, index, children }) {
  return <div className={`page inner-page page-${index}`}>
    <section className="page-heading">
      <div className="eyebrow">{index} / PHAWAT TANAJIRANON</div>
      <BilingualTitle english={title} thai={thaiTitle} />
    </section>
    {children}
  </div>;
}

export default function App() {
  return <Layout><Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/about" element={<About/>}/>
    <Route path="/experience" element={<Experience/>}/>
    <Route path="/skills" element={<Skills/>}/>
    <Route path="/contact" element={<Contact/>}/>
    <Route path="*" element={<Home/>}/>
  </Routes></Layout>;
}