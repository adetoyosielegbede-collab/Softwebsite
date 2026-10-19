"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { CmsImage } from "@/components/cms/cms-image";
import type { SiteContent } from "@/lib/content-types";
import { cn } from "@/lib/utils";
import { PillLink } from "./links";

export function SiteHeader({ site }: { site: SiteContent }) {
  const [open, setOpen] = useState(false);
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const [hidden, setHidden] = useState(false);
  const pathname = usePathname();
  const isOpen = open && openedAt === pathname;

  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        const delta = y - last;
        if (y < 96) setHidden(false);
        else if (delta > 6) setHidden(true);
        else if (delta < -6) setHidden(false);
        last = y;
      });
    };
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== "touch" && event.clientY <= 32) setHidden(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const toggle = () => {
    setOpenedAt(pathname);
    setOpen((v) => !(v && openedAt === pathname));
  };

  return (
    <>
      <header
        data-hidden={hidden && !isOpen ? "" : undefined}
        className="fixed inset-x-0 top-3 z-50 flex justify-center px-4 transition-[translate,opacity] duration-300 ease-out data-hidden:-translate-y-[calc(100%+1rem)] data-hidden:opacity-0 motion-reduce:transition-none"
      >
        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-black/70 py-2 pr-2 pl-4 shadow-lg shadow-black/30 backdrop-blur-md">
          <Link href="/" aria-label={`${site.brand.name} home`} className="relative block h-[18px] w-[80px]">
            <CmsImage image={site.brand.logo} file="site" path="brand.logo" className="object-contain" sizes="80px" priority />
          </Link>
          <span className="h-5 w-px bg-white/15" aria-hidden />
          <button
            type="button"
            onClick={toggle}
            aria-expanded={isOpen}
            aria-controls="site-menu"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className="group flex h-7 items-center gap-1 rounded-full px-1.5 transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none"
          >
            {isOpen ? (
              <X className="size-4 text-white" />
            ) : (
              <>
                <span className="size-3 rounded-full bg-signal transition-transform group-hover:-translate-x-0.5" />
                <span className="-ml-1.5 size-3 rounded-full bg-brand transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </div>
      </header>

      <div
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={cn(
          "fixed inset-0 z-40 overflow-y-auto bg-paper/95 backdrop-blur-xl transition-[opacity,visibility] duration-300",
          isOpen ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        <div className="container-site grid min-h-full gap-10 pt-28 pb-10 lg:grid-cols-[1fr_420px] lg:gap-16">
          <nav className="grid content-start gap-10 sm:grid-cols-2">
            {site.menu.map((group) => (
              <div key={group.title}>
                <p className="eyebrow mb-4">{group.title}</p>
                <ul className="space-y-1">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "display block py-1 text-3xl transition-colors hover:text-signal lg:text-4xl",
                          pathname === link.href ? "text-signal" : "text-ink",
                        )}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <aside className="relative flex min-h-[320px] flex-col justify-end overflow-hidden rounded-3xl p-6">
            <CmsImage image={site.menuFeature.image} file="site" path="menuFeature.image" sizes="420px" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
            <div className="relative">
              <p className="eyebrow mb-3 text-white/70">{site.menuFeature.eyebrow}</p>
              <p className="display mb-2 text-3xl">{site.menuFeature.title}</p>
              <a href={`mailto:${site.contact.email}`} className="mb-5 block text-sm text-white/80 hover:text-signal">
                {site.contact.email}
              </a>
              <PillLink href={site.menuFeature.ctaHref}>{site.menuFeature.ctaLabel}</PillLink>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
