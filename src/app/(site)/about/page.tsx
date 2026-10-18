import type { Metadata } from "next";
import Link from "next/link";
import { EditableImage } from "@/components/editable-image";
import { getSite } from "@/lib/content";

export const metadata: Metadata = { title: "About" };

export default async function AboutPage() {
  const site = await getSite();
  const about = site.about;

  return (
    <>
      <section className="relative overflow-hidden px-6 pt-40 pb-20 md:px-12 md:pt-48">
        <EditableImage media={about.image} className="absolute inset-0 opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/75 to-canvas" />
        <div className="relative max-w-4xl">
          <p className="kicker">{about.kicker}</p>
          <h1 className="display mt-4 text-[clamp(48px,8vw,96px)]">{about.headline}</h1>
          <p className="mt-6 max-w-2xl text-lg text-white/75">{about.lede}</p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16 md:px-10">
        <h2 className="display text-4xl md:text-6xl">{about.convictionTitle}</h2>
        <div className="mt-8 space-y-5 text-lg leading-8 text-white/75">
          {about.conviction.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-10 md:px-10">
        <h2 className="display text-4xl">{about.milestonesTitle}</h2>
        <ol className="mt-10 space-y-8 border-l border-line pl-6">
          {about.milestones.map((item) => (
            <li key={item.year}>
              <p className="text-sm text-accent">{item.year}</p>
              <h3 className="mt-1 text-2xl font-light">{item.title}</h3>
              <p className="mt-2 max-w-3xl text-white/65">{item.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 py-16 md:grid-cols-2 md:px-10">
        <h2 className="display text-4xl md:text-5xl">{about.principlesTitle}</h2>
        <div className="grid gap-4">
          {about.principles.map((item) => (
            <article key={item.number} className="rounded-3xl border border-line p-5">
              <p className="text-sm text-accent">{item.number}</p>
              <h3 className="mt-2 text-2xl font-light">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/65">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="team" className="mx-auto max-w-6xl px-6 py-10 md:px-10">
        <h2 className="display text-4xl md:text-6xl">{about.leadershipTitle}</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {about.leaders.map((leader) => (
            <article key={leader.name}>
              <EditableImage media={leader.image} className="aspect-[3/4] rounded-[1.6rem] bg-neutral-900" imgClassName="object-top" />
              <h3 className="mt-4 text-2xl font-light">{leader.name}</h3>
              <p className="text-sm text-white/55">{leader.role}</p>
            </article>
          ))}
        </div>
        <dl className="mt-16 grid grid-cols-2 gap-8 border-t border-line pt-10 md:grid-cols-4">
          {site.stats.map((stat) => (
            <div key={stat.label}>
              <dt className="display text-4xl md:text-5xl">{stat.value}</dt>
              <dd className="mt-2 text-sm text-white/55">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20 md:px-10">
        <h2 className="display text-4xl md:text-6xl">{about.careersTitle}</h2>
        <p className="mt-5 text-lg text-white/70">{about.careersBody}</p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/careers" className="inline-flex h-11 items-center rounded-full bg-white px-5 text-sm font-medium text-black">
            {about.careersCta}
          </Link>
          <Link href="/alumni" className="inline-flex h-11 items-center text-sm text-white/80">
            {about.alumniCta}
          </Link>
        </div>
      </section>
    </>
  );
}
