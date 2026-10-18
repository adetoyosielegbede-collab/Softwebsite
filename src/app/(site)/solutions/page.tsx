import type { Metadata } from "next";
import Link from "next/link";
import { EditableImage } from "@/components/editable-image";
import { getSite } from "@/lib/content";

export const metadata: Metadata = { title: "Solutions" };

export default async function SolutionsPage() {
  const { solutions } = await getSite();

  return (
    <>
      <section className="relative overflow-hidden px-6 pt-40 pb-16 md:px-12 md:pt-48">
        <EditableImage media={solutions.image} className="absolute inset-0 opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/78 to-canvas" />
        <div className="relative max-w-4xl">
          <p className="kicker">{solutions.kicker}</p>
          <h1 className="display mt-4 text-[clamp(46px,7vw,92px)]">{solutions.headline}</h1>
          <p className="mt-6 max-w-2xl text-lg text-white/75">{solutions.lede}</p>
          <Link href="/contact" className="mt-8 inline-flex h-11 items-center rounded-full bg-white px-5 text-sm font-medium text-black">
            Start a conversation
          </Link>
        </div>
      </section>

      {solutions.areas.map((area) => (
        <section key={area.id} id={area.id} className="mx-auto max-w-6xl px-6 py-16 md:px-10">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-sm text-accent">{area.number}</p>
              <h2 className="display mt-3 text-4xl md:text-6xl">{area.title}</h2>
            </div>
            <p className="text-lg text-white/70">{area.lede}</p>
          </div>
          <EditableImage media={area.image} className="mt-8 aspect-[16/8] rounded-[2rem]" />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {area.points.map((point) => (
              <article key={point.number} className="rounded-3xl border border-line p-5">
                <p className="text-sm text-accent">{point.number}</p>
                <h3 className="mt-3 text-xl font-light">{point.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/65">{point.body}</p>
              </article>
            ))}
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {area.notes.map((note) => (
              <article key={note.title} className="rounded-3xl bg-white/5 p-6">
                <h3 className="text-lg">{note.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/65">{note.body}</p>
              </article>
            ))}
          </div>
          {area.close ? <p className="mt-6 max-w-3xl text-white/60">{area.close}</p> : null}
          <Link href="/enterprise-products" className="mt-6 inline-flex text-sm text-white/80 underline-offset-4 hover:underline">
            Explore our enterprise products
          </Link>
        </section>
      ))}

      <section className="mx-auto max-w-3xl px-6 py-20 text-center md:px-10">
        <h2 className="display text-4xl md:text-6xl">{solutions.closeTitle}</h2>
        <p className="mt-4 text-white/70">{solutions.closeBody}</p>
        <Link href="/contact" className="mt-8 inline-flex h-11 items-center rounded-full bg-white px-5 text-sm font-medium text-black">
          Start a conversation
        </Link>
      </section>
    </>
  );
}
