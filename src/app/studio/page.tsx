import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isValidSession, SESSION_COOKIE } from "@/lib/auth";
import { getSite, listMedia, listTextFields } from "@/lib/content";
import { StudioEditor } from "./studio-editor";

export const metadata = { title: "Studio" };

export default async function StudioPage() {
  const jar = await cookies();
  if (!isValidSession(jar.get(SESSION_COOKIE)?.value)) redirect("/studio/login");
  const site = await getSite();
  return <StudioEditor media={listMedia(site)} fields={listTextFields(site)} />;
}
