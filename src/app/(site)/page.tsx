import { ArrowDown } from "lucide-react";
import { CmsImage } from "@/components/cms/cms-image";
import { Carousel } from "@/components/site/carousel";
import { HeroMatrix } from "@/components/site/dot-canvas";
import { HowWeWork } from "@/components/site/how-we-work";
import { InsightCard } from "@/components/site/insight-card";
import { ArrowLink, PillLink } from "@/components/site/links";
import { Highlight } from "@/components/site/rich";
import { CtaBanner, PartnerMarquee, Stats } from "@/components/site/sections";
import { getContent, getPublishedPosts } from "@/lib/content";

function PixelMark() {
  const dots = (cx: number, color: string) =>
    Array.from({ length: 5 }, (_, y) =>
      Array.from({ length: 5 }, (_, x) => {
        const d = Math.hypot(x - 2, y - 2);
        if (d > 2.2) return null;
        return <rect key={`${cx}-${x}-${y}`} x={cx + x} y={y + 0.5} width="0.82" height="0.82" fill={color} />;
      }),
    );
  return (
    <svg viewBox="0 0 28 6" className="h-12 w-auto" aria-hidden>
      {dots(0, "#2f6bff")}
      {Array.from({ length: 14 }, (_, i) => (
        <rect key={i} x={6.2 + i * 1.05} y={2.4} width="0.72" height="0.72" fill="#00ffff" opacity={0.45 + (i % 3) * 0.25} />
      ))}
      {dots(22, "#00ffff")}
    </svg>
  );
}

