"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import svgs from "./solution-svgs.json";
import "./solution-illustrations.css";

export type SolutionArtId = keyof typeof svgs;

const SCOPE = {
  board: "sc-di",
  audit: "sc-ai",
  financial: "sc-ai",
  market: "sc-ai",
  regulatory: "sc-ai",
  societal: "sc-ai",
  field: "sc-pi",
  build: "sc-bi",
  rails: "sc-bi",
} as const;

function useArtTheme(palette: "glass" | "light" = "glass") {
  const light = palette === "light" ? "th-light" : "th-glass";
  const [theme, setTheme] = useState<"th-glass" | "th-light" | "th-dark">(light);
  useEffect(() => {
    const root = document.documentElement;
    const read = () => setTheme(root.classList.contains("dark") ? "th-dark" : light);
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, [light]);
  return theme;
}

export function SolutionArt({
  id,
  className,
  palette = "glass",
}: {
  id: SolutionArtId;
  className?: string;
  palette?: "glass" | "light";
}) {
  const theme = useArtTheme(palette);
  const html = svgs[id].replace("th-glass", theme);
  return (
    <div className={cn(SCOPE[id], className)} dangerouslySetInnerHTML={{ __html: html }} />
  );
}

function applyBoardStep(root: HTMLElement, step: number) {
  root.querySelectorAll<HTMLElement>("[data-k]").forEach((el) => {
    const key = el.getAttribute("data-k") ?? "";
    const kind = key.charAt(0);
    const on = Number(key.slice(1)) === step;
    el.classList.remove("on", "off", "hide");
    if (kind === "d" || kind === "r") el.classList.add(on ? "on" : "off");
    else if (kind === "v") {
      if (!on) el.classList.add("hide");
    } else if (on) el.classList.add("on");
  });
}

function InfrastructureArt({
  step,
  theme,
  className,
}: {
  step: number;
  theme: "th-glass" | "th-light" | "th-dark";
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const html = svgs.board.replace("th-glass", theme);
  useEffect(() => {
    if (root.current) applyBoardStep(root.current, step);
  }, [step, theme, html]);
  return (
    <div className={cn("rounded-[1.75rem] bg-surface px-2 py-4 sm:px-4 sm:py-5 lg:px-5 lg:py-6", className)}>
      <div ref={root} className="sc-di" data-di-step={step} dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

export function DigitalInfrastructureBoard({
  heading,
  intro,
  steps,
}: {
  heading: string;
  intro: string;
  steps: { label: string; title: string; text: string }[];
}) {
  const theme = useArtTheme("light");
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(1);
  const shown = steps.slice(0, 3);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    let frameId = 0;
    let current = 1;

    const apply = () => {
      frameId = 0;
      const trackEl = track.current;
      const stageEl = stage.current;
      const frameEl = frame.current;
      const copyEl = copy.current;
      if (!trackEl || !stageEl || !frameEl || !copyEl) return;
      const nodes = [...copyEl.children] as HTMLElement[];
      const scrub = media.matches && nodes.length > 1;

      if (!scrub) {
        trackEl.style.height = "";
        stageEl.style.position = "";
        stageEl.style.top = "";
        stageEl.style.height = "";
        stageEl.style.display = "";
        stageEl.style.alignItems = "";
        frameEl.style.height = "";
        frameEl.style.overflow = "";
        copyEl.style.transform = "";
        nodes.forEach((node) => {
          node.style.height = "";
          node.style.opacity = "";
        });
        return;
      }

      stageEl.style.position = "";
      stageEl.style.top = "";
      stageEl.style.height = "";
      stageEl.style.display = "";
      stageEl.style.alignItems = "";
      nodes.forEach((node) => {
        node.style.height = "";
      });
      const height = Math.max(...nodes.map((node) => node.offsetHeight));
      nodes.forEach((node) => {
        node.style.height = `${height}px`;
      });
      frameEl.style.height = `${height}px`;
      frameEl.style.overflow = "hidden";
      const distance = Math.round(window.innerHeight * 0.62) * (nodes.length - 1);
      const stageHeight = stageEl.offsetHeight;
      trackEl.style.height = `${stageHeight + distance}px`;
      stageEl.style.position = "sticky";
      stageEl.style.top = "5rem";
      const stickyTop = parseFloat(getComputedStyle(stageEl).top) || 0;
      const progress = Math.max(0, Math.min(1, (stickyTop - trackEl.getBoundingClientRect().top) / Math.max(1, distance)));
      const exact = progress * (nodes.length - 1);
      const index = Math.round(exact);
      copyEl.style.transform = `translate3d(0, ${(-exact * height).toFixed(2)}px, 0)`;
      nodes.forEach((node, i) => {
        const distanceFrom = Math.abs(i - exact);
        node.style.opacity = String(1 - Math.min(1, distanceFrom) * 0.62);
      });
      const next = index + 1;
      if (current !== next) {
        current = next;
        setStep(next);
      }
    };

    const schedule = () => {
      if (!frameId) frameId = window.requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    media.addEventListener("change", schedule);
    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      media.removeEventListener("change", schedule);
    };
  }, [shown.length]);

  return (
    <div ref={track} className="relative mt-6 lg:mt-8">
      <div ref={stage}>
        <div className="grid w-full items-start gap-8 lg:grid-cols-[minmax(0,0.3fr)_minmax(0,0.7fr)] lg:gap-10 xl:gap-14">
          <div>
            <h3 className="font-heading text-[1.65rem] leading-[1.08] heading-type sm:text-[1.85rem]">{heading}</h3>
            <p className="mt-3 text-sm leading-normal text-ink-soft sm:text-[0.9375rem]">{intro}</p>
            <div ref={frame} className="mt-5 border-t border-line">
              <div ref={copy}>
                {shown.map((item, index) => {
                  const n = index + 1;
                  const on = n === step;
                  return (
                    <div key={item.title} className={cn("border-b py-4", on ? "border-accent-ink" : "border-line")}>
                      <p className={cn("font-mono text-xs tabular-nums", on ? "text-accent-ink" : "text-ink-faint")}>
                        {String(n).padStart(2, "0")}
                      </p>
                      <h4 className="mt-1.5 font-heading text-lg leading-none heading-type">{item.title}</h4>
                      <p className="mt-2 text-sm leading-normal text-ink-soft">{item.text}</p>
                      <InfrastructureArt step={n} theme={theme} className="mt-5 lg:hidden" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="lg:sticky lg:top-28">
              <InfrastructureArt step={step} theme={theme} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
