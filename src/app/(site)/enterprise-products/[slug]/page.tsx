import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EditableImage } from "@/components/editable-image";
import { getSite } from "@/lib/content";

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const site = await getSite();
  const product = site.products.items.find((item) => item.slug === slug);
  return { title: product?.name ?? "Product" };
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const site = await getSite();
  const product = site.products.items.find((item) => item.slug === slug);
  if (!product) notFound();

  return (
    <>
      <section className="relative overflow-hidden px-6 pt-40 pb-16 md:px-12 md:pt-48">
        <EditableImage media={product.image} className="absolute inset-0 opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/80 to-canvas" />
        <div className="relative max-w-4xl">
          <p className="kicker">{product.eyebrow}</p>
          <h1 className="display mt-4 text-[clamp(44px,7vw,88px)]">{product.headline}</h1>
          <p className="mt-6 max-w-2xl text-lg text-white/75">{product.lede}</p>
          <Link href={product.href} className="mt-8 inline-flex h-11 items-center rounded-full bg-white px-5 text-sm font-medium text-black">
            {product.cta}
          </Link>
        </div>
      </section>

      {product.gallery.length > 0 ? (
        <section className="mx-auto grid max-w-6xl gap-4 px-6 md:grid-cols-2 md:px-10">
          {product.gallery.map((image) => (
            <figure key={image.id} className="overflow-hidden rounded-[1.5rem] bg-white/5">
              <EditableImage media={image} className="aspect-[16/10]" imgClassName="object-contain bg-[#f6f7fb]" />
              <figcaption className="px-4 py-3 text-sm text-white/55">{image.alt || image.label}</figcaption>
            </figure>
          ))}
        </section>
      ) : null}

      <section className="mx-auto max-w-4xl space-y-12 px-6 py-16 md:px-10">
        {product.sections.map((section) => (
          <article key={section.number}>
            <p className="text-sm text-accent">{section.number}</p>
            <h2 className="display mt-2 text-3xl md:text-5xl">{section.title}</h2>
            <p className="mt-4 text-lg leading-8 text-white/70">{section.body}</p>
          </article>
        ))}
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-20 md:px-10">
        <div className="rounded-[2rem] border border-line p-8">
          <h2 className="display text-3xl">{product.audienceTitle}</h2>
          <p className="mt-4 text-white/70">{product.audienceBody}</p>
          <p className="mt-4 text-white/60">{product.close}</p>
          <Link href="/contact" className="mt-6 inline-flex h-11 items-center rounded-full bg-white px-5 text-sm font-medium text-black">
            {product.cta}
          </Link>
        </div>
      </section>
    </>
  );
}
