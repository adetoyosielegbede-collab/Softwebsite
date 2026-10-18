import type { Metadata } from "next";
import Link from "next/link";
import { CmsImage } from "@/components/cms/cms-image";
import { ArrowLink, PillLink } from "@/components/site/links";
import { CtaBanner, PageHero, Stats } from "@/components/site/sections";
import { getContent, getPublishedPosts } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContent("about");
  return { title: seo.title, description: seo.description };
}

export default async function AboutPage() {
  const [about, site, posts] = await Promise.all([getContent("about"), getContent("site"), getPublishedPosts()]);
  const { hero, story, journey, values, leadership, buildWithUs, news } = about;

  return (
    <>
      <PageHero
        file="about"
        eyebrow={hero.eyebrow}
        title={hero.title}
        text={hero.text}
        backgroundImage={hero.backgroundImage}
        actions={[{ label: hero.ctaLabel, href: hero.ctaHref }]}
      />

      <section className="container-site grid gap-10 py-20 lg:grid-cols-2 lg:gap-20 lg:py-28">
        <h2 className="display max-w-lg text-4xl leading-tight lg:text-5xl" data-reveal>
          {story.title}
        </h2>
        <div className="space-y-5 text-sm leading-relaxed text-ink-soft lg:text-base" data-reveal>
          {story.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <div className={cn("relative aspect-[3/2] overflow-hidden rounded-2xl", !story.image.src && "hidden [.cms-editing_&]:block")}>
            <CmsImage image={story.image} file="about" path="story.image" sizes="(min-width: 1024px) 50vw, 100vw" emptyClassName="absolute inset-0" />
          </div>
        </div>
      </section>

      <section className="container-site grid gap-10 border-t border-line pt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-20 lg:pt-24">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow mb-4">{journey.eyebrow}</p>
          <h2 className="display text-4xl lg:text-5xl">{journey.title}</h2>
          <p className="mt-4 font-mono text-[11px] text-ink-faint">
            {journey.range} · {String(journey.items.length).padStart(2, "0")}
          </p>
        </div>
        <ol>
          {journey.items.map((m, i) => (
            <li key={`${m.year}-${m.title}`} className="grid gap-3 border-b border-line py-10 first:pt-0 sm:grid-cols-[140px_1fr] sm:gap-8" data-reveal>
              <p className="display text-2xl text-signal">{m.year}</p>
              <div>
                <h3 className="text-xl leading-snug lg:text-2xl">{m.title}</h3>
                <p className="mt-3 max-w-xl text-[13px] leading-relaxed text-ink-soft lg:text-sm">{m.text}</p>
                <div className={cn("relative mt-6 aspect-[16/9] max-w-xl overflow-hidden rounded-2xl", !m.image.src && "hidden [.cms-editing_&]:block")}>
                  <CmsImage
                    image={m.image}
                    file="about"
                    path={`journey.items.${i}.image`}
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    emptyClassName="absolute inset-0"
                  />
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="container-site pt-28 lg:pt-40">
        <h2 className="display mb-10 text-4xl lg:text-5xl" data-reveal>
          {values.title}
        </h2>
        <ol className="border-t border-line">
          {values.items.map((v, i) => (
            <li key={v.title} className="grid gap-2 border-b border-line py-6 sm:grid-cols-[1fr_3fr]" data-reveal>
              <span className="font-mono text-[11px] text-ink-faint">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="text-lg">{v.title}</h3>
                <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-ink-soft">{v.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section id="leadership" className="container-site scroll-mt-24 pt-28 lg:pt-40">
        <h2 className="display mb-10 text-4xl lg:text-5xl" data-reveal>
          {leadership.title}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {leadership.people.map((person, i) => (
            <figure key={person.name} className="group" data-reveal style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}>
              <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-surface-raised">
                <CmsImage
                  image={person.photo}
                  file="about"
                  path={`leadership.people.${i}.photo`}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className={cn(
                    "object-top transition duration-700 group-hover:scale-[1.02]",
                    leadership.grayscale && "grayscale group-hover:grayscale-0",
                  )}
                  emptyClassName="absolute inset-0"
                />
              </div>
              <figcaption className="mt-4">
                <p className="text-lg">{person.name}</p>
                <p className="text-[13px] text-ink-soft">{person.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="container-site pt-24 lg:pt-32">
        <Stats stats={site.stats} />
      </section>

      <section className="container-site grid gap-8 pt-28 lg:grid-cols-2 lg:pt-40">
        <h2 className="display text-4xl lg:text-5xl" data-reveal>
          {buildWithUs.title}
        </h2>
        <div data-reveal>
          <p className="max-w-md text-sm leading-relaxed text-ink-soft">{buildWithUs.text}</p>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <PillLink href={buildWithUs.primaryHref}>{buildWithUs.primaryLabel}</PillLink>
            <ArrowLink href={buildWithUs.secondaryHref}>{buildWithUs.secondaryLabel}</ArrowLink>
          </div>
        </div>
      </section>

      <section className="container-site pt-28 lg:pt-40">
        <div className="mb-10 grid gap-4 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="eyebrow mb-4">{news.eyebrow}</p>
            <h2 className="display text-4xl lg:text-5xl">{news.title}</h2>
          </div>
          <p className="text-sm text-ink-soft lg:justify-self-end">{news.text}</p>
        </div>
        <ul className="border-t border-line">
          {posts.slice(0, 5).map((post) => (
            <li key={post.slug}>
              <Link
                href={`/insights/${post.slug}`}
                className="grid gap-2 border-b border-line py-5 transition-colors hover:text-signal sm:grid-cols-[1fr_180px_140px] sm:items-center"
              >
                <span className="text-[15px]">{post.title}</span>
                <span className="text-xs text-ink-soft">{post.category}</span>
                <time dateTime={post.date} className="text-xs text-ink-soft sm:text-right">
                  {formatDate(post.date)}
                </time>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <ArrowLink href={news.ctaHref}>{news.ctaLabel}</ArrowLink>
        </div>
      </section>

      <CtaBanner cta={about.cta} file="about" />
    </>
  );
}
