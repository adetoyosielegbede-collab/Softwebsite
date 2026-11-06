"use client";

import { useEffect, useRef } from "react";
import { USEFORMS_PAGE_HTML } from "@/components/site/useforms-page-html";
import "@/components/site/useforms-page.css";

function fitUIFrames(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>(".uifit").forEach((frame) => {
    const width = Number(frame.getAttribute("data-w") || 0);
    const height = Number(frame.getAttribute("data-h") || 0);
    const child = frame.firstElementChild as HTMLElement | null;
    if (!width || !height || !child) return;
    const scale = Math.min(1, frame.clientWidth / width);
    frame.style.height = `${Math.round(height * scale)}px`;
    child.style.transform = `scale(${scale})`;
    if (scale < 1 || frame.hasAttribute("data-center")) {
      child.style.left = `${Math.max(0, (frame.clientWidth - width * scale) / 2)}px`;
    }
  });
}

/** Full Useforms product page replica of softcom-useforms.html. */
export function UseformsStory() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const run = () => fitUIFrames(root);
    run();
    window.addEventListener("resize", run);
    const fonts = document.fonts;
    fonts?.ready.then(run).catch(() => undefined);
    const ro = new ResizeObserver(run);
    root.querySelectorAll(".uifit").forEach((frame) => ro.observe(frame));
    return () => {
      window.removeEventListener("resize", run);
      ro.disconnect();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="useforms-page"
      // Static markup from the Softcom Useforms HTML brief; UI frames are intentional HTML.
      dangerouslySetInnerHTML={{ __html: USEFORMS_PAGE_HTML }}
    />
  );
}
