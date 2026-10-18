"use client";

import { useState } from "react";

type Field = {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  multiline?: boolean;
};

export function InquiryForm({
  kind,
  fields,
  submitLabel,
}: {
  kind: string;
  fields: Field[];
  submitLabel: string;
}) {
  const [status, setStatus] = useState<"idle" | "saving" | "sent" | "error">("idle");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    const response = await fetch("/api/inquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, data }),
    });
    setStatus(response.ok ? "sent" : "error");
    if (response.ok) event.currentTarget.reset();
  }

  if (status === "sent") {
    return (
      <div className="rounded-3xl border border-line bg-white/5 p-8">
        <p className="display text-3xl">Message received.</p>
        <p className="mt-3 text-white/65">Thank you. Someone at Softcom will read this and reply.</p>
        <button type="button" className="mt-6 text-sm text-accent" onClick={() => setStatus("idle")}>
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {fields.map((field) => (
        <label key={field.name} className="block text-sm text-white/70">
          {field.label}
          {field.multiline ? (
            <textarea
              name={field.name}
              required={field.required}
              rows={5}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-ink outline-none focus:border-accent"
            />
          ) : (
            <input
              name={field.name}
              type={field.type || "text"}
              required={field.required}
              className="mt-2 h-12 w-full rounded-full border border-white/10 bg-white/5 px-4 text-ink outline-none focus:border-accent"
            />
          )}
        </label>
      ))}
      {status === "error" ? <p className="text-sm text-red-300">Something went wrong. Please try again.</p> : null}
      <button
        type="submit"
        disabled={status === "saving"}
        className="inline-flex h-11 items-center rounded-full bg-white px-5 text-sm font-medium text-black disabled:opacity-60"
      >
        {status === "saving" ? "Sending…" : submitLabel}
      </button>
    </form>
  );
}
