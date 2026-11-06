import { useState } from "react";
import { Link } from "react-router-dom";
import Arrow from "../components/Arrow";
import AsciiPortrait from "../components/AsciiPortrait";
import HarbourSkylineScene from "../components/HarbourSkylineScene";
import ViaductTrainScene from "../components/ViaductTrainScene";
import useBilingualToggle from "../components/useBilingualToggle";

const marqueeItems = [
  "Customer service",
  "Computer Science",
  "U.S. work experience",
  "TOEIC 810",
  "English + Thai",
  "Ready to learn",
  "Guest support",
  "Problem solving",
];

export default function Home() {
  const [showThaiName, pauseHandlers] = useBilingualToggle();
  const [portraitFailed, setPortraitFailed] = useState(false);
  const portraitSrc = `${import.meta.env.BASE_URL}images/phawat-cutout.png`;

  return (
    <div className="page home">
      <section className="hero">
        <HarbourSkylineScene />
        <div className="hero-topline">
          <div className="eyebrow">PORTFOLIO / {new Date().getFullYear()}</div>
          <span className="hero-status"><i aria-hidden="true" /> AVAILABLE FOR WORK</span>
        </div>

        <div className="hero-layout">
          <div className="hero-copy">
            <p className="hero-greeting">CUSTOMER SERVICE / COMPUTER SCIENCE</p>
            <h1 className={`hero-name${showThaiName ? " show-thai" : ""}`} {...pauseHandlers}>
              <span className="name-option name-option-english" aria-hidden={showThaiName}>PHAWAT<br/><em>TANAJIRANON</em></span>
              <span className="name-option name-option-thai" lang="th" aria-hidden={!showThaiName}>ภวัต<br/><span>ธนาจิรานนท์</span></span>
            </h1>
            <div className="hero-intro">
              <p className="hero-lead">Customer service experience.<br/>A Computer Science foundation.</p>
              <div className="hero-note">
                <span>01</span>
                <p>TOEIC 810 · U.S. work experience · English and Thai.</p>
              </div>
            </div>
            <div className="hero-actions">
              <Link className="button" to="/contact">Let’s talk <Arrow /></Link>
              <Link className="text-link" to="/projects">Explore my work <Arrow /></Link>
              <AsciiPortrait className="hero-ascii" />
            </div>
          </div>

          <figure className={`hero-portrait${portraitFailed ? " portrait-unavailable" : ""}`}>
            {!portraitFailed && (
              <img
                src={portraitSrc}
                alt="Phawat in graduation attire"
                width="512"
                height="512"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                onError={() => setPortraitFailed(true)}
              />
            )}
            {portraitFailed && <div className="portrait-placeholder" aria-hidden="true">PT</div>}
            <figcaption><span>PORTRAIT</span><span>THAILAND</span></figcaption>
          </figure>
        </div>
      </section>

      <div className="home-marquee" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((group) => (
            <div className="marquee-group" key={group}>
              {marqueeItems.map((item) => (
                <span className="marquee-item" key={item}>
                  <i className="marquee-mark" />
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <section className="statement section">
        <div className="section-label">01 / PROFILE</div>
        <div className="statement-layout">
          <div className="statement-copy">
            <h2>Customer service experience with a <em>technical mindset.</em></h2>
            <p className="large-copy">I have worked with customers in the United States and Thailand, and studied Computer Science at ABAC. I am comfortable explaining a process, keeping track of details, and learning the software behind the work.</p>
            <Link className="text-link" to="/about">Read my story <Arrow/></Link>
          </div>
          <figure className="statement-art">
            <ViaductTrainScene />
            <figcaption><span>VIADUCT STUDY / 01</span><span>STEAM · STONE</span></figcaption>
          </figure>
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
          <Link to="/experience" className="index-link"><span>01</span><strong>Experience</strong><small>Dollywood, hospitality, and university</small><Arrow/></Link>
          <Link to="/projects" className="index-link"><span>02</span><strong>Projects</strong><small>Chess, streaming tools, and this site</small><Arrow/></Link>
          <Link to="/skills" className="index-link"><span>03</span><strong>Skills</strong><small>Software, office tools, and languages</small><Arrow/></Link>
          <Link to="/contact" className="index-link"><span>04</span><strong>Contact</strong><small>Customer service, support, or junior tech</small><Arrow/></Link>
        </div>
      </section>

      <section className="closing section">
        <p>CURRENTLY LOOKING FOR</p>
        <h2>CUSTOMER SERVICE,<br/><em>SUPPORT OR JUNIOR TECH.</em></h2>
        <Link className="button" to="/contact">Get in touch <Arrow/></Link>
      </section>
    </div>
  );
}
