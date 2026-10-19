import type { Metadata } from "next";
import Link from "next/link";
import { CmsImage } from "@/components/cms/cms-image";
import { ColorReveal } from "@/components/site/color-reveal";
import { PillLink } from "@/components/site/links";
import { CtaBanner, PageHero } from "@/components/site/sections";
import { getContent } from "@/lib/content";
import { cn } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContent("enterprise-products");
  return { title: seo.title, description: seo.description };
}

export default async function EnterpriseProductsPage() {
  const page = await getContent("enterprise-products");
  const { hero, products, partners } = page;

  return (
    <>
      <PageHero
        file="enterprise-products"
        eyebrow={hero.eyebrow}
        title={hero.title}
        text={hero.text}
        backgroundImage={hero.backgroundImage}
        actions={[{ label: hero.ctaLabel, href: hero.ctaHref }]}
      />

      <section className="container-site">
        <h2 className="text-headline mb-8" data-reveal>
          {products.title}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {products.items.map((p, i) => (
            <Link
              key={p.name}
              href={p.href}
              className="group flex flex-col overflow-hidden rounded-3xl bg-surface-raised transition-colors hover:bg-surface-high"
              data-reveal
            >
              <div className="flex items-start justify-between gap-6 p-6 lg:p-7">
                <h3 className="text-headline leading-[1.1] sm:w-[56%]">{p.name}</h3>
                <p className="text-lede max-w-[220px] text-right text-ink">{p.tagline}</p>
              </div>
              <ColorReveal className="relative mx-2 mb-2 aspect-[668/585] overflow-hidden rounded-[1.25rem] bg-brand">
                <CmsImage
                  image={p.image}
                  file="enterprise-products"
                  path={`products.items.${i}.image`}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="transition-transform duration-700 group-hover:scale-[1.03]"
                  emptyClassName="absolute inset-0"
                />
                <span className="absolute right-4 bottom-4 inline-flex h-8 items-center rounded-full bg-white px-3.5 text-xs font-medium text-black transition-colors group-hover:bg-signal">
                  Explore {p.name}
                </span>
              </ColorReveal>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-site pt-28 lg:pt-40">
        <div className="mb-10 grid gap-4 lg:grid-cols-2 lg:items-end">
          <h2 className="text-headline" data-reveal>
            {partners.title}
          </h2>
          <p className="text-body max-w-sm text-ink-soft lg:justify-self-end" data-reveal>
            {partners.text}
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {partners.items.map((p, i) => (
            <article key={p.name} className="flex flex-col rounded-3xl bg-surface-raised p-6 lg:p-8" data-reveal>
              <div className="flex items-start justify-between gap-6">
                <div>
                  <div className={cn("relative mb-4 h-10 w-40", !p.logo.src && "hidden [.cms-editing_&]:block")}>
                    <CmsImage
                      image={p.logo}
                      file="enterprise-products"
                      path={`partners.items.${i}.logo`}
                      className="object-contain object-left"
                      sizes="160px"
                      emptyClassName="absolute inset-0 p-2"
                    />
                  </div>
                  <h3 className="text-headline max-w-[12ch] leading-[1.1]">{p.name}</h3>
                </div>
                <p className="text-lede max-w-[200px] text-right text-ink-soft">{p.tagline}</p>
              </div>
              <p className="text-body mt-10 flex-1 text-ink-soft">{p.text}</p>
              <div className="mt-6">
                <PillLink href={p.href}>{p.ctaLabel}</PillLink>
              </div>
            </article>
          ))}
        </div>
      </section>

      <CtaBanner cta={page.cta} file="enterprise-products" />
    </>
  );
}
