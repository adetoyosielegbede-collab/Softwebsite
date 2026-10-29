import "server-only";

export type ContactMail = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
};

/** True when the live site can hand a message to Resend. */
export function contactMailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

function recipients(fallback: string) {
  const raw = process.env.CONTACT_TO?.trim() || fallback;
  return raw
    .split(/[,;]+/)
    .map((address) => address.trim())
    .filter(Boolean);
}

/** Sends the enquiry. Throws when Resend rejects it. */
export async function sendContactEmail(entry: ContactMail, fallbackTo: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");

  const to = recipients(fallbackTo);
  const from = process.env.CONTACT_FROM?.trim() || `Softcom <${fallbackTo}>`;
  const details = [
    `Email: ${entry.email}`,
    entry.phone ? `Phone: ${entry.phone}` : "",
    entry.company ? `Company: ${entry.company}` : "",
  ].filter(Boolean);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: entry.email,
      subject: `Website message from ${entry.name}`,
      text: [`${entry.name} wrote through the Softcom website.`, "", ...details, "", entry.message].join("\n"),
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Resend rejected the message (${res.status}): ${detail.slice(0, 300)}`);
  }
}
