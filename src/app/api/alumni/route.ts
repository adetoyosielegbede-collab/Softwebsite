import { randomUUID } from "node:crypto";
import { contactMailConfigured, sendContactEmail } from "@/lib/contact-mail";
import { appendMessage, readBundledContent, storageMode } from "@/lib/cms/storage";

type Body = Partial<Record<"name" | "email" | "joinedYear" | "leftYear" | "role" | "now" | "hope" | "consent", string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FOUNDED = 2007;

function yearInRange(value: string) {
  if (!/^\d{4}$/.test(value)) return null;
  const year = Number(value);
  const latest = new Date().getFullYear();
  if (year < FOUNDED || year > latest) return null;
  return year;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Body;
  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const joinedRaw = body.joinedYear?.trim() ?? "";
  const leftRaw = body.leftYear?.trim() ?? "";
  const role = body.role?.trim() ?? "";
  const now = body.now?.trim() ?? "";
  const hope = body.hope?.trim() ?? "";
  const joined = yearInRange(joinedRaw);
  const left = yearInRange(leftRaw);
  const errors: Record<string, string> = {};

  if (!name) errors.name = "Please tell us your name.";
  if (!EMAIL.test(email)) errors.email = "Please enter a valid email address.";
  if (!joined) errors.joinedYear = "Please enter the year you joined, from 2007 onward.";
  if (!left) errors.leftYear = "Please enter the year you left, up to this year.";
  if (joined && left && left < joined) errors.leftYear = "The leaving year should be the same as or after the joining year.";
  if (!role) errors.role = "Please tell us your team or role.";
  if (body.consent !== "yes") errors.consent = "Please agree to receive communications about the network.";
  if (Object.keys(errors).length) return Response.json({ errors }, { status: 422 });

  const lines = [
    `${name} asked to join the Softcom Alumni Network.`,
    "",
    `Worked at Softcom: ${joined}–${left}`,
    `Team or role: ${role}`,
    now ? `Now: ${now}` : "",
    hope ? `Hopes for the community: ${hope}` : "",
    "Agreed to alumni communications: yes",
  ].filter((line) => line !== "");

  const entry = {
    id: randomUUID(),
    receivedAt: new Date().toISOString(),
    name: name.slice(0, 200),
    email: email.slice(0, 200),
    reason: "Alumni network",
    message: lines.join("\n").slice(0, 5000),
  };

  const onVercel = process.env.VERCEL === "1";
  if (contactMailConfigured()) {
    const site = await readBundledContent<{ contact: { email: string } }>("site");
    try {
      await sendContactEmail(entry, site.contact.email);
    } catch (error) {
      console.error("[alumni] email failed", error instanceof Error ? error.message : "unknown");
      return Response.json({ ok: false }, { status: 502 });
    }
  } else if (onVercel) {
    console.error("[alumni] RESEND_API_KEY is not set, so the signup was not emailed");
    return Response.json({ ok: false }, { status: 503 });
  }

  if (storageMode() === "local" && !onVercel) {
    await appendMessage(entry);
  }

  return Response.json({ ok: true });
}