export default async function HomePage() {
  const [home, site, posts] = await Promise.all([getContent("home"), getContent("site"), getPublishedPosts()]);

  return (
    <>
      <section className="relative flex h-[100svh] min-h-[560px] items-end overflow-hidden bg-black">
        {home.hero.backgroundImage.src ? (
          <>
            <CmsImage image={home.hero.backgroundImage} file="home" path="hero.backgroundImage" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
          </>
        ) : (
          <>
            <HeroMatrix />
            <CmsImage
              image={home.hero.backgroundImage}
              file="home"
              path="hero.backgroundImage"
              emptyClassName="absolute top-24 right-6 z-10"
            />
          </>
        )}
        <div className="container-site relative flex items-end justify-between gap-6 pb-12 lg:pb-16">
          <h1 className="display text-[2.4rem] leading-[1.05] sm:text-6xl lg:text-7xl">
            <span className="block">{home.hero.titleLine1}</span>
            <span className="block text-ink-soft">{home.hero.titleLine2}</span>
          </h1>
          <a href="#intro" aria-label="Scroll to content" className="mb-2 hidden text-ink-soft hover:text-ink sm:block">
            <ArrowDown className="size-5 animate-bounce" />
          </a>
        </div>
      </section>

      <section id="intro" className="bg-brand text-white">
        <div className="container-site py-20 lg:py-28">
          <PixelMark />
          <p className="display mt-24 max-w-4xl text-[1.7rem] leading-[1.3] sm:text-4xl lg:mt-40 lg:text-[2.7rem]" data-reveal>
            <Highlight text={home.intro.text} />
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-6" data-reveal>
            <PillLink href={home.intro.primaryHref}>{home.intro.primaryLabel}</PillLink>
            <ArrowLink href={home.intro.secondaryHref} className="text-white hover:text-signal">
              {home.intro.secondaryLabel}
            </ArrowLink>
          </div>
        </div>
      </section>

      <section className="relative flex min-h-[90vh] items-center overflow-hidden">
        <CmsImage image={home.mission.image} file="home" path="mission.image" />
        <div className="absolute inset-0 bg-black/45" />
        <div className="container-site relative py-24 text-center" data-reveal>
          <span className="mx-auto mb-8 block size-4 rounded-full bg-signal shadow-[0_0_30px_rgba(0,255,255,0.7)]" aria-hidden />
          <h2 className="display mx-auto max-w-3xl text-4xl leading-tight sm:text-5xl">{home.mission.title}</h2>
          <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-white/80">{home.mission.text}</p>
          <div className="mt-8">
            <PillLink href={home.mission.ctaHref}>{home.mission.ctaLabel}</PillLink>
          </div>
        </div>
      </section>

      <section className="pt-28 lg:pt-40">
        <div className="container-site">
          <h2 className="display mb-10 text-4xl lg:text-5xl" data-reveal>
            {home.focusAreas.title}
          </h2>
        </div>
        <Carousel label={home.focusAreas.title}>
          {home.focusAreas.items.map((area, i) => (
            <article
              key={area.title}
              className="relative flex aspect-[4/5] w-[86vw] shrink-0 snap-start items-end overflow-hidden rounded-3xl sm:aspect-[16/10] lg:w-[min(1176px,82vw)] lg:aspect-[1176/528]"
            >
              <CmsImage
                image={area.image}
                file="home"
                path={`focusAreas.items.${i}.image`}
                sizes="(min-width: 1024px) 82vw, 86vw"
              />
              <span
                className={
                  "absolute top-5 right-5 grid size-14 place-items-center rounded-2xl font-heading text-3xl font-light lg:top-7 lg:right-7 lg:size-16 lg:text-4xl " +
                  (i === 0 ? "bg-brand text-signal" : i === 1 ? "bg-signal text-brand" : "bg-black text-white")
                }
              >
                {area.number}
              </span>
              <div className="relative m-3 w-full rounded-2xl bg-paper/95 p-6 backdrop-blur sm:m-5 sm:ml-auto sm:max-w-[560px] lg:m-7 lg:ml-auto lg:p-8">
                <h3 className="display text-3xl leading-tight lg:text-4xl">{area.title}</h3>
                <p className="mt-4 text-[13px] leading-relaxed text-ink-soft">{area.text}</p>
                <div className="mt-6">
                  <PillLink href={area.href}>{area.ctaLabel}</PillLink>
                </div>
              </div>
            </article>
          ))}
        </Carousel>
      </section>

      <section className="container-site pt-28 lg:pt-40">
        <div className="mb-12 grid gap-6 lg:grid-cols-2 lg:items-end">
          <h2 className="display text-4xl lg:text-5xl" data-reveal>
            {home.audiences.title}
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-ink-soft lg:justify-self-end" data-reveal>
            {home.audiences.intro}
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {home.audiences.items.map((a, i) => (
            <article
              key={a.title}
              className="flex flex-col rounded-3xl bg-surface-raised p-6 transition-colors hover:bg-surface-high lg:p-8"
              data-reveal
              style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="display max-w-[10ch] text-2xl leading-tight">{a.title}</h3>
                <div className="relative h-[115px] w-24 shrink-0">
                  <CmsImage
                    image={a.icon}
                    file="home"
                    path={`audiences.items.${i}.icon`}
                    className="object-contain"
                    sizes="96px"
                    emptyClassName="absolute inset-0 p-2 text-[10px]"
                  />
                </div>
              </div>
              <p className="mt-10 flex-1 text-[13px] leading-relaxed text-ink-soft">{a.text}</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {a.tags.map((t) => (
                  <li key={t} className="rounded-md bg-white/5 px-2.5 py-1.5 text-[11px] text-ink-soft ring-1 ring-line">
                    {t}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <PillLink href={home.audiences.primaryHref}>{home.audiences.primaryLabel}</PillLink>
          <ArrowLink href={home.audiences.secondaryHref}>{home.audiences.secondaryLabel}</ArrowLink>
        </div>
      </section>

      <section className="pt-24 lg:pt-32" aria-label="Organisations we have worked with">
        <PartnerMarquee partners={site.partners} />
      </section>

      <section className="container-site pt-24 lg:pt-32">
        <Stats stats={site.stats} />
      </section>

      <section className="container-site pt-28 lg:pt-40">
        <HowWeWork content={home.howWeWork} />
      </section>

      <section className="container-site pt-28 lg:pt-40">
        <div className="mb-12 grid gap-6 lg:grid-cols-2 lg:items-end">
          <h2 className="display text-4xl lg:text-5xl" data-reveal>
            {home.thinking.title}
          </h2>
          <div className="flex flex-col gap-5 lg:items-end lg:text-right" data-reveal>
            <p className="max-w-sm text-sm leading-relaxed text-ink-soft">{home.thinking.text}</p>
            <PillLink href={home.thinking.ctaHref}>{home.thinking.ctaLabel}</PillLink>
          </div>
        </div>
        {posts.length > 0 ? (
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {posts.slice(0, 3).map((post) => (
              <div key={post.slug} data-reveal>
                <InsightCard post={post} index={post.index} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink-soft">New perspectives are on the way.</p>
        )}
      </section>

      <CtaBanner cta={home.cta} file="home" />
    </>
  );
}
