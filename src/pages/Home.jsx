import { Link } from "react-router-dom";
import Arrow from "../components/Arrow";
import useBilingualToggle from "../components/useBilingualToggle";

export default function Home() {
  const [showThaiName, pauseHandlers] = useBilingualToggle();

  return (
    <div className="page home">
      <section className="hero">
        <div className="eyebrow">PORTFOLIO / {new Date().getFullYear()} <span className="eyebrow-divider">/</span> CUSTOMER SERVICE + TECHNICAL</div>
        <h1 className={`hero-name${showThaiName ? " show-thai" : ""}`} {...pauseHandlers}>
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
          <Link to="/projects" className="index-link"><span>02</span><strong>Projects</strong><small>Things I've built on my own</small><Arrow/></Link>
          <Link to="/skills" className="index-link"><span>03</span><strong>Skills</strong><small>Tools, languages, and working strengths</small><Arrow/></Link>
          <Link to="/contact" className="index-link"><span>04</span><strong>Contact</strong><small>Roles and conversations I am open to</small><Arrow/></Link>
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
