"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const iconButton =
  "grid size-7 place-items-center rounded-full text-white/55 transition-colors outline-none hover:text-white focus-visible:ring-[3px] focus-visible:ring-accent-ink/50 [&_svg]:size-4";

export function ThemeSwitcher({ className }: { className?: string }) {
  const { setTheme } = useTheme();
  return (
    <div className={cn("inline-flex items-center gap-0.5 rounded-full border border-white/15 bg-neutral-800 p-0.5", className)}>
      <button type="button" aria-label="Use the light theme" onClick={() => setTheme("light")} className={cn(iconButton, "light:bg-white/15 light:text-white")}>
        <Sun />
      </button>
      <button
        type="button"
        aria-label="Use the dark theme"
        onClick={() => setTheme("dark")}
        className={cn(iconButton, "bg-white/15 text-white light:bg-transparent light:text-white/55 light:hover:text-white")}
      >
        <Moon />
      </button>
    </div>
  );
}

export function ThemeToggleDot({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <button
      type="button"
      aria-label="Switch theme"
      onClick={() => {
        const light = resolvedTheme ? resolvedTheme === "light" : document.documentElement.classList.contains("light");
        setTheme(light ? "dark" : "light");
      }}
      className={cn(
        "grid size-6 shrink-0 place-items-center rounded-full bg-white/10 text-white/70 transition-colors outline-none hover:bg-white/20 hover:text-white focus-visible:ring-[3px] focus-visible:ring-accent-ink/50 [&_svg]:size-3.5",
        className,
      )}
    >
      <Sun className="light:hidden" />
      <Moon className="hidden light:block" />
    </button>
  );
}
