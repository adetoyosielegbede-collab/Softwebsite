import "server-only";
import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import type { CmsImage, SiteContent } from "@/lib/content-types";
import { absoluteUrl, siteUrl } from "@/lib/site-url";

export { absoluteUrl, siteUrl };

export function metadataBaseUrl() {
  return new URL(siteUrl());
}

/** Trim a paragraph for a meta description without cutting the last word in half. */
export function metaDescription(text: string, max = 160) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const last = cut.lastIndexOf(" ");
  const base = (last > 80 ? cut.slice(0, last) : cut).trim();
  return `${base}…`;
}

export function publishedIso(value: string | undefined) {
  if (!value) return undefined;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return `${value}T00:00:00.000Z`;
  if (/^\d{4}-\d{2}$/.test(value)) return `${value}-01T00:00:00.000Z`;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function chooseImage(preferred: CmsImage | null | undefined) {
  if (preferred?.src) return { url: preferred.src, alt: preferred.alt || "" };
  return undefined;
}

export async function publicPageMetadata(options: {
  title: string;
  description: string;
  path: string;
  image?: CmsImage | null;
  type?: "website" | "article";
  publishedTime?: string;
  /** Home already includes the brand in the title. Other pages use the `%s — Softcom` template. */
  absoluteTitle?: boolean;
}): Promise<Metadata> {
  const site = await getContent("site");
  const description = metaDescription(options.description);
  // A title that already says what the page does is used as written. Short titles still take “%s — Softcom”.
  const carriesTheJob = options.absoluteTitle || options.title.includes(" — ");
  const socialTitle = carriesTheJob ? options.title : `${options.title} — ${site.brand.name}`;
  const url = absoluteUrl(options.path);
  const image = chooseImage(options.image);
  const publishedTime = publishedIso(options.publishedTime);
  const images = image ? [{ url: image.url, alt: image.alt }] : undefined;

  return {
    title: carriesTheJob ? { absolute: options.title } : options.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: socialTitle,
      description,
      url,
      siteName: site.brand.name,
      type: options.type ?? "website",
      images,
      ...(options.type === "article" && publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: socialTitle,
      description,
      images: image ? [{ url: image.url, alt: image.alt }] : undefined,
    },
  };
}

export function siteStructuredData(site: SiteContent) {
  const url = absoluteUrl("/");
  const lines = site.contact.addressLines.map((line) => line.trim()).filter(Boolean);
  const country = lines.length > 1 ? lines[lines.length - 1] : undefined;
  const street = (lines.length > 1 ? lines.slice(0, -1) : lines).join(", ");
  const logo = site.brand.logo.src ? absoluteUrl(site.brand.logo.src) : undefined;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: site.contact.company || site.brand.name,
        alternateName: site.brand.name,
        url,
        email: site.contact.email,
        ...(logo ? { logo } : {}),
        address: {
          "@type": "PostalAddress",
          ...(street ? { streetAddress: street } : {}),
          ...(country ? { addressCountry: country } : {}),
        },
      },
      {
        "@type": "WebSite",
        name: site.brand.name,
        url,
      },
    ],
  };
}

export function articleStructuredData(options: {
  site: SiteContent;
  title: string;
  description: string;
  path: string;
  date: string;
  image?: CmsImage | null;
}) {
  const published = publishedIso(options.date);
  const imageSrc = options.image?.src || options.site.seo.shareImage.src;
  const logo = options.site.brand.logo.src ? absoluteUrl(options.site.brand.logo.src) : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: options.title,
    description: metaDescription(options.description),
    ...(published ? { datePublished: published } : {}),
    ...(imageSrc ? { image: absoluteUrl(imageSrc) } : {}),
    mainEntityOfPage: absoluteUrl(options.path),
    author: { "@type": "Organization", name: options.site.brand.name },
    publisher: {
      "@type": "Organization",
      name: options.site.contact.company || options.site.brand.name,
      ...(logo ? { logo: { "@type": "ImageObject", url: logo } } : {}),
    },
  };
}
