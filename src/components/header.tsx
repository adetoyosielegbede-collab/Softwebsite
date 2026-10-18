"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Wordmark } from "./wordmark";

const menu = [
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
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Alumni", href: "/alumni" },
      { label: "Insights", href: "/insights" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
        <div className="pointer-events-auto flex items-center gap-3 rounded-full bg-black/85 py-1.5 pr-1.5 pl-4 text-ink ring-1 ring-white/10 backdrop-blur-md">
          <Link href="/" aria-label="Softcom home" className="group" onClick={() => setOpen(false)}>
            <Wordmark />
          </Link>
          <span className="size-2.5 rounded-full bg-accent" aria-hidden />
          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded-full bg-signal px-3 text-sm font-medium text-white"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="size-2 rounded-full bg-white" aria-hidden />
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>
      {open ? (
        <div className="fixed inset-0 z-40 overflow-y-auto bg-canvas/96 px-6 pt-28 pb-16 backdrop-blur-xl md:px-12">
          <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-3">
            {menu.map((group) => (
              <div key={group.title}>
                <p className="kicker">{group.title}</p>
                <ul className="mt-5 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="display text-4xl hover:text-accent md:text-5xl"
                        onClick={() => setOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}
