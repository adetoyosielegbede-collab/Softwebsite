import { EditBar } from "@/components/edit-bar";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { cookies } from "next/headers";
import { isValidSession, SESSION_COOKIE } from "@/lib/auth";
import { getSite } from "@/lib/content";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const site = await getSite();
  const jar = await cookies();
  const editing = isValidSession(jar.get(SESSION_COOKIE)?.value);

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer site={site} />
      {editing ? <EditBar /> : null}
    </>
  );
}
