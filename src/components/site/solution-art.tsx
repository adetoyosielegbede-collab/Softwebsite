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
  const items = useRef<(HTMLLIElement | null)[]>([]);
  const [step, setStep] = useState(1);
  const html = svgs.board.replace("th-glass", theme);

  useEffect(() => {
    root.current?.querySelectorAll<HTMLElement>("[data-board]").forEach((board) => applyBoardStep(board, step));
  }, [step, theme, html]);

  useEffect(() => {
    const nodes = items.current.filter((node): node is HTMLLIElement => Boolean(node));
    if (!nodes.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setStep(Number((entry.target as HTMLElement).dataset.index) + 1);
        }
      },
      { rootMargin: "-42% 0px -42% 0px" },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [steps.length]);

  const board = () => (
    <div data-board="" className="sc-di mx-auto w-full max-w-[640px]" dangerouslySetInnerHTML={{ __html: html }} />
  );

  return (
    <div ref={root}>
      <div className="sticky top-16 z-10 bg-background py-2 lg:hidden">{board()}</div>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-14">
      <ol>
        {steps.slice(0, 3).map((item, index) => (
          <li
            key={item.title}
            ref={(node) => {
              items.current[index] = node;
            }}
            data-index={index}
            className="flex min-h-[70vh] flex-col justify-center py-10 lg:min-h-[76vh] lg:py-0"
          >
            <p className="label text-ink-faint">
              {String(index + 1).padStart(2, "0")} — {item.label}
            </p>
            <h3 className={cn("text-title mt-3 transition-colors duration-500", index + 1 === step ? "text-ink" : "lg:text-ink-faint")}>
              {item.title}
            </h3>
            <p className={cn("text-body mt-3 max-w-md transition-colors duration-500", index + 1 === step ? "text-ink-soft" : "lg:text-ink-faint")}>
              {item.text}
            </p>
          </li>
        ))}
      </ol>
      <div className="hidden lg:block">
        <div className="sticky top-[max(5.5rem,calc(50vh-200px))]">
          {board()}
        </div>
      </div>
      </div>
    </div>
  );
}
