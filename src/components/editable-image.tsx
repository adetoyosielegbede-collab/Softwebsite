"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Media } from "@/lib/types";
import { useEditing } from "./edit-provider";

export function EditableImage({
  media,
  className = "",
  imgClassName = "",
  priority = false,
}: {
  media: Media;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
}) {
  const editing = useEditing();
  const router = useRouter();
  const [override, setOverride] = useState<{ id: string; src: string } | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const src = override?.id === media.id ? override.src : media.src;

  async function upload(file: File) {
    setStatus("saving");
    const body = new FormData();
    body.set("id", media.id);
    body.set("file", file);
    const response = await fetch("/api/media", { method: "POST", body });
    if (!response.ok) {
      setStatus("error");
      return;
    }
    const json = (await response.json()) as { src: string };
    setOverride({ id: media.id, src: json.src });
    setStatus("idle");
    router.refresh();
  }

  const covers = className.includes("absolute") || className.includes("fixed");

  return (
    <div className={`${covers ? "" : "relative"} overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={media.alt}
        fill
        priority={priority}
        sizes="100vw"
        className={`object-cover ${imgClassName}`}
      />
      {editing ? (
        <label
          className="absolute top-3 right-3 z-20 cursor-pointer rounded-full bg-black/80 px-3 py-1.5 text-xs font-medium text-white ring-1 ring-white/20 backdrop-blur"
          onClick={(event) => event.stopPropagation()}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            const file = event.dataTransfer.files?.[0];
            if (file) upload(file);
          }}
        >
          {status === "saving" ? "Saving…" : status === "error" ? "Try again" : "Replace"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) upload(file);
              event.target.value = "";
            }}
          />
        </label>
      ) : null}
    </div>
  );
}
