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
  root.querySelectorAll<HTMLElement>("[data-n]").forEach((el) => {
    el.textContent = String(step);
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
  useEffect(() => {
    if (root.current) applyBoardStep(root.current, step);
  }, [step, theme]);
  return (
    <div className={className}>
      <div className="sc-di di-scale">
        <div ref={root} className={cn("di-frame", theme)} data-di-step={step}>
          <div className="di-board" dangerouslySetInnerHTML={{ __html: svgs.board }} />
        </div>
      </div>
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
      if (!trackEl || !stageEl) return;
      const nodes = [...trackEl.querySelectorAll<HTMLElement>("[data-di-copy]")];
      const release = () => {
        trackEl.style.height = "";
        stageEl.style.position = "";
        stageEl.style.top = "";
        nodes.forEach((node) => {
          node.style.opacity = "";
        });
      };
      if (!media.matches || nodes.length < 2) {
        release();
        return;
      }
      const distance = Math.round(window.innerHeight * 0.75) * nodes.length;
      trackEl.style.height = `${stageEl.offsetHeight + distance}px`;
      stageEl.style.position = "sticky";
      stageEl.style.top = "5rem";
      const stickyTop = parseFloat(getComputedStyle(stageEl).top) || 0;
      const progress = Math.max(0, Math.min(1, (stickyTop - trackEl.getBoundingClientRect().top) / distance));
      const index = Math.min(nodes.length - 1, Math.floor(progress * nodes.length + 1e-6));
      nodes.forEach((node, i) => {
        node.style.opacity = String(i === index ? 1 : 0.42);
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
    <div ref={track} className="relative mt-12 lg:mt-16">
      <div ref={stage}>
        <div className="grid w-full items-start gap-8 lg:grid-cols-[minmax(16rem,400px)_minmax(0,1fr)] lg:gap-10">
          <div>
            <h3 className="font-heading text-[2rem] leading-[1.1] heading-type lg:text-[2.5rem]">{heading}</h3>
            <p className="mt-5 text-base leading-[1.55] text-ink-soft">{intro}</p>
            <div className="mt-9 border-t border-line">
              <div>
                {shown.map((item, index) => {
                  const n = index + 1;
                  const on = n === step;
                  return (
                    <div
                      key={item.title}
                      data-di-copy=""
                      data-on={on ? "" : undefined}
                      className="relative border-b border-line py-5 transition-opacity duration-500 after:absolute after:inset-x-0 after:-bottom-px after:h-px after:origin-left after:scale-x-0 after:bg-accent-ink after:transition-transform after:duration-700 data-[on]:after:scale-x-100"
                    >
                      <p className={cn("font-mono text-xs tabular-nums", on ? "text-accent-ink" : "text-ink-faint")}>
                        {String(n).padStart(2, "0")}
                      </p>
                      <h4 className={cn("mt-2 font-heading text-2xl leading-none heading-type transition-colors duration-500", on ? "text-ink" : "text-ink-soft")}>{item.title}</h4>
                      <p className="mt-2.5 text-base leading-[1.55] text-ink-soft">{item.text}</p>
                      <InfrastructureArt step={n} theme={theme} className="mt-5 lg:hidden" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <InfrastructureArt step={step} theme={theme} />
          </div>
        </div>
      </div>
    </div>
  );
}
