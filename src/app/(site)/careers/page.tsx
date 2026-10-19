import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { CmsImage } from "@/components/cms/cms-image";
import { CtaBanner, FrameMarks, PageHero } from "@/components/site/sections";
import { PillLink } from "@/components/site/links";
import { getContent } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContent("careers");
  return { title: seo.title, description: seo.description };
}

export default async function CareersPage() {
  const page = await getContent("careers");
  const { hero, openRoles } = page;

  return (
    <>
      <div className="flex flex-col gap-32 md:gap-48">
        <div className="flex flex-col gap-16 md:gap-24">
          <PageHero
            file="careers"
            eyebrow={hero.eyebrow}
            title={hero.title}
            text={hero.text}
            backgroundImage={hero.backgroundImage}
            actions={[{ label: hero.ctaLabel, href: hero.ctaHref }]}
            field="torus"
          />

          <div className="container-site grid grid-cols-1 gap-y-4 md:grid-cols-12 md:gap-x-6">
            {page.intro.map((paragraph) => (
              <div key={paragraph} className="md:col-span-8" data-reveal>
                <p className="text-lede text-ink-soft">{paragraph}</p>
              </div>
            ))}
            {page.image.src ? (
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl md:col-span-8" data-reveal>
                <CmsImage image={page.image} file="careers" path="image" sizes="(min-width: 1024px) 50vw, 100vw" />
              </div>
            ) : null}
          </div>
        </div>

        <section className="flex scroll-mt-24 flex-col gap-10 md:gap-16">
          <FrameMarks />
          <div className="container-site">
            <div className="grid grid-cols-1 gap-y-6 border-t border-line pt-12 md:grid-cols-12 md:gap-x-6" data-reveal>
              <h2 className="text-headline text-balance text-ink md:col-span-6">{page.work.title}</h2>
              <div className="flex flex-col gap-4 md:col-span-5 md:col-start-8">
                {page.work.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-body text-ink">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="roles" className="flex scroll-mt-24 flex-col gap-10 md:gap-16">
          <FrameMarks />
          <div className="container-site">
            <div className="flex flex-col items-start gap-6 rounded-3xl bg-surface p-8 lg:p-[47px]" data-reveal>
              <h2 className="text-headline text-ink">{openRoles.title}</h2>
              {openRoles.roles.length === 0 ? (
                <p className="text-body max-w-[60ch] text-ink-soft">{openRoles.emptyText}</p>
              ) : (
                <ul className="w-full divide-y divide-line border-y border-line">
                  {openRoles.roles.map((role) => (
                    <li key={role.title}>
                      <a href={role.href || "/contact"} className="group flex flex-wrap items-center justify-between gap-3 py-5">
                        <span className="text-title transition-colors group-hover:text-accent-ink">{role.title}</span>
                        <span className="flex items-center gap-4 text-sm text-ink-soft">
                          {role.location && <span>{role.location}</span>}
                          {role.type && <span>{role.type}</span>}
                          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
              <PillLink href={openRoles.ctaHref}>{openRoles.ctaLabel}</PillLink>
            </div>
          </div>
        </section>
      </div>

      <CtaBanner cta={page.cta} file="careers" className="mt-32 lg:mt-48" />
    </>
  );
}
