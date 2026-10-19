import Link from "next/link";
import type { SiteContent } from "@/lib/content-types";

export function SiteFooter({ site }: { site: SiteContent }) {
  return (
    <footer className="relative z-10 mx-4 mt-2.5 mb-4 overflow-hidden rounded-[2rem] bg-surface-raised px-6 pt-14 pb-6 shadow-[0_-32px_80px_rgba(0,0,0,0.45)] md:mx-10 lg:mb-6 lg:h-[min(700px,85svh)] lg:px-[3.2%] lg:pt-[60px] lg:pb-0">
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
          className="dot-grid mt-16 aspect-[1268/284] w-full opacity-70 [mask-image:url(/brand/softcom-wordmark.svg)] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center] lg:absolute lg:bottom-0 lg:left-[4.45%] lg:mt-0 lg:w-[91.1%] lg:translate-y-[18%]"
        />

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-[11px] text-ink-faint lg:absolute lg:inset-x-[3.2%] lg:bottom-6 lg:mt-0">
          <p>{site.footer.copyright}</p>
          <Link href="/admin" className="transition-colors hover:text-ink">
            Edit site
          </Link>
        </div>
    </footer>
  );
}
