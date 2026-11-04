import "@/components/site/sentinel-page.css";

const ITEMS = [
  {
    n: "01",
    title: "Transaction review",
    text: "Examine activity across the records in the case.",
    link: "↓ A flagged row starts a route",
  },
  {
    n: "02",
    title: "Fund flow",
    text: "Follow transfers across accounts and counterparties.",
    link: "↓ The route is recorded as a lead",
  },
  {
    n: "03",
    title: "Case record",
    text: "Keep each lead tied to its source transactions.",
    link: "↑ Each lead links back to its rows",
    ok: true,
  },
] as const;

/** Mobile “three things” strip — desktop uses the hero diagram instead. */
export function SentinelEnables() {
  return (
    <section className="sentinel-enables" aria-label="What Sentinel enables">
      <div className="container-site py-16">
        <p className="label text-ink-faint">Sentinel</p>
        <p className="se-title">Three things Sentinel enables</p>
        <div className="se-grid">
          {ITEMS.map((item) => (
            <div key={item.n} className="se-item">
              <span className="se-n">{item.n}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <p className={item.ok ? "se-link ok" : "se-link"}>{item.link}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
