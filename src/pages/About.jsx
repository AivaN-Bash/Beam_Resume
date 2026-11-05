import Page from "../components/Page";

export default function About() {
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
