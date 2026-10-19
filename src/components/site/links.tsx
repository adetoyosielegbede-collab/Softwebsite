import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type LinkProps = { href: string; children: React.ReactNode; className?: string };

function isExternal(href: string) {
  return /^(https?:|mailto:|tel:)/.test(href);
}

export function SmartLink({ href, children, className }: LinkProps) {
  if (isExternal(href)) {
    return (
      <a href={href} className={className} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function PillLink({ href, children, className, tone = "light" }: LinkProps & { tone?: "light" | "dark" }) {
  if (!href || !children) return null;
  return (
    <SmartLink
      href={href}
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none",
        tone === "light" ? "bg-ink text-paper hover:bg-signal hover:text-black" : "bg-black text-white hover:bg-surface-high",
        className,
      )}
    >
      {children}
    </SmartLink>
  );
}

export function ArrowLink({ href, children, className }: LinkProps) {
  if (!href || !children) return null;
  return (
    <SmartLink
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 text-sm font-medium text-ink transition-colors hover:text-accent-ink",
        className,
      )}
    >
      {children}
      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
    </SmartLink>
  );
}
