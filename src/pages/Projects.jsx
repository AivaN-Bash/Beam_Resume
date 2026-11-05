import Arrow from "../components/Arrow";
import Page from "../components/Page";
import { projects } from "../data/portfolio";

export default function Projects() {
  return <Page title={<>Things I’ve<br/><em>built.</em></>} thaiTitle={<>สิ่งที่ฉัน<br/><span>สร้างเอง</span></>} index="03">
    <div className="timeline">
      {projects.map((p) => (
        <div className="timeline-item" key={p.title}>
          <div className="time">{p.tag}</div>
          <div>
            <h2>{p.title}</h2>
            <p>{p.desc}</p>
            <div className="tag-row">{p.stack.map((s) => <span className="skill-pill" key={s}>{s}</span>)}</div>
          </div>
        </div>
      ))}
    </div>
    <div className="callout"><span>ON GITHUB</span><strong>Full source for this site, and other personal builds, are on GitHub.</strong></div>
    <div className="projects-cta">
      <a className="text-link" href="https://github.com/AivaN-Bash" target="_blank" rel="noopener noreferrer">View GitHub profile <Arrow/></a>
    </div>
  </Page>;
}
