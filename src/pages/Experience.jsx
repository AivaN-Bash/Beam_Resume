import Page from "../components/Page";

export default function Experience() {
  return <Page title={<>Experience<br/><em>in motion.</em></>} thaiTitle={<>ประสบการณ์<br/><span>การทำงาน</span></>} index="02">
    <div className="timeline">
      <div className="timeline-item">
        <div className="time">2021 — 2023<br/><small>ABAC · BANGNA</small></div>
        <div><h2>Computer Science</h2><p>Studied at Assumption University for three years. Coursework included programming fundamentals and problem solving.</p><span className="tag">EDUCATION</span></div>
      </div>
      <div className="timeline-item">
        <div className="time">MAR — JUN 2023<br/><small>USA</small></div>
        <div><h2>Dollywood Rental & Retail</h2><p>Helped guests rent scooters, explained how to use them safely, entered bookings, kept records, and prepared equipment for the next day.</p><span className="tag">WORK & TRAVEL</span></div>
      </div>
      <div className="timeline-item">
        <div className="time">PART-TIME<br/><small>1 MONTH</small></div>
        <div><h2>Family Restaurant</h2><p>Worked as a waiter, taking orders and helping keep service moving during busy periods.</p><span className="tag">HOSPITALITY</span></div>
      </div>
    </div>
    <div className="callout"><span>THE TAKEAWAY</span><strong>At Dollywood I handled rentals and bookings. I am looking for a role where I can keep working with people and build on my technical skills.</strong></div>
  </Page>;
}
