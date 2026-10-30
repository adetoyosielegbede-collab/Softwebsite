"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ImagePlus, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { saveContent, uploadImage } from "@/lib/cms/client";
import { humanize, isImageValue } from "@/lib/cms/paths";
import { FIELD_OPTIONS, FONT_FAMILIES, type FontFamilyName } from "@/lib/typography";
import { cn } from "@/lib/utils";

type Props = {
  file: string;
  data: unknown;
  focusPath?: string;
  onSaved: (data: unknown) => void;
};

function blankLike(sample: unknown): unknown {
  if (isImageValue(sample)) return { src: "", alt: "" };
  if (typeof sample === "string") return "";
  if (typeof sample === "number") return 0;
  if (typeof sample === "boolean") return false;
  if (Array.isArray(sample)) return sample.length ? [blankLike(sample[0])] : [];
  if (sample && typeof sample === "object") {
    return Object.fromEntries(Object.entries(sample).map(([k, v]) => [k, blankLike(v)]));
  }
  return "";
}

function Field({
  value,
  path,
  label,
  onChange,
  focusPath,
  file,
}: {
  value: unknown;
  path: string;
  label: string;
  onChange: (next: unknown) => void;
  focusPath?: string;
  file?: string;
}) {
  const focused = focusPath && (focusPath === path || focusPath.startsWith(`${path}.`));

  if (isImageValue(value)) {
    return <ImageField image={value} path={path} label={label} focused={focusPath === path} onChange={onChange} />;
  }

  if (typeof value === "string" && (path === "color" || path.endsWith(".color"))) {
    return (
      <label className="block">
        <span className="mb-1.5 block text-xs text-ink-soft">{label}</span>
        <span className="flex items-center gap-3">
          <input
            type="color"
            value={/^#[0-9a-fA-F]{6}$/.test(value) ? value : "#2a2b30"}
            onChange={(e) => onChange(e.target.value)}
            aria-label={`${label} picker`}
            className="h-10 w-14 cursor-pointer rounded-xl border border-line bg-paper p-1"
          />
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#141416"
            spellCheck={false}
            className="h-10 w-full rounded-xl border border-line bg-paper px-3 font-mono text-sm outline-none focus:border-signal"
          />
        </span>
      </label>
    );
  }

  const options = FIELD_OPTIONS[path];
  if (typeof value === "string" && options) {
    return (
      <label className="block">
        <span className="mb-1.5 block text-xs text-ink-soft">{label}</span>
        <select
          value={options.includes(value) ? value : options[0]}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-full rounded-xl border border-line bg-paper px-3 text-sm outline-none focus:border-signal"
          style={path.endsWith("Font") ? { fontFamily: FONT_FAMILIES[value as FontFamilyName] } : undefined}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (typeof value === "string") {
    const long = value.length > 90 || value.includes("\n");
    const input = long ? (
      <textarea
        value={value}
        rows={Math.min(10, Math.max(3, value.split("\n").length + 1))}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm leading-relaxed outline-none focus:border-signal"
      />
    ) : (
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-xl border border-line bg-paper px-3 text-sm outline-none focus:border-signal"
      />
    );
    return (
      <label className="block">
        <span className="mb-1.5 block text-xs text-ink-soft">{label}</span>
        {input}
      </label>
    );
  }

  if (typeof value === "boolean") {
    const homepageFeature = file === "posts" && path.endsWith(".featured");
    return (
      <label className="flex items-center justify-between gap-4 rounded-xl border border-line bg-paper px-3 py-2.5 text-sm">
        <span>
          {homepageFeature ? "Featured on the homepage" : label}
          {homepageFeature ? (
            <span className="mt-1 block text-xs font-normal text-ink-faint">Two at a time. Only a published insight appears on the homepage.</span>
          ) : null}
        </span>
        <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} className="size-4 accent-signal" />
      </label>
    );
  }

  if (typeof value === "number") {
    return (
      <label className="block">
        <span className="mb-1.5 block text-xs text-ink-soft">{label}</span>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-10 w-full rounded-xl border border-line bg-paper px-3 text-sm outline-none focus:border-signal"
        />
      </label>
    );
  }

  if (Array.isArray(value)) {
    const strings = value.every((item) => typeof item === "string");
    return (
      <fieldset className={cn("rounded-2xl border border-line p-4", focused && "border-signal/60")}>
        <legend className="px-1 text-xs tracking-wide text-ink-soft uppercase">{label}</legend>
        <div className="space-y-3">
          {value.map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="min-w-0 flex-1">
                {strings ? (
                  <input
                    value={item as string}
                    onChange={(e) => onChange(value.map((v, j) => (j === i ? e.target.value : v)))}
                    className="h-10 w-full rounded-xl border border-line bg-paper px-3 text-sm outline-none focus:border-signal"
                  />
                ) : (
                  <Field
                    value={item}
                    path={`${path}.${i}`}
                    label={`#${i + 1}`}
                    focusPath={focusPath}
                    file={file}
                    onChange={(next) => onChange(value.map((v, j) => (j === i ? next : v)))}
                  />
                )}
              </div>
              <div className="flex shrink-0 flex-col gap-1">
                <IconButton label="Move up" disabled={i === 0} onClick={() => onChange(move(value, i, -1))}>
                  <ArrowUp className="size-3.5" />
                </IconButton>
                <IconButton label="Move down" disabled={i === value.length - 1} onClick={() => onChange(move(value, i, 1))}>
                  <ArrowDown className="size-3.5" />
                </IconButton>
                <IconButton label="Remove" onClick={() => onChange(value.filter((_, j) => j !== i))}>
                  <Trash2 className="size-3.5" />
                </IconButton>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => onChange([...value, value.length ? blankLike(value[0]) : ""])}
          className="mt-3 inline-flex h-8 items-center gap-1.5 rounded-full bg-white/5 px-3 text-xs text-ink-soft ring-1 ring-line hover:text-ink"
        >
          <Plus className="size-3.5" /> Add {label.toLowerCase().replace(/s$/, "")}
        </button>
      </fieldset>
    );
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const entries = Object.entries(record);
    const titled = typeof record.title === "string" ? record.title.trim() : "";
    return (
      <fieldset id={path ? `field-${cssId(path)}` : undefined} className={cn("rounded-2xl border border-line p-4", focused && "border-signal/50")}>
        <legend className="px-1 text-xs tracking-wide text-ink-soft uppercase">{titled || label}</legend>
        <div className="grid gap-4">
          {entries.map(([key, child]) => (
            <Field
              key={key}
              value={child}
              path={path ? `${path}.${key}` : key}
              label={key === "image" && titled ? titled : humanize(key)}
              focusPath={focusPath}
              file={file}
              onChange={(next) => onChange({ ...record, [key]: next })}
            />
          ))}
        </div>
      </fieldset>
    );
  }

  return null;
}

function ImageField({
  image,
  path,
  label,
  focused,
  onChange,
}: {
  image: { src: string; alt: string; position?: string };
  path: string;
  label: string;
  focused: boolean;
  onChange: (next: unknown) => void;
}) {
  const [busy, setBusy] = useState(false);

  async function onFile(file: File) {
    setBusy(true);
    try {
      const src = await uploadImage(file);
      onChange({ ...image, src, alt: image.alt || file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ") });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div id={`field-${cssId(path)}`} className={cn("rounded-2xl border border-line bg-paper p-3", focused && "border-signal ring-1 ring-signal")}>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-xs text-ink-soft">{label}</span>
        <span className="truncate font-mono text-[10px] text-ink-faint">{path}</span>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="group relative grid h-36 w-full shrink-0 cursor-pointer place-items-center overflow-hidden rounded-xl bg-surface sm:w-56">
          {image.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image.src} alt="" className={cn("size-full", path.includes("logo") || path.includes("figures") ? "object-contain p-2" : "object-cover")} />
          ) : (
            <span className="flex flex-col items-center gap-1 text-xs text-ink-faint">
              <ImagePlus className="size-5" /> No image
            </span>
          )}
          <span className="absolute inset-0 grid place-items-center bg-black/60 text-xs font-medium opacity-0 transition-opacity group-hover:opacity-100">
            {busy ? <Loader2 className="size-4 animate-spin" /> : image.src ? "Replace" : "Upload"}
          </span>
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={busy}
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (file) void onFile(file);
            }}
          />
        </label>
        <div className="grid flex-1 content-start gap-2">
          <input
            value={image.alt}
            placeholder="Alt text — what the image shows"
            onChange={(e) => onChange({ ...image, alt: e.target.value })}
            className="h-10 rounded-xl border border-line bg-surface px-3 text-sm outline-none focus:border-signal"
          />
          <input
            value={image.position ?? ""}
            placeholder="Focal point, e.g. 50% 30% (optional)"
            onChange={(e) => onChange({ ...image, position: e.target.value })}
            className="h-10 rounded-xl border border-line bg-surface px-3 text-sm outline-none focus:border-signal"
          />
          {image.src && (
            <button type="button" onClick={() => onChange({ ...image, src: "" })} className="justify-self-start text-xs text-ink-faint hover:text-red-400">
              Remove image
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function IconButton({ children, label, disabled, onClick }: { children: React.ReactNode; label: string; disabled?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-7 place-items-center rounded-lg text-ink-faint hover:bg-white/10 hover:text-ink disabled:opacity-30"
    >
      {children}
    </button>
  );
}

function move<T>(list: T[], index: number, dir: -1 | 1): T[] {
  const next = list.slice();
  const [item] = next.splice(index, 1);
  next.splice(index + dir, 0, item);
  return next;
}

function cssId(path: string) {
  return path.replace(/[^a-z0-9]+/gi, "-");
}

function featuredCount(data: unknown) {
  const items = (data as { items?: { featured?: boolean }[] } | null)?.items;
  if (!Array.isArray(items)) return 0;
  return items.filter((item) => item?.featured).length;
}

export function ContentEditor({ file, data, focusPath, onSaved }: Props) {
  const [draft, setDraft] = useState(data);
  const [saving, setSaving] = useState(false);
  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(data), [draft, data]);

  useEffect(() => {
    if (!focusPath) return;
    document.getElementById(`field-${cssId(focusPath)}`)?.scrollIntoView({ block: "center" });
  }, [focusPath, file]);

  async function save() {
    setSaving(true);
    try {
      await saveContent(file, draft);
      onSaved(draft);
      toast.success("Saved", { description: "The live site has been updated." });
    } catch (err) {
      toast.error("Could not save", { description: err instanceof Error ? err.message : String(err) });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="sticky top-0 z-10 -mx-1 mb-6 flex items-center justify-between gap-4 border-b border-line bg-paper/95 px-1 py-3 backdrop-blur">
        <p className="text-xs text-ink-soft">{dirty ? "Unsaved changes" : "All changes saved"}</p>
        <div className="flex gap-2">
          {dirty && (
            <button type="button" onClick={() => setDraft(data)} className="h-9 rounded-full px-4 text-xs text-ink-soft hover:text-ink">
              Discard
            </button>
          )}
          <button
            type="button"
            onClick={save}
            disabled={!dirty || saving}
            className="inline-flex h-9 items-center gap-2 rounded-full bg-white px-4 text-xs font-medium text-black hover:bg-signal disabled:opacity-40"
          >
            {saving && <Loader2 className="size-3.5 animate-spin" />}
            Save changes
          </button>
        </div>
      </div>
      <Field
        value={draft}
        path=""
        label="Content"
        focusPath={focusPath}
        file={file}
        onChange={(next) => {
          if (file === "posts" && featuredCount(next) > 2) {
            toast.error("Only two insights can be featured at a time.", {
              description: "Unfeature one before featuring another. Featured insights are the ones on the homepage.",
            });
            return;
          }
          setDraft(next);
        }}
      />
    </div>
  );
}
