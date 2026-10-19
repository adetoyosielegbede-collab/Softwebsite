"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { ExternalLink, Images, Inbox, LogOut } from "lucide-react";
import { ContentEditor } from "@/components/admin/content-editor";
import { ImageBoard, type MediaSlot } from "@/components/admin/image-board";
import { LoginPanel } from "@/components/admin/login-panel";
import { MessageList } from "@/components/admin/message-list";
import { loadContent } from "@/lib/cms/client";
import { CONTENT_FILES, type ContentFile } from "@/lib/cms/registry";
import { cn } from "@/lib/utils";

type Session = { authenticated: boolean; mode: "local" | "github"; devPassword: boolean; readOnly: boolean };
type View = "images" | "messages" | "content";

function Admin() {
  const router = useRouter();
  const params = useSearchParams();
  const fileParam = params.get("file");
  const focusPath = params.get("path") ?? undefined;
  const [session, setSession] = useState<Session | null>(null);
  const [view, setView] = useState<View>(fileParam ? "content" : "images");
  const [file, setFile] = useState(fileParam && CONTENT_FILES.some((f) => f.id === fileParam) ? fileParam : "home");
  const [content, setContent] = useState<unknown>(null);
  const [slots, setSlots] = useState<MediaSlot[] | null>(null);
  const [error, setError] = useState("");

  const refreshSession = useCallback(() => {
    fetch("/api/cms/session", { cache: "no-store" })
      .then((r) => r.json())
      .then((s: Session) => setSession(s))
      .catch(() => setSession({ authenticated: false, mode: "local", devPassword: true, readOnly: false }));
  }, []);

  useEffect(refreshSession, [refreshSession]);

  const loadSlots = useCallback(() => {
    fetch("/api/cms/media", { cache: "no-store" })
      .then(async (r) => {
        if (!r.ok) throw new Error("Could not load images");
        const body = (await r.json()) as { slots: MediaSlot[] };
        setSlots(body.slots);
        setError("");
      })
      .catch((err: Error) => setError(err.message));
  }, []);

  useEffect(() => {
    if (!session?.authenticated || view !== "content") return;
    let cancelled = false;
    loadContent(file)
      .then((data) => {
        if (!cancelled) {
          setContent(data);
          setError("");
        }
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, [session, view, file]);

  useEffect(() => {
    if (session?.authenticated && view === "images") loadSlots();
  }, [session, view, loadSlots]);

  if (!session) return <main className="grid min-h-screen place-items-center text-sm text-ink-soft">Loading…</main>;
  if (!session.authenticated) return <LoginPanel devPassword={session.devPassword} onSuccess={refreshSession} />;

  function openFile(entry: ContentFile) {
    setContent(null);
    setFile(entry.id);
    setView("content");
    router.replace(`/admin?file=${encodeURIComponent(entry.id)}`);
  }

  const current = CONTENT_FILES.find((f) => f.id === file);
  const groups = ["Site-wide", "Pages", "Products", "Collections"] as const;

  return (
    <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
      <aside className="border-b border-line bg-surface lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:border-r lg:border-b-0">
        <div className="flex items-center justify-between px-5 py-5">
          <Link href="/" className="font-mono text-[11px] tracking-[0.18em] text-signal uppercase">
            Softcom CMS
          </Link>
          <button
            type="button"
            aria-label="Sign out"
            title="Sign out"
            onClick={async () => {
              await fetch("/api/cms/logout", { method: "POST" });
              setSession({ ...session, authenticated: false });
            }}
            className="grid size-8 place-items-center rounded-full text-ink-faint hover:bg-white/10 hover:text-ink"
          >
            <LogOut className="size-4" />
          </button>
        </div>
        <nav className="space-y-6 px-3 pb-8">
          <div className="space-y-1">
            <NavButton active={view === "images"} onClick={() => setView("images")} icon={<Images className="size-4" />}>
              All images
            </NavButton>
            <NavButton active={view === "messages"} onClick={() => setView("messages")} icon={<Inbox className="size-4" />}>
              Messages
            </NavButton>
          </div>
          {groups.map((group) => (
            <div key={group}>
              <p className="px-3 pb-2 text-[10px] tracking-[0.16em] text-ink-faint uppercase">{group}</p>
              {CONTENT_FILES.filter((f) => f.group === group).map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => openFile(entry)}
                  className={cn(
                    "block w-full rounded-xl px-3 py-2 text-left text-sm transition-colors",
                    view === "content" && file === entry.id ? "bg-white text-black" : "text-ink-soft hover:bg-white/5 hover:text-ink",
                  )}
                >
                  {entry.label}
                </button>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      <main className="px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
        {session.readOnly && (
          <p className="mb-6 rounded-xl bg-red-500/10 px-4 py-3 text-xs text-red-300">
            This host has a read-only disk, so saves made here will not stick. Set CMS_STORAGE=github with a token that can commit to the repository — see the README.
          </p>
        )}
        {session.mode === "github" && (
          <p className="mb-6 rounded-xl bg-signal/10 px-4 py-3 text-xs text-signal">
            Saving commits directly to the GitHub repository. A redeploy picks up text changes; uploaded images are committed to the repo.
          </p>
        )}
        {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

        {view === "images" &&
          (slots ? <ImageBoard slots={slots} onChanged={loadSlots} /> : <p className="text-sm text-ink-soft">Loading images…</p>)}
        {view === "messages" && <MessageList />}
        {view === "content" && (
          <>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
              <h1 className="display text-3xl">{current?.label}</h1>
              {current?.href && (
                <Link href={current.href} target="_blank" className="inline-flex items-center gap-1.5 text-xs text-ink-soft hover:text-signal">
                  Open live page <ExternalLink className="size-3.5" />
                </Link>
              )}
            </div>
            <p className="mb-6 text-xs text-ink-faint">
              Images, headlines and body copy for this page. For a faster image-only pass, use All images — or hover any picture on the live site while signed in.
            </p>
            {content ? (
              <ContentEditor
                key={file}
                file={file}
                data={content}
                focusPath={focusPath}
                onSaved={(next) => {
                  setContent(next);
                  router.refresh();
                }}
              />
            ) : (
              !error && <p className="text-sm text-ink-soft">Loading…</p>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function NavButton({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm transition-colors",
        active ? "bg-signal text-black" : "text-ink-soft hover:bg-white/5 hover:text-ink",
      )}
    >
      {icon}
      {children}
    </button>
  );
}

export default function AdminPage() {
  return (
    <div className="dark min-h-screen bg-paper text-ink">
      <Suspense fallback={<main className="grid min-h-screen place-items-center text-sm text-ink-soft">Loading…</main>}>
        <Admin />
      </Suspense>
    </div>
  );
}
