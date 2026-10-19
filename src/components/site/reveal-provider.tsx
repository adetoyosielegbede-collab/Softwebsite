"use client";

import { useLayoutEffect } from "react";

export function RevealProvider() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.classList.add("reveal-ready");

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );

    const inView = (el: Element) => {
      const rect = el.getBoundingClientRect();
      const view = window.innerHeight || 0;
      return rect.bottom > 0 && rect.top < view * 0.92 && rect.height > 0;
    };

    const observeAll = () => {
      document.querySelectorAll("[data-reveal]:not(.is-visible)").forEach((el) => {
        if (inView(el)) el.classList.add("is-visible");
        else io.observe(el);
      });
    };
    observeAll();

    const mo = new MutationObserver(observeAll);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
