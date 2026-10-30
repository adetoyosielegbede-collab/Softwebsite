"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { AlumniContent } from "@/lib/content-types";

type Fields = AlumniContent["join"];

const inputClass = "h-12 rounded-full border-line-strong bg-line-strong/30 px-4 dark:bg-line-strong/30";

export function AlumniForm({ form }: { form: Fields }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrors({});
    const formEl = e.currentTarget;
    const data = Object.fromEntries(new FormData(formEl));
    const consent = formEl.querySelector<HTMLInputElement>('input[name="consent"]');
    data.consent = consent?.checked ? "yes" : "";
    const res = await fetch("/api/alumni", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setStatus("sent");
      return;
    }
    const body = (await res.json().catch(() => null)) as { errors?: Record<string, string> } | null;
    if (body?.errors) setErrors(body.errors);
    setStatus("error");
  }

  if (status === "sent") {
    return (
      <div className="rounded-3xl bg-surface p-8 lg:p-10">
        <h3 className="text-headline">{form.successTitle}</h3>
        <p className="text-body mt-4 max-w-md text-ink-soft">{form.successText}</p>
      </div>
    );
  }

  const field = (name: string, label: string, placeholder: string, type = "text") => (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        inputMode={type === "text" && name.endsWith("Year") ? "numeric" : undefined}
        maxLength={name.endsWith("Year") ? 4 : undefined}
        placeholder={placeholder}
        aria-invalid={Boolean(errors[name])}
        className={inputClass}
      />
      {errors[name] && <p className="text-xs text-destructive">{errors[name]}</p>}
    </div>
  );

  return (
    <form onSubmit={onSubmit} className="rounded-3xl bg-surface p-8 lg:p-[47px]" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        {field("name", form.nameLabel, form.namePlaceholder)}
        {field("email", form.emailLabel, form.emailPlaceholder, "email")}
      </div>
      <fieldset className="mt-5">
        <legend className="text-sm font-medium">{form.yearsLabel}</legend>
        <div className="mt-2 grid gap-5 sm:grid-cols-2">
          {field("joinedYear", form.joinedLabel, form.joinedPlaceholder)}
          {field("leftYear", form.leftLabel, form.leftPlaceholder)}
        </div>
      </fieldset>
      <div className="mt-5">{field("role", form.roleLabel, form.rolePlaceholder)}</div>
      <div className="mt-5 space-y-2">
        <Label htmlFor="now" className="text-sm font-medium">
          {form.nowLabel}
        </Label>
        <Textarea
          id="now"
          name="now"
          placeholder={form.nowPlaceholder}
          aria-invalid={Boolean(errors.now)}
          className="field-sizing-fixed min-h-28 rounded-2xl border-line-strong bg-line-strong/30 px-4 py-3 dark:bg-line-strong/30"
        />
      </div>
      <div className="mt-5 space-y-2">
        <Label htmlFor="hope" className="text-sm font-medium">
          {form.hopeLabel}
        </Label>
        <Textarea
          id="hope"
          name="hope"
          placeholder={form.hopePlaceholder}
          aria-invalid={Boolean(errors.hope)}
          className="field-sizing-fixed min-h-28 rounded-2xl border-line-strong bg-line-strong/30 px-4 py-3 dark:bg-line-strong/30"
        />
      </div>
      <div className="mt-6 flex items-start gap-3">
        <input
          id="consent"
          name="consent"
          type="checkbox"
          aria-invalid={Boolean(errors.consent)}
          className="mt-0.5 size-4 shrink-0 accent-signal"
        />
        <Label htmlFor="consent" className="text-sm leading-snug font-normal text-ink-soft">
          {form.consentLabel}
        </Label>
      </div>
      {errors.consent && <p className="mt-2 text-xs text-destructive">{errors.consent}</p>}
      {status === "error" && !Object.keys(errors).length && (
        <p className="mt-4 text-sm text-destructive">Something went wrong sending your details. Please try again, or email us directly.</p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-6 inline-flex h-10 items-center gap-2 rounded-full bg-ink px-5 text-sm font-medium text-paper hover:bg-signal hover:text-black disabled:opacity-60"
      >
        {status === "sending" && <Loader2 className="size-4 animate-spin" />}
        {form.submitLabel}
      </button>
    </form>
  );
}
