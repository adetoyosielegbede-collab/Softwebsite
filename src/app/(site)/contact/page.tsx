import type { Metadata } from "next";
import { Mail, MapPin } from "lucide-react";
import { CmsImage } from "@/components/cms/cms-image";
import { CrossField } from "@/components/site/dot-canvas";
import { ContactForm } from "@/components/site/contact-form";
import { getContent, requirePublishedPage } from "@/lib/content";
import { publicPageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  await requirePublishedPage("contact");
  const page = await getContent("contact");
  return publicPageMetadata({
    title: page.seo.title,
    description: page.seo.description,
    path: "/contact",
    image: page.image.src ? page.image : undefined,
  });
}

function productSlug(href: string) {
  const path = href.split("?")[0].replace(/\/$/, "");
  const parts = path.split("/");
  return parts[1] === "enterprise-products" && parts[2] ? parts[2] : "";
}

export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  await requirePublishedPage("contact");
  const [page, site, productsPage] = await Promise.all([
    getContent("contact"),
    getContent("site"),
    getContent("enterprise-products"),
  ]);
  const products = [
    ...productsPage.products.items.filter((item) => item.published).map((item) => ({ value: productSlug(item.href), label: item.name })),
    ...productsPage.partners.items.map((item) => ({ value: productSlug(item.href), label: item.name })),
  ].filter((item) => item.value);
  const requested = (await searchParams).product;
  const initialProduct = typeof requested === "string" ? requested : "";

  return (
    <section className="relative isolate min-h-[80svh]">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <CrossField />
      </div>
      <div className="container-site relative grid gap-10 pt-32 pb-16 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16 lg:pt-40">
        <div>
          <span className="inline-flex rounded-full bg-brand px-3 py-[5px] text-xs font-medium text-white dark:bg-signal dark:text-neutral-950">
            {page.badge}
          </span>
          <h1 className="text-display mt-6">{page.title}</h1>
          <p className="text-lede mt-5 max-w-[60ch] text-ink/80">{page.text}</p>
          <div className={cn("relative mt-8 aspect-[4/3] overflow-hidden rounded-3xl", !page.image.src && "hidden [.cms-editing_&]:block")}>
            <CmsImage image={page.image} file="contact" path="image" sizes="(min-width: 1024px) 40vw, 100vw" emptyClassName="absolute inset-0" />
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <ContactForm form={page.form} products={products} initialProduct={initialProduct} />
          <div className="grid gap-8 rounded-3xl bg-surface p-8 sm:grid-cols-[auto_1fr_1fr] sm:items-start lg:p-[47px]">
            <h2 className="text-title max-w-[142px]">{page.getInTouchTitle}</h2>
            <address className="flex items-start gap-4 text-sm leading-[1.6] text-ink not-italic">
              <MapPin className="size-6 shrink-0" aria-hidden />
              <span className="w-[167px]">
                <span className="block font-medium">{site.contact.company}</span>
                {site.contact.addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </span>
            </address>
            <a href={`mailto:${site.contact.email}`} className="flex items-start gap-4 text-sm leading-[1.6] hover:text-accent-ink">
              <Mail className="size-6 shrink-0" aria-hidden />
              <span className="w-[167px]">{site.contact.email}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
