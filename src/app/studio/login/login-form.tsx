"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Wordmark } from "@/components/wordmark";

export function LoginForm({ showHint }: { showHint: boolean }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    const response = await fetch("/api/studio/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!response.ok) {
      setPending(false);
      setError("That password is not right.");
      return;
    }
    router.refresh();
    router.push("/studio");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <form onSubmit={onSubmit} className="w-full max-w-md">
        <Wordmark className="h-7 w-auto" />
        <h1 className="display mt-8 text-5xl">Studio</h1>
        <p className="mt-3 text-white/65">
          Replace photographs and edit the words on the site. Changes show up immediately.
        </p>
        <label className="mt-8 block text-sm text-white/70">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 h-12 w-full rounded-full border border-white/10 bg-white/5 px-4 text-ink outline-none focus:border-accent"
            autoFocus
          />
        </label>
        {showHint ? <p className="mt-3 text-sm text-white/45">The starting password is softcom.</p> : null}
        {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="mt-6 inline-flex h-11 items-center rounded-full bg-white px-5 text-sm font-medium text-black disabled:opacity-60"
        >
          {pending ? "Opening…" : "Enter studio"}
        </button>
      </form>
    </main>
  );
}
