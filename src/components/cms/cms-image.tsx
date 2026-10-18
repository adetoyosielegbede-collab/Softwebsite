import Image from "next/image";
import { ImagePlus } from "lucide-react";
import type { CmsImage as CmsImageValue } from "@/lib/cms/paths";
import { cn } from "@/lib/utils";

type Props = {
  image: CmsImageValue | undefined;
  /** Content file id, e.g. "home" or "products/lift". */
  file: string;
  /** Dot path to the image inside the content file, e.g. "focusAreas.items.0.image". */
  path: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  width?: number;
  height?: number;
  /** Classes for the "Add image" placeholder shown in edit mode when the slot is empty. */
  emptyClassName?: string;
};

export function CmsImage({ image, file, path, className, sizes = "100vw", priority, width, height, emptyClassName }: Props) {
  const slot = { "data-cms-file": file, "data-cms-path": path };

  if (!image?.src) {
    return (
      <span
        {...slot}
        data-cms-empty=""
        className={cn(
          "cms-empty-slot items-center justify-center gap-2 rounded-2xl border border-dashed border-signal/60 bg-signal/5 p-6 font-mono text-xs text-signal",
          emptyClassName,
        )}
      >
        <ImagePlus className="size-4" aria-hidden />
        Add image
      </span>
    );
  }

  const unoptimized = image.src.endsWith(".svg") || image.src.startsWith("data:");
  const common = {
    ...slot,
    src: image.src,
    priority,
    unoptimized,
    style: image.position ? { objectPosition: image.position } : undefined,
  };

  if (width && height) {
    return <Image alt={image.alt ?? ""} {...common} width={width} height={height} sizes={sizes} className={className} />;
  }
  return <Image alt={image.alt ?? ""} {...common} fill sizes={sizes} className={cn("object-cover", className)} />;
}
