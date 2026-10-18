import type { Metadata } from "next";
import Link from "next/link";
import { EditableImage } from "@/components/editable-image";
import { getSite } from "@/lib/content";

export const metadata: Metadata = { title: "Enterprise products" };

export default async function ProductsPage() {
  const { products } = await getSite();
  const own = products.items.filter((item) => item.kind === "product");
  const partners = products.items.filter((item) => item.kind === "partner");

  return (
    <section className="px-6 pt-40 pb-20 md:px-12 md:pt-48">
      <p className="kicker">{products.kicker}</p>
      <h1 className="display mt-4 max-w-4xl text-[clamp(48px,7vw,92px)]">{products.headline}</h1>
      <p className="mt-6 max-w-2xl text-lg text-white/70">{products.lede}</p>

      <div className="mt-14 grid gap-5 md:grid-cols-2">
        {own.map((product) => (
          <Link key={product.slug} href={`/enterprise-products/${product.slug}`} className="group overflow-hidden rounded-[1.8rem] bg-white/5 ring-1 ring-white/10">
            <EditableImage media={product.image} className="aspect-[16/9]" imgClassName="transition duration-700 group-hover:scale-[1.03]" />
            <div className="p-6">
              <p className="text-sm text-accent">{product.eyebrow}</p>
              <h2 className="display mt-2 text-4xl">{product.name}</h2>
              <p className="mt-3 text-white/65">{product.summary}</p>
              <p className="mt-5 text-sm">Explore {product.name} →</p>
            </div>
          </Link>
        ))}
      </div>

      <h2 className="display mt-20 text-4xl">Partner platforms</h2>
      <p className="mt-3 max-w-2xl text-white/65">{products.partnerIntro}</p>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {partners.map((product) => (
          <Link key={product.slug} href={`/enterprise-products/${product.slug}`} className="rounded-[1.8rem] border border-line p-6">
            <EditableImage media={product.image} className="mb-6 h-16 w-48 bg-transparent" imgClassName="object-contain object-left" />
            <h3 className="text-2xl font-light">{product.name}</h3>
            <p className="mt-3 text-sm leading-6 text-white/65">{product.summary}</p>
            <p className="mt-5 text-sm">Explore →</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
