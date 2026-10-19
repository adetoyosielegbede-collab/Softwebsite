import type { Metadata } from "next";
import Link from "next/link";
import { CmsImage } from "@/components/cms/cms-image";
import { PillLink } from "@/components/site/links";
import { CtaBanner, PageHero } from "@/components/site/sections";
import { getContent } from "@/lib/content";
import { cn } from "@/lib/utils";

const FALLBACK_COLORS = ["#2a2b30", "#004bff", "#d7c4a3", "#1f6a5c"];

function inkFor(color: string) {
  const hex = color.trim().replace("#", "");
  const full = hex.length === 3 ? hex.split("").map((c) => c + c).join("") : hex;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return "#f6f5f1";
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance > 0.62 ? "#0c0c0d" : "#f6f5f1";
}

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

      <section className="container-site pt-32 lg:pt-48">
        <h2 className="text-headline mb-10 lg:mb-14" data-reveal>
          {products.title}
        </h2>
        <div className="flex flex-col gap-2 md:grid md:grid-cols-2 md:items-start md:gap-6">
          {[0, 1].map((column) => (
            <div key={column} className={cn("contents md:flex md:flex-col md:gap-6", column === 1 && "md:mt-44")}>
              {products.items
                .map((product, index) => ({ product, index }))
                .filter(({ index }) => index % 2 === column)
                .map(({ product: p, index }) => {
                  const color = p.color || FALLBACK_COLORS[index % FALLBACK_COLORS.length];
                  const ink = inkFor(color);
                  return (
                    <Link
                      key={p.name}
                      href={p.href}
                      className="group flex min-h-[300px] flex-col justify-between gap-10 rounded-[20px] px-5 py-10 transition-transform duration-500 hover:-translate-y-1 max-md:[order:var(--card-order)] md:min-h-[520px] md:px-10 md:py-14"
                      style={{ backgroundColor: color, color: ink, "--card-order": index + 1 } as React.CSSProperties}
                      data-reveal
                    >
                      <div className="flex items-start justify-between gap-6">
                        <h3 className="text-title max-w-[12ch] text-balance">{p.name}</h3>
                        <div className={cn("relative size-10 shrink-0 md:size-16", !p.logo?.src && "hidden [.cms-editing_&]:block")}>
                          <CmsImage
                            image={p.logo}
                            file="enterprise-products"
                            path={`products.items.${index}.logo`}
                            sizes="64px"
                            className="object-contain"
                            emptyClassName="absolute inset-0"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-5 md:gap-8">
                        <p className="border-b border-current/20 pb-2 font-mono text-sm">{String(index + 1).padStart(2, "0")}</p>
                        <p className="text-body max-w-md">{p.summary || p.tagline}</p>
                      </div>
                    </Link>
                  );
                })}
            </div>
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
