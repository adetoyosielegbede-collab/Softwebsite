import { cn } from "@/lib/utils";

/** "Swipe →" label for rows that scroll sideways on touch screens. */
export function SwipeCue({ hidden, className }: { hidden?: boolean; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "label inline-flex shrink-0 items-center gap-2 text-ink-soft transition-opacity duration-500",
        hidden && "opacity-0",
        className,
      )}
    >
      Swipe
      <span className="swipe-arrow inline-block">→</span>
    </span>
  );
}
