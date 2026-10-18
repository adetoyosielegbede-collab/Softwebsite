"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, ImageUp, Loader2, LogOut, PencilLine, SlidersHorizontal } from "lucide-react";
import { fileForPathname, patchImage, uploadImage } from "@/lib/cms/client";
import { cn } from "@/lib/utils";

type Target = { el: HTMLElement; file: string; path: string; rect: DOMRect; empty: boolean };

function findSlot(x: number, y: number, toolbar: HTMLElement | null): HTMLElement | null {
  for (const el of document.elementsFromPoint(x, y)) {
    if (toolbar?.contains(el)) return null;
    if (el instanceof HTMLElement && el.dataset.cmsPath && el.dataset.cmsFile) return el;
  }
  return null;
}

export function EditOverlay() {
  const router = useRouter();
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [outline, setOutline] = useState(false);
  const [target, setTarget] = useState<Target | null>(null);
  const [busy, setBusy] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pending = useRef<Target | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/cms/session", { cache: "no-store" })
      .then((r) => r.json())
      .then((s: { authenticated: boolean }) => !cancelled && setEnabled(s.authenticated))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const active = enabled && !hidden;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("cms-editing", active);
    root.classList.toggle("cms-outline", active && outline);
    return () => root.classList.remove("cms-editing", "cms-outline");
  }, [active, outline]);

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (busy) return;
        if (toolbarRef.current?.contains(e.target as Node)) return;
        const el = findSlot(e.clientX, e.clientY, toolbarRef.current);
        if (!el) {
          setTarget(null);
          return;
        }
        const rect = el.getBoundingClientRect();
        setTarget((prev) =>
          prev?.el === el && prev.rect.top === rect.top && prev.rect.left === rect.left
            ? prev
            : { el, rect, file: el.dataset.cmsFile!, path: el.dataset.cmsPath!, empty: "cmsEmpty" in el.dataset },
        );
      });
    };
    const onScroll = () => setTarget(null);
    document.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, [active, busy]);

  const startReplace = useCallback(() => {
    if (!target) return;
    pending.current = target;
    inputRef.current?.click();
  }, [target]);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    const slot = pending.current;
    if (!file || !slot) return;
    setBusy(true);
    const id = toast.loading("Uploading image…");
    try {
      const src = await uploadImage(file);
      const currentAlt = slot.el instanceof HTMLImageElement ? slot.el.alt : "";
      await patchImage(slot.file, slot.path, { src, alt: currentAlt });
      toast.success("Image replaced", { id, description: `${slot.file} › ${slot.path}` });
      setTarget(null);
      router.refresh();
    } catch (err) {
      toast.error("Could not replace image", { id, description: err instanceof Error ? err.message : String(err) });
    } finally {
      setBusy(false);
    }
  };

  const logout = async () => {
    await fetch("/api/cms/logout", { method: "POST" });
    setEnabled(false);
    toast("Signed out of editing mode");
  };

  if (!enabled) return null;

  const editHref = (file: string, path?: string) =>
    `/admin?file=${encodeURIComponent(file)}${path ? `&path=${encodeURIComponent(path)}` : ""}`;

  const toolbarStyle = target
    ? {
        top: Math.max(8, target.rect.top + 10),
        left: Math.min(window.innerWidth - 8, Math.max(8, target.rect.right - 10)),
      }
    : undefined;

  return (
    <>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onFile} />

      {active && target && (
        <>
          <div
            aria-hidden
            className="pointer-events-none fixed z-[60] rounded-md ring-2 ring-signal ring-offset-0 transition-all"
            style={{ top: target.rect.top, left: target.rect.left, width: target.rect.width, height: target.rect.height }}
          />
          <div
            ref={toolbarRef}
            className="fixed z-[61] flex -translate-x-full items-center gap-1 rounded-full border border-white/15 bg-black/90 p-1 text-xs text-white shadow-xl backdrop-blur"
            style={toolbarStyle}
          >
            <button
              type="button"
              onClick={startReplace}
              disabled={busy}
              className="inline-flex h-7 items-center gap-1.5 rounded-full bg-signal px-3 font-medium text-black hover:bg-white disabled:opacity-60"
            >
              {busy ? <Loader2 className="size-3.5 animate-spin" /> : <ImageUp className="size-3.5" />}
              {target.empty ? "Add image" : "Replace"}
            </button>
            <Link
              href={editHref(target.file, target.path)}
              className="inline-flex h-7 items-center gap-1.5 rounded-full px-3 hover:bg-white/10"
              title="Alt text, focal point and more"
            >
              <SlidersHorizontal className="size-3.5" />
              Adjust
            </Link>
          </div>
        </>
      )}

      <div
        className={cn(
          "fixed bottom-4 left-4 z-[62] flex items-center gap-1 rounded-full border border-white/15 bg-black/90 p-1 pl-3 text-xs text-white shadow-xl backdrop-blur",
          hidden && "opacity-70",
        )}
      >
        <span className="mr-1 flex items-center gap-2">
          <span className={cn("size-2 rounded-full", active ? "bg-signal" : "bg-ink-faint")} />
          {active ? "Editing — hover an image to replace it" : "Editing paused"}
        </span>
        {active && (
          <button
            type="button"
            onClick={() => setOutline((v) => !v)}
            className={cn("h-7 rounded-full px-3 hover:bg-white/10", outline && "bg-white/10")}
            title="Outline every editable image on this page"
          >
            {outline ? "Hide outlines" : "Show image slots"}
          </button>
        )}
        <Link
          href={editHref(fileForPathname(pathname))}
          className="inline-flex h-7 items-center gap-1.5 rounded-full px-3 hover:bg-white/10"
        >
          <PencilLine className="size-3.5" /> Edit page
        </Link>
        <button
          type="button"
          onClick={() => setHidden((v) => !v)}
          className="grid size-7 place-items-center rounded-full hover:bg-white/10"
          aria-label={hidden ? "Resume editing" : "Pause editing"}
          title={hidden ? "Resume editing" : "Preview without edit controls"}
        >
          {hidden ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
        </button>
        <button
          type="button"
          onClick={logout}
          className="grid size-7 place-items-center rounded-full hover:bg-white/10"
          aria-label="Sign out"
          title="Sign out"
        >
          <LogOut className="size-3.5" />
        </button>
      </div>
    </>
  );
}
