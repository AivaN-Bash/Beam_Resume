import BilingualTitle from "./BilingualTitle";

export default function Page({ title, thaiTitle, index, children }) {
  return <div className={`page inner-page page-${index}`}>
    <section className="page-heading">
      <div className="eyebrow">{index} / PHAWAT TANAJIRANON</div>
      <BilingualTitle english={title} thai={thaiTitle} />
    </section>
    {children}
  </div>;
}
