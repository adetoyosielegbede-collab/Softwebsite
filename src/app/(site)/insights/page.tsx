import type { Metadata } from "next";
import Link from "next/link";
import { EditableImage } from "@/components/editable-image";
import { getSite } from "@/lib/content";

export const metadata: Metadata = { title: "Insights" };

export default async function InsightsPage() {
  const { insights } = await getSite();
  const [featured, ...rest] = insights.items;

  return (
    <section className="px-6 pt-40 pb-20 md:px-12 md:pt-48">
      <p className="kicker">{insights.kicker}</p>
      <h1 className="display mt-4 max-w-4xl text-[clamp(46px,7vw,90px)]">{insights.headline}</h1>
      <p className="mt-6 max-w-2xl text-lg text-white/70">{insights.lede}</p>

      {featured ? (
        <Link href={`/insights/${featured.slug}`} className="mt-12 grid overflow-hidden rounded-[2rem] bg-white/5 ring-1 ring-white/10 md:grid-cols-2">
          <EditableImage media={featured.image} className="min-h-72" />
          <div className="p-6 md:p-10">
            <p className="text-sm text-accent">Featured · {featured.category}</p>
            <p className="mt-2 text-sm text-white/45">{featured.date}</p>
            <h2 className="display mt-4 text-3xl md:text-5xl">{featured.title}</h2>
            <p className="mt-4 text-white/65">{featured.excerpt}</p>
          </div>
        </Link>
      ) : (
        <p className="mt-12 text-white/60">No insights yet. Add one in the studio.</p>
      )}

      {rest.length > 0 ? (
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {rest.map((item) => (
            <Link key={item.slug} href={`/insights/${item.slug}`} className="overflow-hidden rounded-[1.6rem] bg-white/5 ring-1 ring-white/10">
              <EditableImage media={item.image} className="aspect-[16/9]" />
              <div className="p-5">
                <p className="text-sm text-accent">
                  {item.category} · {item.date}
                </p>
                <h2 className="mt-2 text-2xl font-light">{item.title}</h2>
                <p className="mt-2 text-sm text-white/60">{item.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : null}
    </section>
  );
}
