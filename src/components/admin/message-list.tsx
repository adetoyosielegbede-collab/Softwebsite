"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/lib/format";

type Message = {
  id: string;
  receivedAt: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  reason?: string;
  message: string;
};

export function MessageList() {
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/cms/messages", { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) throw new Error("Could not load messages");
        setMessages((await res.json()) as Message[]);
      })
      .catch((err: Error) => setError(err.message));
  }, []);

  if (error) return <p className="text-sm text-red-400">{error}</p>;
  if (!messages) return <p className="text-sm text-ink-soft">Loading messages…</p>;
  if (messages.length === 0) {
    return (
      <div>
        <h1 className="display text-3xl">Messages</h1>
        <p className="mt-3 max-w-md text-sm text-ink-soft">
          Nothing yet. Messages sent through the contact form are stored here while the site runs locally.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="display text-3xl">Messages</h1>
      <p className="mt-1 text-sm text-ink-soft">{messages.length} received through the contact form.</p>
      <ul className="mt-8 space-y-3">
        {messages.map((m) => (
          <li key={m.id} className="rounded-2xl border border-line bg-surface-raised p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-sm font-medium">
                {m.name}
                {m.company ? <span className="font-normal text-ink-soft"> · {m.company}</span> : null}
              </p>
              <time className="text-xs text-ink-faint" dateTime={m.receivedAt}>
                {formatDate(m.receivedAt.slice(0, 10))}
              </time>
            </div>
            <p className="mt-1 text-xs text-ink-soft">
              <a href={`mailto:${m.email}`} className="hover:text-signal">
                {m.email}
              </a>
              {m.phone ? ` · ${m.phone}` : ""}
              {m.reason ? ` · ${m.reason}` : ""}
            </p>
            <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap">{m.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
