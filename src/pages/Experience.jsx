import Page from "../components/Page";

export default function Experience() {
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
