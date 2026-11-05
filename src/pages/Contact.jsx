import Arrow from "../components/Arrow";
import Page from "../components/Page";

export default function Contact() {
  return <Page title={<>Let’s make<br/><em>contact.</em></>} thaiTitle={<>ติดต่อ<br/><span>ฉัน</span></>} index="05">
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
