import type { Metadata } from "next";
import Link from "next/link";
import { CmsImage } from "@/components/cms/cms-image";
import { ColorReveal } from "@/components/site/color-reveal";
import { ArrowLink, PillLink } from "@/components/site/links";
import { LineReveal } from "@/components/site/line-reveal";
import { CtaBanner, PageHero } from "@/components/site/sections";
import { getContent, getPublishedPosts } from "@/lib/content";
import { formatMonthYear } from "@/lib/format";
import { cn } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContent("about");
  return { title: seo.title, description: seo.description };
}

export default async function AboutPage() {
  const [about, posts] = await Promise.all([getContent("about"), getPublishedPosts()]);
  const { hero, story, journey, values, leadership, buildWithUs, news } = about;

  return (
    <>
      <PageHero
        file="about"
        title={hero.title}
        text={hero.text}
        backgroundImage={hero.backgroundImage}
        actions={[{ label: hero.ctaLabel, href: hero.ctaHref }]}
        field="armillary"
      />

      <section className="container-site grid gap-10 pt-24 md:grid-cols-12 lg:pt-24">
        <h2 className="text-headline md:col-span-5" data-reveal>
          {story.title}
        </h2>
        <div className="text-body flex flex-col gap-4 text-ink-soft md:col-span-6 md:col-start-7" data-reveal>
          {story.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <div className={cn("relative aspect-[3/2] overflow-hidden rounded-2xl", !story.image.src && "hidden [.cms-editing_&]:block")}>
            <CmsImage image={story.image} file="about" path="story.image" sizes="(min-width: 1024px) 50vw, 100vw" emptyClassName="absolute inset-0" />
          </div>
        </div>
      </section>

      <section id="journey" className="container-site grid scroll-mt-24 gap-y-12 pt-24 md:grid-cols-12 md:gap-x-6 lg:pt-24">
        <div className="md:col-span-4">
          <div className="md:sticky md:top-32">
            <p className="label mb-5 text-ink-soft">{journey.eyebrow}</p>
            <h2 className="text-headline">{journey.title}</h2>
            <p className="label mt-8 text-ink-faint">{journey.range}</p>
          </div>
        </div>
        <ol className="relative border-b border-line md:col-span-8">
          {journey.items.map((m, i) => (
            <li
              key={`${m.year}-${m.title}`}
              className="group relative grid gap-3 border-t border-line py-8 pl-8 md:grid-cols-[14rem_1fr] md:gap-x-10 md:py-10 md:pl-0"
              data-reveal
            >
              <span
                aria-hidden
                className="absolute top-0 bottom-0 left-0 w-px bg-line-strong group-first:top-10 group-last:bottom-auto group-last:h-[3.25rem] md:left-[14rem]"
              />
              <span
                aria-hidden
                className="absolute top-10 -left-[3px] size-[7px] rounded-full bg-brand ring-4 ring-paper md:top-[3.25rem] md:left-[calc(14rem-3px)]"
              />
              <p className="text-title whitespace-nowrap text-accent-ink tabular-nums md:pr-6">{m.year}</p>
              <div>
                <h3 className="text-title">{m.title}</h3>
                <p className="text-body mt-4 max-w-xl text-ink-soft">{m.text}</p>
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

      <section className="container-site pt-24 lg:pt-24">
        <h2 className="text-headline mb-12 md:mb-20" data-reveal>
          {values.title}
        </h2>
        <ol className="flex flex-col gap-6">
          {values.items.map((v, i) => (
            <li key={v.title} className="grid gap-y-2 border-t border-line pt-6 md:grid-cols-12" data-reveal>
              <span className="font-mono text-sm text-ink-soft md:col-span-3">{String(i + 1).padStart(2, "0")}</span>
              <div className="flex flex-col gap-2 md:col-span-6">
                <h3 className="font-heading text-xl heading-type">{v.title}</h3>
                <p className="text-body text-ink-soft">{v.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="container-site pt-24 lg:pt-24">
        <h2 id="leadership" className="text-headline mb-12 scroll-mt-24 md:mb-20" data-reveal>
          {leadership.title}
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {leadership.people.map((person, i) => (
            <figure
              key={person.name}
              className="group relative flex aspect-[335/471] flex-col justify-end overflow-clip rounded-2xl bg-neutral-900"
              data-reveal
              style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}
            >
              <ColorReveal className="absolute inset-0">
                <CmsImage
                  image={person.photo}
                  file="about"
                  path={`leadership.people.${i}.photo`}
                  sizes="(min-width: 1024px) 420px, 50vw"
                  className="object-center"
                  emptyClassName="absolute inset-0"
                />
              </ColorReveal>
              <figcaption className="leader-plate dark relative z-10 flex w-full flex-col gap-1 rounded-md bg-brand p-3">
                <p className="font-heading text-xl leading-none heading-type text-ink">{person.name}</p>
                <p className="font-heading text-base leading-[1.2] heading-type text-signal">{person.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="container-site pt-24 lg:pt-24">
        <div className="grid items-start gap-6 md:grid-cols-12 md:gap-x-6">
          <LineReveal className="text-headline md:col-span-6">{buildWithUs.title}</LineReveal>
          <div className="flex flex-col items-start gap-6 md:col-span-6 md:col-start-7" data-reveal>
            <p className="text-body max-w-md text-ink-soft">{buildWithUs.text}</p>
            <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:gap-3">
              <PillLink
                href={buildWithUs.primaryHref}
                className="h-10 justify-center px-2 text-[11px] whitespace-nowrap sm:w-72 sm:px-4 sm:text-sm"
              >
                {buildWithUs.primaryLabel}
              </PillLink>
              <PillLink
                href={buildWithUs.secondaryHref}
                className="h-10 justify-center px-2 text-[11px] whitespace-nowrap sm:w-72 sm:px-4 sm:text-sm"
              >
                {buildWithUs.secondaryLabel}
              </PillLink>
            </div>
          </div>
        </div>
      </section>

      <section className="container-site pt-24 lg:pt-24">
        <div className="mb-10 grid items-start gap-6 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="label mb-5 text-ink-soft">{news.eyebrow}</p>
            <h2 className="text-headline">{news.title}</h2>
          </div>
          {news.text ? <p className="text-body max-w-md text-ink-soft md:col-span-4 md:col-start-9">{news.text}</p> : null}
        </div>
        <ul className="border-t border-line">
          {posts.slice(0, 5).map((post) => (
            <li key={post.slug}>
              <Link
                href={`/insights/${post.slug}`}
                className="grid gap-2 border-b border-line py-5 transition-colors hover:text-accent-ink md:grid-cols-12 md:items-center"
              >
                <span className="font-heading text-lg heading-type md:col-span-7 lg:text-xl">{post.title}</span>
                <span className="text-sm text-ink-soft md:col-span-2 md:col-start-9">{post.category}</span>
                <time dateTime={post.date} className="text-sm whitespace-nowrap text-ink-soft md:col-span-2 md:text-right">
                  {formatMonthYear(post.date)}
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
