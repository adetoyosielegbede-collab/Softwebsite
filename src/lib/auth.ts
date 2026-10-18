import { createHmac, timingSafeEqual } from "crypto";

export const SESSION_COOKIE = "softcom_studio";

function secret() {
  return process.env.CMS_SECRET || "softcom-studio-secret";
}

export function studioPassword() {
  return process.env.CMS_PASSWORD || "softcom";
}

export function sessionToken() {
  return createHmac("sha256", secret()).update("softcom-studio-v1").digest("hex");
}

export function isValidSession(value?: string | null) {
  if (!value) return false;
  const expected = sessionToken();
  const a = Buffer.from(value);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
