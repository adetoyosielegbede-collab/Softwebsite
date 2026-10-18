import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { isValidSession, SESSION_COOKIE } from "@/lib/auth";
import { LoginForm } from "./login-form";

export default async function StudioLoginPage() {
  const jar = await cookies();
  if (isValidSession(jar.get(SESSION_COOKIE)?.value)) redirect("/studio");
  return <LoginForm showHint={!process.env.CMS_PASSWORD} />;
}
