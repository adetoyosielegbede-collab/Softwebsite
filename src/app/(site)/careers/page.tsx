import type { Metadata } from "next";
import Link from "next/link";
import { EditableImage } from "@/components/editable-image";
import { getSite } from "@/lib/content";

export const metadata: Metadata = { title: "Careers" };

export default async function CareersPage() {
  const { careers } = await getSite();

  return (
    <>
      <section className="relative overflow-hidden px-6 pt-40 pb-16 md:px-12 md:pt-48">
        <EditableImage media={careers.image} className="absolute inset-0 opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/80 to-canvas" />
        <div className="relative max-w-4xl">
          <p className="kicker">{careers.kicker}</p>
          <h1 className="display mt-4 text-[clamp(48px,8vw,96px)]">{careers.headline}</h1>
          <p className="mt-6 max-w-2xl text-lg text-white/75">{careers.lede}</p>
          <a href="#roles" className="mt-8 inline-flex h-11 items-center rounded-full bg-white px-5 text-sm font-medium text-black">
            See open roles
          </a>
        </div>
      </section>
      <section className="mx-auto max-w-3xl space-y-5 px-6 py-12 text-lg leading-8 text-white/75 md:px-10">
        {careers.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>
      <section id="roles" className="mx-auto max-w-3xl px-6 pb-20 md:px-10">
        <h2 className="display text-4xl">Open roles</h2>
        {careers.roles.length === 0 ? (
          <div className="mt-6 rounded-[1.6rem] border border-line p-6">
            <p className="text-white/70">{careers.empty}</p>
            <Link href="/contact" className="mt-5 inline-flex h-11 items-center rounded-full bg-white px-5 text-sm font-medium text-black">
              Start a conversation
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {careers.roles.map((role) => (
              <article key={role.title} className="rounded-[1.6rem] border border-line p-6">
                <h3 className="text-2xl font-light">{role.title}</h3>
                <p className="mt-1 text-sm text-accent">
                  {role.team} · {role.location}
                </p>
                <p className="mt-3 text-white/70">{role.summary}</p>
                <Link href="/contact" className="mt-4 inline-flex text-sm">
                  Introduce yourself →
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
