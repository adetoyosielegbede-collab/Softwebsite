import { randomUUID } from "node:crypto";
import { contactMailConfigured, sendContactEmail } from "@/lib/contact-mail";
import { appendMessage, readBundledContent, storageMode } from "@/lib/cms/storage";
import type { ContactContent } from "@/lib/content-types";

type Body = Partial<Record<"name" | "email" | "phone" | "company" | "reason" | "message", string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Body;
  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const reason = body.reason?.trim() ?? "";
  const message = body.message?.trim() ?? "";
  const contact = await readBundledContent<ContactContent>("contact");
  const allowed = new Set(contact.form.reasons);
  const errors: Record<string, string> = {};
  if (!name) errors.name = "Please tell us your name.";
  if (!EMAIL.test(email)) errors.email = "Please enter a valid email address.";
  if (!allowed.has(reason)) errors.reason = "Please choose a reason.";
  if (message.length < 10) errors.message = "Please write a little more about what you need.";
  if (Object.keys(errors).length) return Response.json({ errors }, { status: 422 });

  const entry = {
    id: randomUUID(),
    receivedAt: new Date().toISOString(),
    name: name.slice(0, 200),
    email: email.slice(0, 200),
    phone: body.phone?.trim().slice(0, 50) || undefined,
    company: body.company?.trim().slice(0, 200) || undefined,
    reason,
    message: message.slice(0, 5000),
  };

  const onVercel = process.env.VERCEL === "1";
  if (contactMailConfigured()) {
    const site = await readBundledContent<{ contact: { email: string } }>("site");
    try {
      await sendContactEmail(entry, site.contact.email);
    } catch (error) {
      console.error("[contact] email failed", error instanceof Error ? error.message : "unknown");
      return Response.json({ ok: false }, { status: 502 });
    }
  } else if (onVercel) {
    console.error("[contact] RESEND_API_KEY is not set, so the message was not emailed");
    return Response.json({ ok: false }, { status: 503 });
  }

  // The admin Messages list reads this file. Vercel cannot write it, and a failed
  // write must not turn a delivered email into an error for the visitor.
  if (storageMode() === "local" && !onVercel) {
    await appendMessage(entry);
  }

  return Response.json({ ok: true });
}
