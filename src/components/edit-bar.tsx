"use client";

import { useRouter } from "next/navigation";

export function EditBar() {
  const router = useRouter();
  return (
    <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
      <div className="flex flex-wrap items-center gap-3 rounded-full bg-black/90 px-4 py-2 text-sm text-white ring-1 ring-accent/50 backdrop-blur">
        <span className="size-2 rounded-full bg-accent" />
        <span>Studio is on. Replace any photo, or edit copy.</span>
        <a href="/studio" className="rounded-full bg-white px-3 py-1 text-black">
          Open studio
        </a>
        <button
          type="button"
          className="text-white/70"
          onClick={async () => {
            await fetch("/api/studio/logout", { method: "POST" });
            router.refresh();
            router.push("/");
          }}
        >
          Done
        </button>
      </div>
    </div>
  );
}
