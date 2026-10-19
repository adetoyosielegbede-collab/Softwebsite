"use client";

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { useEffect } from "react";

function ThemeColor() {
  const { resolvedTheme } = useTheme();
  useEffect(() => {
    const color = resolvedTheme === "light" ? "#f6f5f1" : "#0a0a0a";
    document.querySelectorAll('meta[name="theme-color"]').forEach((node) => node.setAttribute("content", color));
  }, [resolvedTheme]);
  return null;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      enableColorScheme
      themes={["light", "dark"]}
      storageKey="theme"
    >
      <ThemeColor />
      {children}
    </NextThemesProvider>
  );
}
