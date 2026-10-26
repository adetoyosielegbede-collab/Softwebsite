"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CmsImage } from "@/components/cms/cms-image";
import type { SiteContent } from "@/lib/content-types";
import { cn } from "@/lib/utils";
import { PillLink } from "./links";
import { MenuPlate } from "./menu-plate";
import { ThemeSwitcher, ThemeToggleDot } from "./theme-toggle";

const CUE_KEY = "softcom-menu-cue";

function pathOf(href: string) {
  return href.split("#")[0] || "/";
}

function isCurrent(pathname: string, href: string) {
  const path = pathOf(href);
  return path === "/" ? pathname === "/" : pathname === path;
}

export function SiteHeader({ site }: { site: SiteContent }) {
  const pathname = usePathname();
  const items = site.headerNav ?? [];
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [cue, setCue] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [focused, setFocused] = useState(false);
  const closeTimer = useRef(0);
  const expanded = open && !mobile;
  const sheet = open && mobile;
  const activeItem = items.find((item) => item.href === active && item.links && item.links.length > 0);

  const close = () => {
    window.clearTimeout(closeTimer.current);
    setOpen(false);
    setActive(null);
  };

  const onNavClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    close();
    const url = new URL(href, window.location.href);
    if (url.pathname !== window.location.pathname || !url.hash) return;
    const el = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!el) return;
    event.preventDefault();
    el.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    window.history.pushState(null, "", `${url.pathname}${url.search}${url.hash}`);
  };

  const holdOpen = () => {
    window.clearTimeout(closeTimer.current);
    setOpen(true);
  };

  const release = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(close, 280);
  };

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767.98px)");
    const apply = () => setMobile(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (open) return;
    try {
      if (sessionStorage.getItem(CUE_KEY)) return;
      sessionStorage.setItem(CUE_KEY, "1");
    } catch {
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const show = window.setTimeout(() => setCue(true), 1000);
    const hide = window.setTimeout(() => setCue(false), 1900);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, [open]);

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
        else if (delta > 6) {
          setHidden(true);
          close();
        } else if (delta < -6) setHidden(false);
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
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (active) setActive(null);
      else close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, active]);

  useEffect(() => {
    if (!sheet) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [sheet]);

  return (
    <>
      <header
        data-hidden={!open && hidden && !focused ? "" : undefined}
        className="dark pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-6 pt-4 transition-[translate,opacity] duration-300 ease-out data-hidden:-translate-y-[calc(100%+1rem)] data-hidden:opacity-0 motion-reduce:transition-none lg:px-7"
        onFocusCapture={(event) => setFocused(event.target instanceof Element && event.target.matches(":focus-visible"))}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
        }}
      >
        <div
          className={cn("relative max-w-max", !hidden && "pointer-events-auto")}
          onPointerEnter={(event) => {
            if (event.pointerType === "touch" || mobile) return;
            holdOpen();
          }}
          onPointerLeave={(event) => {
            if (event.pointerType === "touch") return;
            release();
          }}
        >
          <div className="flex items-center gap-4 rounded-full bg-black py-1.5 pr-2 pl-5 text-ink ring-1 ring-white/10">
            <Link href="/" aria-label={`${site.brand.name} home`} onClick={close} className="relative block h-6 w-[92px] shrink-0">
              <CmsImage image={site.brand.logo} file="site" path="brand.logo" className="object-contain object-left" sizes="92px" priority />
            </Link>
            <span aria-hidden className="h-6 w-px shrink-0 bg-white/10" />
            <button
              type="button"
              aria-label={sheet ? "Close menu" : "Open menu"}
              aria-expanded={sheet}
              aria-controls="mobile-menu"
              onClick={() => (open ? close() : setOpen(true))}
              className="relative grid size-10 shrink-0 place-items-center rounded-full text-ink outline-none focus-visible:ring-[3px] focus-visible:ring-signal/50 md:hidden"
            >
              <span aria-hidden className="relative block h-3 w-5">
                {[0, 1, 2].map((line) => (
                  <span
                    key={line}
                    className={cn(
                      "absolute left-0 h-[1.5px] w-5 rounded-full bg-current transition-[top,rotate,opacity] duration-300 ease-out motion-reduce:transition-none",
                      line === 0 && (sheet ? "top-[5px] rotate-45" : "top-0"),
                      line === 1 && (sheet ? "top-[5px] opacity-0" : "top-[5px]"),
                      line === 2 && (sheet ? "top-[5px] -rotate-45" : "top-[10px]"),
                    )}
                  />
                ))}
              </span>
            </button>
            <div
              id="site-menu"
              className={cn(
                "relative hidden h-10 items-center justify-between overflow-hidden px-1 transition-[width] duration-300 ease-out motion-reduce:transition-none md:flex",
                expanded ? "w-[480px]" : cue ? "w-28" : "w-14",
              )}
            >
              <button
                type="button"
                aria-label="Open menu"
                aria-expanded={open}
                aria-controls={mobile ? "mobile-menu" : "site-menu"}
                tabIndex={expanded ? -1 : 0}
                onClick={() => setOpen(true)}
                className="size-6 shrink-0 rounded-full bg-signal outline-none focus-visible:ring-[3px] focus-visible:ring-signal/50"
              />
              {expanded ? (
                <nav aria-label="Main" className="flex items-center gap-[22px] px-3">
                  {items.map((item) => {
                    const current = isCurrent(pathname, item.href) || item.links?.some((link) => isCurrent(pathname, link.href));
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onPointerEnter={() => setActive(item.links?.length ? item.href : null)}
                        onFocus={() => setActive(item.links?.length ? item.href : null)}
                        onClick={close}
                        aria-current={current ? "page" : undefined}
                        className={cn(
                          "text-xs leading-none font-medium whitespace-nowrap transition-colors hover:text-signal",
                          current || active === item.href ? "text-signal" : "text-ink",
                        )}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                  <ThemeToggleDot />
                </nav>
              ) : (
                <span
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute left-1/2 -translate-x-1/2 text-xs leading-none font-medium whitespace-nowrap text-ink/80 transition-opacity duration-300",
                    cue ? "opacity-100 delay-150" : "opacity-0",
                  )}
                >
                  Menu
                </span>
              )}
              <button
                type="button"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                aria-controls={mobile ? "mobile-menu" : "site-menu"}
                onClick={() => (open ? close() : setOpen(true))}
                className="grid size-6 shrink-0 place-items-center rounded-full bg-brand outline-none focus-visible:ring-[3px] focus-visible:ring-signal/50"
              >
                <svg
                  viewBox="0 0 9.5 9.5"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  aria-hidden
                  className={cn("size-[9.5px] text-signal transition-opacity duration-200", open ? "opacity-100" : "opacity-0")}
                >
                  <path d="M0.5 0.5L9 9" />
                  <path d="M9 0.5L0.5 9" />
                </svg>
              </button>
            </div>
          </div>

          {expanded && activeItem?.links ? (
            <div className="absolute inset-x-0 top-full pt-3">
              <div data-nav-plate-root="" className="flex h-52 overflow-hidden rounded-3xl bg-black ring-1 ring-white/10">
                <MenuPlate seed={activeItem.href === "/solutions" ? 7 : 3} className="w-44 shrink-0" />
                <ul className="ml-auto flex flex-col justify-center gap-1 pr-8 text-right">
                  {activeItem.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={(event) => onNavClick(event, link.href)}
                        className="block rounded-lg px-3 py-2 text-sm font-medium text-ink/70 transition-colors hover:text-signal"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
        </div>
      </header>

      {sheet ? (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fade-in dark fixed inset-0 z-40 flex flex-col overflow-y-auto bg-black/95 px-6 pt-28 pb-8 text-ink backdrop-blur-md md:hidden"
        >
          <nav aria-label="Main" className="flex-1">
            <ul className="flex flex-col border-b border-line">
              {items.map((item, index) => {
                const current = isCurrent(pathname, item.href);
                return (
                  <li key={item.href} className="border-t border-line" style={{ animationDelay: `${50 + index * 60}ms` }}>
                    <Link
                      href={item.href}
                      onClick={close}
                      aria-current={current ? "page" : undefined}
                      className={cn(
                        "rise-in flex items-center justify-between gap-4 py-4 font-heading text-[2rem] leading-none heading-type",
                        current ? "text-signal" : "text-ink",
                      )}
                    >
                      {item.label}
                      <span aria-hidden className="text-xl">
                        →
                      </span>
                    </Link>
                    {item.links && item.links.length > 0 ? (
                      <ul className="-mt-1 flex flex-col pb-3">
                        {item.links.map((link) => {
                          const here = isCurrent(pathname, link.href);
                          return (
                            <li key={link.href}>
                              <Link
                                href={link.href}
                                onClick={(event) => onNavClick(event, link.href)}
                                className={cn("flex min-h-10 items-center gap-3 text-sm", here ? "text-ink" : "text-ink-soft")}
                              >
                                <span aria-hidden className={cn("size-1.5 shrink-0 rounded-full", here ? "bg-signal" : "bg-white/25")} />
                                {link.label}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="mt-10 flex flex-col gap-4">
            <ThemeSwitcher className="self-start" />
            <a href={`mailto:${site.contact.email}`} className="label">
              {site.contact.email}
            </a>
            <PillLink href="/contact" className="h-12 w-full">
              Start a conversation
            </PillLink>
          </div>
        </div>
      ) : null}
    </>
  );
}
