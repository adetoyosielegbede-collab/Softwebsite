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

function useArtTheme() {
  const [theme, setTheme] = useState<"th-glass" | "th-dark">("th-glass");
  useEffect(() => {
    const root = document.documentElement;
    const read = () => setTheme(root.classList.contains("dark") ? "th-dark" : "th-glass");
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return theme;
}

export function SolutionArt({ id, className }: { id: SolutionArtId; className?: string }) {
  const theme = useArtTheme();
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
  steps,
}: {
  steps: { label: string; title: string; text: string }[];
}) {
  const theme = useArtTheme();
  const root = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(1);
  const [auto, setAuto] = useState(true);
  const html = svgs.board.replace("th-glass", theme);
  const active = steps[step - 1];

  useEffect(() => {
    if (root.current) applyBoardStep(root.current, step);
  }, [step, theme, html]);

  useEffect(() => {
    if (!auto) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const id = window.setInterval(() => setStep((current) => (current % 3) + 1), 3500);
    return () => window.clearInterval(id);
  }, [auto]);

  return (
    <div>
      <div ref={root} className="sc-di" dangerouslySetInnerHTML={{ __html: html }} />
      <div className="mt-6 flex flex-wrap gap-2">
        {steps.slice(0, 3).map((item, index) => {
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
                "rounded-full px-3 py-1 text-[11px] transition-colors",
                on ? "bg-ink text-paper" : "bg-surface-raised text-ink-soft hover:text-ink",
              )}
            >
              {String(n).padStart(2, "0")} {item.label}
            </button>
          );
        })}
      </div>
      {active ? (
        <div className="mt-6 max-w-xl">
          <h3 className="font-heading text-xl heading-type">{active.title}</h3>
          <p className="text-body mt-3 text-ink-soft">{active.text}</p>
        </div>
      ) : null}
    </div>
  );
}
