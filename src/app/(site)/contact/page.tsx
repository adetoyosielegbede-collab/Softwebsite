import type { Metadata } from "next";
import { Mail, MapPin } from "lucide-react";
import { CmsImage } from "@/components/cms/cms-image";
import { ContactForm } from "@/components/site/contact-form";
import { getContent } from "@/lib/content";
import { cn } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContent("contact");
  return { title: seo.title, description: seo.description };
}

export default async function ContactPage() {
  const [page, site] = await Promise.all([getContent("contact"), getContent("site")]);

  return (
    <section className="container-site grid gap-10 pt-32 pb-16 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16 lg:pt-40">
      <div>
        <span className="inline-block rounded-full bg-signal px-2.5 py-1 text-[11px] font-medium text-black">{page.badge}</span>
        <h1 className="display mt-6 text-5xl lg:text-6xl">{page.title}</h1>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-ink-soft">{page.text}</p>
        <div className={cn("relative mt-8 aspect-[4/3] overflow-hidden rounded-3xl", !page.image.src && "hidden [.cms-editing_&]:block")}>
          <CmsImage image={page.image} file="contact" path="image" sizes="(min-width: 1024px) 40vw, 100vw" emptyClassName="absolute inset-0" />
        </div>
      </div>
      <div className="space-y-4">
        <ContactForm form={page.form} />
        <div className="grid gap-4 rounded-3xl bg-surface-raised p-6 sm:grid-cols-[auto_1fr_1fr] sm:items-center lg:p-8">
          <h2 className="display text-xl">{page.getInTouchTitle}</h2>
          <address className="flex gap-3 text-xs leading-relaxed text-ink-soft not-italic">
            <MapPin className="mt-0.5 size-4 shrink-0 text-accent-ink" aria-hidden />
            <span>
              {site.contact.company}
              {site.contact.addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </span>
          </address>
          <a href={`mailto:${site.contact.email}`} className="flex items-center gap-3 text-sm hover:text-accent-ink">
            <Mail className="size-4 text-accent-ink" aria-hidden />
            {site.contact.email}
          </a>
        </div>
      </div>
    </section>
  );
}
