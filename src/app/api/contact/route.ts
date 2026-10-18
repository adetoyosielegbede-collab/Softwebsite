import { randomUUID } from "node:crypto";
import { appendMessage, storageMode } from "@/lib/cms/storage";

type Body = Partial<Record<"name" | "email" | "phone" | "company" | "message", string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Body;
  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const message = body.message?.trim() ?? "";
  const errors: Record<string, string> = {};
  if (!name) errors.name = "Please tell us your name.";
  if (!EMAIL.test(email)) errors.email = "Please enter a valid email address.";
  if (message.length < 10) errors.message = "Please write a little more about what you need.";
  if (Object.keys(errors).length) return Response.json({ errors }, { status: 422 });

  const entry = {
    id: randomUUID(),
    receivedAt: new Date().toISOString(),
    name: name.slice(0, 200),
    email: email.slice(0, 200),
    phone: body.phone?.trim().slice(0, 50),
    company: body.company?.trim().slice(0, 200),
    message: message.slice(0, 5000),
  };

  if (storageMode() === "local") {
    await appendMessage(entry);
  } else {
    console.log("[contact] new message", entry);
  }
  return Response.json({ ok: true });
}
