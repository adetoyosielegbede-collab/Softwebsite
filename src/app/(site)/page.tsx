import Link from "next/link";
import { EditableImage } from "@/components/editable-image";
import { HeroMark } from "@/components/hero-mark";
import { PartnerMarquee } from "@/components/partners";
import { getSite } from "@/lib/content";

export default async function HomePage() {
  const site = await getSite();
  const home = site.home;
  const featured = site.insights.items[0];

  return (
    <>
      <section className="relative h-[100svh] min-h-[680px] overflow-hidden bg-black">
        <EditableImage media={home.heroImage} className="absolute inset-0" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black" />
        <HeroMark />
        <div className="absolute inset-x-0 bottom-0 px-6 pb-16 md:px-12 md:pb-20">
          <h1 className="display max-w-5xl text-[clamp(42px,6.4vw,88px)]">
            {home.headline.split("\n").map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-24 md:px-10 lg:grid-cols-[1.3fr_0.7fr]">
        <div>
          <p className="kicker">Our story</p>
          <p className="display mt-6 text-[clamp(28px,3.4vw,48px)] leading-[1.2]">{home.story}</p>
        </div>
        <div className="flex flex-col justify-end gap-6">
          <p className="text-lg text-white/75">{home.subhead}</p>
          <p className="text-white/60">{home.support}</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href={home.primaryHref} className="inline-flex h-11 items-center rounded-full bg-white px-5 text-sm font-medium text-black">
              {home.primaryCta}
            </Link>
            <Link href={home.secondaryHref} className="text-sm text-white/80 underline-offset-4 hover:underline">
              {home.secondaryCta}
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 pb-8 md:px-6">
        <div className="mb-8 px-2 md:px-6">
          <h2 className="display text-4xl md:text-6xl">{home.focusTitle}</h2>
          <p className="mt-4 max-w-2xl text-white/65">{home.focusIntro}</p>
        </div>
        <div className="grid gap-4">
          {home.focus.map((item) => (
            <article key={item.title} className="group relative min-h-[78vh] overflow-hidden rounded-[2rem]">
              <EditableImage
                media={item.image}
                className="absolute inset-0"
                imgClassName="transition duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/15" />
              <div className="relative flex min-h-[78vh] flex-col justify-end p-6 md:p-12">
                <p className="text-sm text-accent">{item.number}</p>
                <h3 className="display mt-3 max-w-3xl text-4xl md:text-6xl">{item.title}</h3>
                <p className="mt-4 max-w-2xl text-white/80">{item.body}</p>
                <p className="mt-3 max-w-2xl text-white/60">{item.more}</p>
                <Link href={item.href} className="mt-6 text-sm font-medium text-white">
                  {item.link} →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24 md:px-10">
        <h2 className="display max-w-3xl text-4xl md:text-6xl">{home.audienceTitle}</h2>
        <p className="mt-4 max-w-2xl text-white/65">{home.audienceIntro}</p>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {home.audiences.map((audience) => (
            <article key={audience.title} className="overflow-hidden rounded-[1.6rem] bg-white/5 ring-1 ring-white/10">
              <EditableImage media={audience.image} className="aspect-[4/3]" />
              <div className="p-6">
                <h3 className="display text-3xl">{audience.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/65">{audience.body}</p>
                <ul className="mt-5 space-y-2 text-sm text-white/80">
                  {audience.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
        <dl className="mt-16 grid grid-cols-2 gap-8 border-t border-line pt-10 md:grid-cols-4">
          {site.stats.map((stat) => (
            <div key={stat.label}>
              <dt className="display text-4xl md:text-6xl">{stat.value}</dt>
              <dd className="mt-2 text-sm text-white/55">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-8 md:px-10">
        <h2 className="display text-4xl md:text-6xl">{home.workTitle}</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {home.work.map((step) => (
            <article key={step.number} className="rounded-[1.6rem] border border-line p-6">
              <p className="text-sm text-accent">{step.number}</p>
              <p className="mt-6 text-sm text-white/45">{step.kicker}</p>
              <h3 className="display mt-2 text-3xl">{step.title}</h3>
              <p className="mt-4 text-sm leading-6 text-white/65">{step.body}</p>
            </article>
          ))}
        </div>
        <Link href={home.workHref} className="mt-8 inline-flex text-sm text-white/80 underline-offset-4 hover:underline">
          {home.workCta}
        </Link>
      </section>

      <PartnerMarquee partners={site.partners} />

      {featured ? (
        <section className="mx-auto max-w-6xl px-6 pb-24 md:px-10">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="display text-4xl md:text-5xl">{home.insightTitle}</h2>
            <Link href="/insights" className="text-sm text-white/70">
              {home.insightLink}
            </Link>
          </div>
          <Link href={`/insights/${featured.slug}`} className="grid overflow-hidden rounded-[2rem] bg-white/5 ring-1 ring-white/10 md:grid-cols-2">
            <EditableImage media={featured.image} className="min-h-72" />
            <div className="flex flex-col justify-end p-6 md:p-10">
              <p className="text-sm text-accent">
                {featured.category} · {featured.date}
              </p>
              <h3 className="display mt-4 text-3xl md:text-5xl">{featured.title}</h3>
              <p className="mt-4 text-white/65">{featured.excerpt}</p>
            </div>
          </Link>
        </section>
      ) : null}
    </>
  );
}
