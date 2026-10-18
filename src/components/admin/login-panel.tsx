"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export function LoginPanel({ devPassword, onSuccess }: { devPassword: boolean; onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/cms/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setBusy(false);
    if (res.ok) {
      onSuccess();
      return;
    }
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    setError(body?.error || "Could not sign in.");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-paper px-6">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl bg-surface-raised p-8">
        <p className="font-mono text-[11px] tracking-[0.18em] text-signal uppercase">Softcom CMS</p>
        <h1 className="display mt-3 text-3xl">Edit the site</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          Sign in to replace images and update copy. Changes appear on the site immediately.
        </p>
        <label className="mt-8 block text-xs text-ink-soft" htmlFor="cms-password">
          Password
        </label>
        <input
          id="cms-password"
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 h-11 w-full rounded-full border border-line bg-paper px-4 text-sm outline-none focus:border-signal"
        />
        {error && <p className="mt-3 text-xs text-red-400">{error}</p>}
        {devPassword && (
          <p className="mt-3 text-xs text-ink-faint">
            Local development password: <span className="text-signal">softcom</span>
          </p>
        )}
        <button
          type="submit"
          disabled={busy || !password}
          className="mt-6 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-white text-sm font-medium text-black hover:bg-signal disabled:opacity-50"
        >
          {busy && <Loader2 className="size-4 animate-spin" />}
          Sign in
        </button>
      </form>
    </main>
  );
}
