import Page from "../components/Page";
import { skillGroups } from "../data/portfolio";

export default function Skills() {
  return <Page title={<>Skills<br/><em>& toolkit.</em></>} thaiTitle={<>ทักษะ<br/><span>และเครื่องมือ</span></>} index="04">
    <div className="skill-list">
      {skillGroups.map(([name, skills], i) => (
        <section className="skill-row" key={name}>
          <span>0{i+1}</span>
          <h2>{name}</h2>
          <div>{skills.map(s => <span className="skill-pill" key={s}>{s}</span>)}</div>
        </section>
      ))}
    </div>
    <div className="skills-note"><strong>How I work</strong><p>At Dollywood, I handled bookings and kept rental records. My Computer Science coursework helps me understand the systems behind that work.</p></div>
  </Page>;
}
