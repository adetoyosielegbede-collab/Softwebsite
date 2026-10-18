"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Partner } from "@/lib/types";
import { useEditing } from "./edit-provider";

function Logo({ partner, editing }: { partner: Partner; editing: boolean }) {
  const router = useRouter();
  const [status, setStatus] = useState("");

  async function upload(file: File) {
    setStatus("Saving…");
    const body = new FormData();
    body.set("id", partner.id);
    body.set("file", file);
    const response = await fetch("/api/media", { method: "POST", body });
    if (!response.ok) {
      setStatus("Try again");
      return;
    }
    setStatus("");
    router.refresh();
  }

  return (
    <div className="relative flex h-16 shrink-0 items-center" title={partner.name}>
      <span
        aria-label={partner.alt || partner.name}
        role="img"
        className="block bg-white/80"
        style={{
          width: partner.width,
          height: partner.height,
          WebkitMaskImage: `url(${partner.src})`,
          maskImage: `url(${partner.src})`,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
          WebkitMaskSize: "contain",
          maskSize: "contain",
        }}
      />
      {editing ? (
        <label className="absolute -top-2 right-0 cursor-pointer rounded-full bg-signal px-2 py-0.5 text-[10px] text-white">
          {status || "Logo"}
          <input
            className="sr-only"
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) upload(file);
            }}
          />
        </label>
      ) : null}
    </div>
  );
}

export function PartnerMarquee({ partners }: { partners: Partner[] }) {
  const editing = useEditing();
  const row = [...partners, ...partners];
  return (
    <section className="overflow-hidden py-16">
      <p className="kicker px-6 md:px-12">Organisations we have worked with</p>
      <div className="marquee mt-8 overflow-hidden">
        <div className="marquee-track flex w-max items-center gap-16 pr-16">
          {row.map((partner, index) => (
            <Logo key={`${partner.id}-${index}`} partner={partner} editing={editing && index < partners.length} />
          ))}
        </div>
      </div>
    </section>
  );
}
