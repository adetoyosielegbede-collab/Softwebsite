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

export function DigitalInfrastructureBoard({
  number,
  eyebrow,
  heading,
  intro,
  steps,
}: {
  number: string;
  eyebrow: string;
  heading: string;
  intro: string;
  steps: { label: string; title: string; text: string }[];
}) {
  const theme = useArtTheme();
  const root = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(1);
  const [auto, setAuto] = useState(true);
  const html = svgs.board.replace("th-glass", theme);
  const shown = steps.slice(0, 3);

  useEffect(() => {
    if (root.current) applyBoardStep(root.current, step);
  }, [step, theme, html]);

  useEffect(() => {
    if (!auto) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const id = window.setInterval(() => setStep((current) => (current % shown.length) + 1), 3500);
    return () => window.clearInterval(id);
  }, [auto, shown.length]);

  return (
    <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-x-14 xl:grid-cols-[minmax(0,1.42fr)_minmax(0,0.72fr)] xl:gap-x-20">
      <div className="order-2 rounded-[1.75rem] bg-surface px-3 py-6 sm:px-5 sm:py-8 lg:order-1 lg:px-6 lg:py-10">
        <div ref={root} className="sc-di" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
      <div className="order-1 lg:order-2 lg:pt-3">
        <p className="eyebrow">
          <span className="mr-3 tabular-nums">{number}</span>
          {eyebrow}
        </p>
        <h2 className="text-headline mt-5">{heading}</h2>
        <p className="text-body mt-5 max-w-[42ch] leading-normal text-ink-soft">{intro}</p>
        <div className="mt-8 border-t border-line">
          {shown.map((item, index) => {
            const n = index + 1;
            const on = n === step;
            return (
              <button
                key={item.title}
                type="button"
                aria-pressed={on}
                onClick={() => {
                  setAuto(false);
                  setStep(n);
                }}
                className={cn(
                  "block w-full border-b py-6 text-left transition-colors",
                  on ? "border-accent-ink" : "border-line",
                )}
              >
                <span className={cn("font-mono text-xs tabular-nums", on ? "text-accent-ink" : "text-ink-faint")}>
                  {String(n).padStart(2, "0")}
                </span>
                <span className="mt-2 block font-heading text-2xl leading-none heading-type">{item.title}</span>
                <span className="text-body mt-3 block leading-normal text-ink-soft">{item.text}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
