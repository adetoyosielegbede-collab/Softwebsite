"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Wordmark } from "@/components/wordmark";
import type { MediaRef, Path, TextField } from "@/lib/types";

async function save(body: unknown) {
  const response = await fetch("/api/content", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const json = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(json.error || "Could not save");
  }
}

function TextControl({ field }: { field: TextField }) {
  const [value, setValue] = useState(field.value);
  const [state, setState] = useState("");

  async function commit() {
    if (value === field.value) return;
    setState("Saving…");
    try {
      await save({ op: "set", path: field.path, value });
      setState("Saved");
    } catch (error) {
      setState(error instanceof Error ? error.message : "Could not save");
    }
  }

  const className =
    "mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-ink outline-none focus:border-accent";

  return (
    <label className="block">
      <span className="text-xs tracking-wide text-white/45 uppercase">{field.label}</span>
      {field.multiline ? (
        <textarea className={className} rows={4} value={value} onChange={(event) => setValue(event.target.value)} onBlur={commit} />
      ) : (
        <input className={`${className} h-11`} value={value} onChange={(event) => setValue(event.target.value)} onBlur={commit} />
      )}
      {state ? <span className="mt-1 block text-xs text-accent">{state}</span> : null}
    </label>
  );
}

function ImageCard({ item }: { item: MediaRef }) {
  const router = useRouter();
  const [alt, setAlt] = useState(item.media.alt);
  const [state, setState] = useState("");

  async function upload(file: File) {
    setState("Uploading…");
    const body = new FormData();
    body.set("id", item.media.id);
    body.set("file", file);
    const response = await fetch("/api/media", { method: "POST", body });
    if (!response.ok) {
      const json = (await response.json().catch(() => ({}))) as { error?: string };
      setState(json.error || "Upload failed");
      return;
    }
    setState("Replaced");
    router.refresh();
  }

  async function saveAlt() {
    if (alt === item.media.alt) return;
    setState("Saving caption…");
    try {
      await save({ op: "set", path: [...item.path, "alt"], value: alt });
      setState("Caption saved");
    } catch (error) {
      setState(error instanceof Error ? error.message : "Could not save");
    }
  }

  return (
    <article className="overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/10">
      <div
        className="relative aspect-[16/10] bg-neutral-900"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          const file = event.dataTransfer.files?.[0];
          if (file) upload(file);
        }}
      >
        <Image src={item.media.src} alt={item.media.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
      </div>
      <div className="space-y-3 p-4">
        <h3 className="text-lg font-light">{item.media.label}</h3>
        <label className="block text-xs text-white/45 uppercase">
          Caption
          <input
            value={alt}
            onChange={(event) => setAlt(event.target.value)}
            onBlur={saveAlt}
            className="mt-2 h-10 w-full rounded-full border border-white/10 bg-black/40 px-3 text-sm text-ink normal-case outline-none focus:border-accent"
          />
        </label>
        <label className="inline-flex h-10 cursor-pointer items-center rounded-full bg-white px-4 text-sm font-medium text-black">
          {state || "Replace image"}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) upload(file);
              event.target.value = "";
            }}
          />
        </label>
      </div>
    </article>
  );
}

const removable = /^(insights\.items|caseStudies\.items|about\.leaders|careers\.roles)\.\d+$/;

export function StudioEditor({ media, fields }: { media: MediaRef[]; fields: TextField[] }) {
  const router = useRouter();
  const [tab, setTab] = useState<"images" | "words">("images");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");

  const images = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return media;
    return media.filter((item) => `${item.media.label} ${item.media.alt}`.toLowerCase().includes(q));
  }, [media, query]);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const map = new Map<string, TextField[]>();
    for (const field of fields) {
      if (q && !`${field.label} ${field.value}`.toLowerCase().includes(q)) continue;
      const list = map.get(field.group) ?? [];
      list.push(field);
      map.set(field.group, list);
    }
    return Array.from(map.entries());
  }, [fields, query]);

  async function add(kind: string) {
    setNotice("Adding…");
    try {
      await save({ op: "add", kind });
      setNotice("Added. It is on the site now.");
      router.refresh();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not add");
    }
  }

  async function remove(path: Path) {
    const index = path[path.length - 1];
    const parent = path.slice(0, -1);
    if (typeof index !== "number") return;
    if (!window.confirm("Remove this from the site?")) return;
    try {
      await save({ op: "remove", path: parent, index });
      router.refresh();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not remove");
    }
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-canvas/90 px-5 py-4 backdrop-blur">
        <div className="flex items-center gap-4">
          <Link href="/" className="group">
            <Wordmark />
          </Link>
          <p className="text-sm text-white/50">Studio</p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Link href="/" className="text-white/70">
            View site
          </Link>
          <button
            type="button"
            className="text-white/50"
            onClick={async () => {
              await fetch("/api/studio/logout", { method: "POST" });
              router.refresh();
              router.push("/");
            }}
          >
            Log out
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8">
        <h1 className="display text-4xl md:text-5xl">Change the site yourself.</h1>
        <p className="mt-3 max-w-2xl text-white/65">
          Photographs are the fast path. Drop a new file on a card, or use Replace. Words save when you leave a field.
          The public site updates on refresh.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setTab("images")}
            className={`rounded-full px-4 py-2 text-sm ${tab === "images" ? "bg-white text-black" : "bg-white/5 text-white/70"}`}
          >
            Photographs ({media.length})
          </button>
          <button
            type="button"
            onClick={() => setTab("words")}
            className={`rounded-full px-4 py-2 text-sm ${tab === "words" ? "bg-white text-black" : "bg-white/5 text-white/70"}`}
          >
            Words
          </button>
        </div>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={tab === "images" ? "Search photographs" : "Search words"}
          className="mt-4 h-12 w-full rounded-full border border-white/10 bg-white/5 px-4 outline-none focus:border-accent"
        />
        {notice ? <p className="mt-3 text-sm text-accent">{notice}</p> : null}

        {tab === "images" ? (
          images.length === 0 ? (
            <p className="mt-10 text-white/60">No photographs match that search.</p>
          ) : (
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {images.map((item) => (
                <ImageCard key={item.media.id} item={item} />
              ))}
            </div>
          )
        ) : (
          <div className="mt-8 space-y-4">
            <div className="flex flex-wrap gap-2">
              <button type="button" className="rounded-full bg-white px-4 py-2 text-sm text-black" onClick={() => add("insight")}>
                Add insight
              </button>
              <button type="button" className="rounded-full bg-white px-4 py-2 text-sm text-black" onClick={() => add("case")}>
                Add case study
              </button>
              <button type="button" className="rounded-full bg-white px-4 py-2 text-sm text-black" onClick={() => add("role")}>
                Add open role
              </button>
              <button type="button" className="rounded-full bg-white px-4 py-2 text-sm text-black" onClick={() => add("leader")}>
                Add leader
              </button>
            </div>
            {groups.length === 0 ? <p className="text-white/60">No text matches that search.</p> : null}
            {groups.map(([group, items]) => {
              const indexPath = items[0]?.path.slice(0, items[0].path.findIndex((part) => typeof part === "number") + 1);
              return (
                <section key={group} className="rounded-3xl border border-line p-5">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h2 className="text-lg font-light">{group}</h2>
                    {removable.test(group) ? (
                      <button type="button" className="text-sm text-red-300" onClick={() => remove(indexPath)}>
                        Remove
                      </button>
                    ) : null}
                  </div>
                  <div className="grid gap-4">
                    {items.map((field) => (
                      <TextControl key={field.path.join(".")} field={field} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
