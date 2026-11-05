import Arrow from "../components/Arrow";
import Page from "../components/Page";

export default function Contact() {
  return <Page title={<>Let’s make<br/><em>contact.</em></>} thaiTitle={<>ติดต่อ<br/><span>ฉัน</span></>} index="05">
    <div className="contact-grid">
      <div>
        <p className="large-copy">I am looking for work in customer service, hospitality, support, or junior tech. I have U.S. work experience, a TOEIC score of 810, and three years of Computer Science study at ABAC.</p>
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
        <p>Customer service, hospitality, support, or junior tech roles</p>
      </div>
    </div>
    <div className="placeholder-note">Have a role in mind? Send me a message. I am happy to tell you more about my experience.</div>
  </Page>;
}
