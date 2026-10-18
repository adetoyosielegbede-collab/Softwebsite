import Link from "next/link";
import type { SiteContent } from "@/lib/content-types";

export function SiteFooter({ site }: { site: SiteContent }) {
  return (
    <footer className="container-site pb-4">
      <div className="relative overflow-hidden rounded-3xl bg-surface-raised px-6 pt-10 pb-6 lg:px-10 lg:pt-12">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <p className="mb-4 text-xs text-ink-soft">{site.footer.eyebrow}</p>
            <a href={`mailto:${site.contact.email}`} className="display text-2xl transition-colors hover:text-signal lg:text-3xl">
              {site.contact.email}
            </a>
            <address className="mt-6 text-xs leading-relaxed text-ink-soft not-italic">
              {site.contact.company}
              {site.contact.addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          </div>
          <nav className="grid grid-cols-2 gap-8 sm:grid-cols-4" aria-label="Footer">
            {site.menu.map((group) => (
              <div key={group.title}>
                <p className="mb-4 text-xs text-ink-soft">{group.title}</p>
                <ul className="space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-[13px] font-medium transition-colors hover:text-signal">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div
          aria-hidden
          className="dot-grid mt-16 aspect-[1268/284] w-full opacity-70 [mask-image:url(/brand/softcom-wordmark.svg)] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center]"
        />

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-[11px] text-ink-faint">
          <p>{site.footer.copyright}</p>
          <Link href="/admin" className="transition-colors hover:text-ink">
            Edit site
          </Link>
        </div>
      </div>
    </footer>
  );
}
