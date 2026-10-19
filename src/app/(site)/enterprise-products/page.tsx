import type { Metadata } from "next";
import { CmsImage } from "@/components/cms/cms-image";
import { PillLink } from "@/components/site/links";
import { ProductGrid } from "@/components/site/product-grid";
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
        field="torus"
      />

      <section className="container-site pt-32 lg:pt-48">
        <h2 className="text-headline mb-10 lg:mb-14" data-reveal>
          {products.title}
        </h2>
        <ProductGrid items={products.items} />
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
                  <h3 className="text-headline max-w-[12ch]">{p.name}</h3>
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
