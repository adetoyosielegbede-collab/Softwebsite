import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CmsImage } from "@/components/cms/cms-image";
import { ProductStory } from "@/components/site/product-story";
import { CtaBanner, PageHero } from "@/components/site/sections";
import { getContent } from "@/lib/content";
import { PRODUCT_SLUGS } from "@/lib/cms/registry";
import type { ProductContent } from "@/lib/content-types";

type Slug = (typeof PRODUCT_SLUGS)[number];

export const dynamicParams = false;

export function generateStaticParams() {
  return PRODUCT_SLUGS.map((slug) => ({ slug }));
}

function isSlug(slug: string): slug is Slug {
  return (PRODUCT_SLUGS as readonly string[]).includes(slug);
}

async function load(slug: string): Promise<ProductContent | null> {
  return isSlug(slug) ? getContent(`products/${slug}`) : null;
}

export async function generateMetadata({ params }: PageProps<"/enterprise-products/[slug]">): Promise<Metadata> {
  const product = await load((await params).slug);
  return product ? { title: product.seo.title, description: product.seo.description } : {};
}

export default async function ProductPage({ params }: PageProps<"/enterprise-products/[slug]">) {
  const { slug } = await params;
  const product = await load(slug);
  if (!product) notFound();
  const file = `products/${slug}`;
  const { hero } = product;

  if (slug === "lift" || slug === "reckon" || slug === "sentinel" || slug === "useforms") {
    return <ProductStory product={product} file={file} />;
  }

  return (
    <>
      <PageHero
        file={file}
        eyebrow={hero.eyebrow}
        title={hero.title}
        text={hero.text}
        backgroundImage={hero.backgroundImage}
        actions={[
          { label: hero.primaryLabel, href: hero.primaryHref },
          { label: hero.secondaryLabel, href: hero.secondaryHref, variant: "arrow" },
        ]}
      />

      <div id="overview" className="container-site scroll-mt-24 space-y-4 pt-32 lg:pt-48">
        {product.overview.length > 0 && (
          <div className="max-w-3xl pb-12 lg:ml-auto lg:w-2/3">
            {product.overview.map((p) => (
              <p key={p} className="text-title text-ink-soft" data-reveal>
                {p}
              </p>
            ))}
          </div>
        )}

        {product.blocks.map((block, b) => (
          <div key={`${block.number}-${b}`} className="space-y-4">
            {block.title && (
              <section className="rounded-3xl bg-surface-raised p-6 lg:p-10" data-reveal>
                <div className="grid gap-6 lg:grid-cols-2 lg:gap-16">
                  <div>
                    {block.number && (
                      <p className="flex items-center gap-2 font-mono text-[11px] text-signal">
                        <span className="size-1.5 rounded-full bg-signal" aria-hidden />
                        {block.number}
                      </p>
                    )}
                    <h2 className="text-headline mt-4">{block.title}</h2>
                  </div>
                  {block.text && <p className="text-body text-ink-soft lg:pt-8">{block.text}</p>}
                </div>
                {block.points.length > 0 && (
                  <ul className="mt-10 grid gap-4 md:grid-cols-3">
                    {block.points.map((pt) => (
                      <li key={pt.title} className="rounded-2xl bg-paper/60 p-6 ring-1 ring-line">
                        <h3 className="text-base">{pt.title}</h3>
                        <p className="text-body mt-2 text-ink-soft">{pt.text}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )}

            {block.figures.map((fig, f) => (
              <figure key={`${fig.label}-${f}`} className="m-0 flex flex-col gap-8 rounded-3xl bg-surface-raised p-6 lg:p-10" data-reveal>
                <header className="flex flex-col gap-3">
                  <span className="label">{fig.label}</span>
                  <h3 className="text-title">{fig.title}</h3>
                  {fig.caption && <p className="text-sm text-ink-soft lg:text-base">{fig.caption}</p>}
                </header>
                <div className="overflow-hidden rounded-2xl">
                  <CmsImage
                    image={fig.image}
                    file={file}
                    path={`blocks.${b}.figures.${f}.image`}
                    width={1600}
                    height={900}
                    sizes="(min-width: 1440px) 1280px, 100vw"
                    className="h-auto w-full"
                    emptyClassName="aspect-video w-full"
                  />
                </div>
                <footer className="label flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4 text-ink-faint">
                  <span className="text-ink">Softcom</span>
                  <span>{fig.source}</span>
                </footer>
              </figure>
            ))}
          </div>
        ))}
      </div>

      {product.audience.title && (
        <section className="container-site pt-28 text-center lg:pt-40">
          <p className="eyebrow mb-5" data-reveal>
            {product.audience.eyebrow}
          </p>
          <h2 className="text-headline mx-auto max-w-3xl" data-reveal>
            {product.audience.title}
          </h2>
          {product.audience.text && (
            <p className="text-lede mx-auto mt-6 max-w-2xl text-ink-soft" data-reveal>
              {product.audience.text}
            </p>
          )}
        </section>
      )}

      <CtaBanner cta={product.cta} file={file} />
    </>
  );
}
