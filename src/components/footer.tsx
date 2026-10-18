import Link from "next/link";
import type { SiteContent } from "@/lib/types";
import { EditableImage } from "./editable-image";

export function Footer({ site }: { site: SiteContent }) {
  const columns = [
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Careers", href: "/careers" },
        { label: "Alumni", href: "/alumni" },
      ],
    },
    {
      title: "What we do",
      links: [
        { label: "Solutions", href: "/solutions" },
        { label: "Enterprise products", href: "/enterprise-products" },
        { label: "Case studies", href: "/case-studies" },
      ],
    },
    {
      title: "Products",
      links: [
        { label: "Lift", href: "/enterprise-products/lift" },
        { label: "Reckon", href: "/enterprise-products/reckon" },
        { label: "Sentinel", href: "/enterprise-products/sentinel" },
        { label: "Useforms", href: "/enterprise-products/useforms" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Insights", href: "/insights" },
        { label: "Contact", href: "/contact" },
        { label: "Studio", href: "/studio" },
      ],
    },
  ];

  return (
    <footer className="px-4 pb-6 md:px-6">
      <div className="relative overflow-hidden rounded-[2rem] bg-neutral-950">
        <EditableImage media={site.footer.image} className="absolute inset-0" imgClassName="opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/35" />
        <div className="relative flex min-h-[420px] flex-col justify-between px-6 py-10 md:min-h-[520px] md:px-12 md:py-12">
          <div>
            <p className="text-sm text-white/70">{site.footer.kicker}</p>
            <h2 className="display mt-4 max-w-xl text-4xl md:text-6xl">{site.footer.headline}</h2>
            <Link
              href={site.footer.href}
              className="mt-8 inline-flex h-11 items-center rounded-full bg-white px-5 text-sm font-medium text-black"
            >
              {site.footer.cta}
            </Link>
          </div>
          <div className="mt-16 grid gap-8 text-sm md:grid-cols-[1.2fr_2fr]">
            <div className="text-white/75">
              <p className="font-medium text-white">{site.contact.company}</p>
              {site.contact.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
              <a className="mt-3 inline-block text-white underline-offset-4 hover:underline" href={`mailto:${site.contact.email}`}>
                {site.contact.email}
              </a>
            </div>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {columns.map((column) => (
                <div key={column.title}>
                  <p className="text-white/45">{column.title}</p>
                  <ul className="mt-3 space-y-2">
                    {column.links.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className="hover:text-accent">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <p className="px-4 pt-5 text-sm text-white/40">© 2026 {site.contact.company}. All rights reserved.</p>
    </footer>
  );
}
