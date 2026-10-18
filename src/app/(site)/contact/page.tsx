import type { Metadata } from "next";
import { InquiryForm } from "@/components/inquiry-form";
import { getSite } from "@/lib/content";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
  const site = await getSite();
  return (
    <section className="mx-auto grid max-w-6xl gap-12 px-6 pt-40 pb-20 md:grid-cols-2 md:px-12 md:pt-48">
      <div>
        <p className="kicker">{site.contactPage.kicker}</p>
        <h1 className="display mt-4 text-6xl md:text-7xl">{site.contactPage.headline}</h1>
        <p className="mt-6 text-lg text-white/70">{site.contactPage.lede}</p>
        <div className="mt-10 text-white/75">
          <p className="font-medium text-white">{site.contact.company}</p>
          {site.contact.lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
          <a className="mt-3 inline-block text-accent" href={`mailto:${site.contact.email}`}>
            {site.contact.email}
          </a>
        </div>
      </div>
      <InquiryForm
        kind="contact"
        submitLabel="Send message"
        fields={[
          { name: "name", label: "Name", required: true },
          { name: "email", label: "Email", type: "email", required: true },
          { name: "phone", label: "Phone" },
          { name: "company", label: "Company" },
          { name: "message", label: "Message", multiline: true, required: true },
        ]}
      />
    </section>
  );
}
