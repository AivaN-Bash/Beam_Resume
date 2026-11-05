import Page from "../components/Page";

export default function About() {
  return <Page title={<>About<br/><em>me.</em></>} thaiTitle={<>เกี่ยวกับ<br/><span>ฉัน</span></>} index="01">
    <div className="split">
      <div className="section-label">MY STORY</div>
      <div className="content">
        <h2>Technical foundations gave me confidence. <em>Service experience gave me perspective.</em></h2>
        <p>I studied Computer Science at Assumption University for three years and left before completing the degree. My coursework covered programming and problem solving, and it still helps me make sense of new tools.</p>
        <p>During Work & Travel in 2023, I worked at Dollywood in the United States. I helped guests rent scooters, explained safe operation, processed bookings, and kept rental records.</p>
        <p>I have also worked front-of-house at a family restaurant. I learned to keep track of requests, help teammates, and stay friendly when several things needed attention at once.</p>
      </div>
    </div>
    <blockquote className="quote">“Being new to something is not a weakness. It’s a reason to learn faster.”</blockquote>
  </Page>;
}
