import type { Metadata } from "next";
import { EditableImage } from "@/components/editable-image";
import { InquiryForm } from "@/components/inquiry-form";
import { getSite } from "@/lib/content";

export const metadata: Metadata = { title: "Alumni" };

export default async function AlumniPage() {
  const { alumni } = await getSite();
  return (
    <section className="mx-auto grid max-w-6xl gap-12 px-6 pt-40 pb-20 md:grid-cols-2 md:px-12 md:pt-48">
      <div>
        <EditableImage media={alumni.image} className="mb-8 aspect-[16/9] rounded-[1.6rem]" />
        <p className="kicker">{alumni.kicker}</p>
        <h1 className="display mt-4 text-5xl md:text-7xl">{alumni.headline}</h1>
        <p className="mt-6 text-lg text-white/75">{alumni.lede}</p>
        <p className="mt-4 text-white/65">{alumni.body}</p>
        <p className="mt-4 text-white/65">{alumni.formIntro}</p>
      </div>
      <InquiryForm
        kind="alumni"
        submitLabel="Join the network"
        fields={[
          { name: "name", label: "Full name", required: true },
          { name: "email", label: "Email address", type: "email", required: true },
          { name: "years", label: "When did you work at Softcom?", required: true },
          { name: "role", label: "Your team or role at Softcom", required: true },
          { name: "now", label: "What are you doing now?" },
          { name: "hopes", label: "What would you like this community to make possible?", multiline: true },
        ]}
      />
    </section>
  );
}
