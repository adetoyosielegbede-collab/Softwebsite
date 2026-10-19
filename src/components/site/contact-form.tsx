"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ContactContent } from "@/lib/content-types";

type Fields = ContactContent["form"];

export function ContactForm({ form }: { form: Fields }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrors({});
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const res = await fetch("/api/contact", {
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
      <div className="rounded-3xl bg-surface-raised p-8 lg:p-10">
        <h2 className="text-headline">{form.successTitle}</h2>
        <p className="text-body mt-4 max-w-md text-ink-soft">{form.successText}</p>
      </div>
    );
  }

  const field = (name: string, label: string, placeholder: string, type = "text") => (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-xs text-ink-soft">
        {label}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        aria-invalid={Boolean(errors[name])}
        className="h-11 rounded-full border-line bg-paper px-4"
      />
      {errors[name] && <p className="text-xs text-destructive">{errors[name]}</p>}
    </div>
  );

  return (
    <form onSubmit={onSubmit} className="rounded-3xl bg-surface-raised p-6 lg:p-10" noValidate>
      <h2 className="text-title">{form.title}</h2>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {field("name", form.nameLabel, form.namePlaceholder)}
        {field("email", form.emailLabel, form.emailPlaceholder, "email")}
        {field("phone", form.phoneLabel, form.phonePlaceholder, "tel")}
        {field("company", form.companyLabel, form.companyPlaceholder)}
      </div>
      <div className="mt-5 space-y-2">
        <Label htmlFor="message" className="text-xs text-ink-soft">
          {form.messageLabel}
        </Label>
        <Textarea
          id="message"
          name="message"
          placeholder={form.messagePlaceholder}
          aria-invalid={Boolean(errors.message)}
          className="min-h-32 rounded-2xl border-line bg-paper px-4 py-3"
        />
        {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
      </div>
      {status === "error" && !Object.keys(errors).length && (
        <p className="mt-4 text-sm text-destructive">Something went wrong sending your message. Please try again, or email us directly.</p>
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
