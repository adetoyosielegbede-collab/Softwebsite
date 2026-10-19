import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { CmsImage } from "@/components/cms/cms-image";
import { CtaBanner, PageHero } from "@/components/site/sections";
import { getContent } from "@/lib/content";
import { cn } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContent("careers");
  return { title: seo.title, description: seo.description };
}

export default async function CareersPage() {
  const page = await getContent("careers");
  const { hero, openRoles } = page;

  return (
    <>
      <PageHero
        file="careers"
        eyebrow={hero.eyebrow}
        title={hero.title}
        text={hero.text}
        backgroundImage={hero.backgroundImage}
        actions={[{ label: hero.ctaLabel, href: hero.ctaHref }]}
      />

      <section className="container-site grid gap-10 pb-8 lg:grid-cols-2 lg:gap-20">
        <div className="space-y-5 text-sm leading-relaxed text-ink-soft lg:text-base" data-reveal>
          {page.intro.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <div className={cn("relative aspect-[4/3] overflow-hidden rounded-3xl", !page.image.src && "hidden [.cms-editing_&]:block")} data-reveal>
          <CmsImage image={page.image} file="careers" path="image" sizes="(min-width: 1024px) 50vw, 100vw" emptyClassName="absolute inset-0" />
        </div>
      </section>

      <section id="open-roles" className="container-site scroll-mt-24 pt-16">
        <div className="rounded-3xl bg-surface-raised p-6 lg:p-10" data-reveal>
          <h2 className="display text-3xl lg:text-4xl">{openRoles.title}</h2>
          {openRoles.roles.length === 0 ? (
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink-soft">{openRoles.emptyText}</p>
          ) : (
            <ul className="mt-8 divide-y divide-line border-y border-line">
              {openRoles.roles.map((role) => (
                <li key={role.title}>
                  <a href={role.href || "/contact"} className="group flex flex-wrap items-center justify-between gap-3 py-5">
                    <span className="text-lg transition-colors group-hover:text-accent-ink">{role.title}</span>
                    <span className="flex items-center gap-4 text-xs text-ink-soft">
                      {role.location && <span>{role.location}</span>}
                      {role.type && <span>{role.type}</span>}
                      <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-8">
            <a
              href={openRoles.ctaHref}
              className="inline-flex h-9 items-center rounded-full bg-ink px-4 text-[13px] font-medium text-paper hover:bg-signal hover:text-black"
            >
              {openRoles.ctaLabel}
            </a>
          </div>
        </div>
      </section>

      <section className="container-site grid gap-8 pt-28 lg:grid-cols-2 lg:pt-40">
        <h2 className="display text-4xl leading-tight lg:text-5xl" data-reveal>
          {page.work.title}
        </h2>
        <div className="space-y-5 text-sm leading-relaxed text-ink-soft lg:text-base" data-reveal>
          {page.work.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </section>

      <CtaBanner cta={page.cta} file="careers" />
    </>
  );
}
