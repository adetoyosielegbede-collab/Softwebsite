import { cookies } from "next/headers";
import { adminPassword, checkPassword, createSessionToken, SESSION_COOKIE } from "@/lib/cms/auth";

export async function POST(request: Request) {
  if (adminPassword() === null) {
    return Response.json(
      { error: "Editing is disabled. Set the ADMIN_PASSWORD environment variable to enable the CMS." },
      { status: 503 },
    );
  }
  const { password } = (await request.json().catch(() => ({}))) as { password?: string };
  if (!password || !checkPassword(password)) {
    return Response.json({ error: "That password is not correct." }, { status: 401 });
  }
  const { token, maxAge } = createSessionToken();
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });
  return Response.json({ ok: true });
}
