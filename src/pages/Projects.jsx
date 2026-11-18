import Arrow from "../components/Arrow";
import CalculatorAppScene from "../components/CalculatorAppScene";
import ChessReplayScene from "../components/ChessReplayScene";
import Page from "../components/Page";
import PortfolioMarqueeScene from "../components/PortfolioMarqueeScene";
import ValAnalystScene from "../components/ValAnalystScene";
import { projects } from "../data/portfolio";

const PROJECT_ART = {
  "Watt Wise": { Scene: CalculatorAppScene, caption: "BILL ESTIMATE / THB", detail: "KEYPAD / MOCKUP" },
  "Simple Chess": { Scene: ChessReplayScene, caption: "JAVA + REACT", detail: "DESKTOP / WEB" },
  "Val Analyst": { Scene: ValAnalystScene, caption: "30 QUESTIONS / 7 DIMENSIONS", detail: "EVIDENCE / LOCAL ONLY" },
  "This Portfolio": { Scene: PortfolioMarqueeScene, caption: "REACT + VITE", detail: "PERSONAL PORTFOLIO" },
};

export default function Projects() {
  return <Page title={<>Things I’ve<br/><em>built.</em></>} thaiTitle={<>สิ่งที่ฉัน<br/><span>สร้างเอง</span></>} index="03">
    <div className="timeline">
      {projects.map((p) => {
        const art = PROJECT_ART[p.title];
        const Scene = art?.Scene;
        return (
          <div className="timeline-item" key={p.title}>
            <div className="time">{p.tag}</div>
            <div className={Scene ? "project-content project-content-featured" : "project-content"}>
              <div className="project-copy">
                <h2>{p.title}</h2>
                <p>{p.desc}</p>
                {(p.demoUrl || p.url) && <div className="project-links">
                  {p.demoUrl && <a className="text-link project-demo-link" href={p.demoUrl} target="_blank" rel="noopener noreferrer">{p.demoAction || "View website"} <Arrow /></a>}
                  {p.url && <a className="text-link project-demo-link" href={p.url} target="_blank" rel="noopener noreferrer">{p.action} <Arrow /></a>}
                </div>}
                <div className="tag-row">{p.stack.map((s) => <span className="skill-pill" key={s}>{s}</span>)}</div>
              </div>
              {Scene && <figure className="project-art-figure">
                <Scene />
                <figcaption><span>{art.caption}</span><span>{art.detail}</span></figcaption>
              </figure>}
            </div>
          </div>
        );
      })}
    </div>
    <div className="callout"><span>ON GITHUB</span><strong>I put the source code for this site and my other projects on GitHub.</strong></div>
    <div className="projects-cta">
      <a className="text-link" href="https://github.com/AivaN-Bash" target="_blank" rel="noopener noreferrer">View GitHub profile <Arrow/></a>
    </div>
  </Page>;
}
