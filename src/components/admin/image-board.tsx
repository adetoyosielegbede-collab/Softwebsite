"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ExternalLink, ImagePlus, Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { patchImage, uploadImage } from "@/lib/cms/client";
import { humanize, type ImageRef } from "@/lib/cms/paths";

export type MediaSlot = { file: string; label: string; href?: string; images: ImageRef[] };

function slotLabel(path: string) {
  return path
    .split(".")
    .filter((part) => !/^\d+$/.test(part))
    .map(humanize)
    .join(" · ");
}

export function ImageBoard({ slots, onChanged }: { slots: MediaSlot[]; onChanged: () => void }) {
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return slots;
    return slots
      .map((group) => ({
        ...group,
        images: group.images.filter(
          (img) =>
            group.label.toLowerCase().includes(q) ||
            img.path.toLowerCase().includes(q) ||
            img.image.alt.toLowerCase().includes(q) ||
            img.image.src.toLowerCase().includes(q) ||
            (img.name ?? "").toLowerCase().includes(q),
        ),
      }))
      .filter((group) => group.images.length > 0);
  }, [slots, query]);

  async function replace(file: string, image: ImageRef, upload: File) {
    const key = `${file}:${image.path}`;
    setBusy(key);
    try {
      const src = await uploadImage(upload);
      await patchImage(file, image.path, { src, alt: image.image.alt });
      toast.success("Image updated on the live site");
      onChanged();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(null);
    }
  }

  async function saveAlt(file: string, image: ImageRef, alt: string) {
    if (alt === image.image.alt) return;
    try {
      await patchImage(file, image.path, { src: image.image.src, alt });
      toast.success("Alt text saved");
      onChanged();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save alt text");
    }
  }

  const total = filtered.reduce((n, g) => n + g.images.length, 0);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="display text-3xl">Images</h1>
          <p className="mt-1 text-sm text-ink-soft">{total} image slots across the site. Replace any of them here.</p>
        </div>
        <label className="flex h-10 items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm">
          <Search className="size-4 text-ink-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search images"
            className="w-44 bg-transparent outline-none placeholder:text-ink-faint"
          />
        </label>
      </div>

      <div className="space-y-10">
        {filtered.map((group) => (
          <section key={group.file}>
            <div className="mb-4 flex items-baseline justify-between gap-4">
              <h2 className="text-sm font-medium">{group.label}</h2>
              {group.href && (
                <Link href={group.href} target="_blank" className="inline-flex items-center gap-1 text-xs text-ink-faint hover:text-signal">
                  View page <ExternalLink className="size-3" />
                </Link>
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {group.images.map((image) => {
                const key = `${group.file}:${image.path}`;
                return (
                  <article key={key} className="overflow-hidden rounded-2xl border border-line bg-surface-raised">
                    <label className="group relative block aspect-[16/9] cursor-pointer bg-surface">
                      {image.image.src ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={image.image.src} alt="" className="size-full object-contain" />
                      ) : (
                        <span className="grid size-full place-items-center text-xs text-ink-faint">Empty slot</span>
                      )}
                      <span className="absolute inset-0 grid place-items-center bg-black/55 text-xs font-medium opacity-0 transition-opacity group-hover:opacity-100">
                        {busy === key ? <Loader2 className="size-4 animate-spin" /> : image.image.src ? "Replace image" : "Add image"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        disabled={busy === key}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          e.target.value = "";
                          if (file) void replace(group.file, image, file);
                        }}
                      />
                      {!image.image.src && (
                        <ImagePlus className="pointer-events-none absolute top-3 right-3 size-4 text-signal" />
                      )}
                    </label>
                    <div className="space-y-2 p-3">
                      <p className="truncate text-xs" title={image.path}>
                        {image.name || slotLabel(image.path) || "Image"}
                      </p>
                      <input
                        defaultValue={image.image.alt}
                        key={image.image.alt}
                        placeholder="Alt text"
                        onBlur={(e) => void saveAlt(group.file, image, e.target.value)}
                        className="h-8 w-full rounded-lg border border-line bg-paper px-2 text-xs outline-none focus:border-signal"
                      />
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
        {filtered.length === 0 && <p className="text-sm text-ink-soft">No images match “{query}”.</p>}
      </div>
    </div>
  );
}
