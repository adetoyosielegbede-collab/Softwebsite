import Link from "next/link";
import { CmsImage } from "@/components/cms/cms-image";
import { ColorReveal } from "@/components/site/color-reveal";
import { formatDate } from "@/lib/format";
import type { Post } from "@/lib/content-types";
import { cn } from "@/lib/utils";

export function InsightCard({
  post,
  index,
  size = "default",
}: {
  post: Post;
  /** Index of the post inside posts.json, used to target its image slot. */
  index: number;
  size?: "default" | "featured" | "lead";
}) {
  const featured = size === "featured";
  const lead = size === "lead";
  return (
    <Link
      href={`/insights/${post.slug}`}
      className={cn(
        "group block",
        featured && "grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-12",
        lead && "flex flex-col gap-4",
      )}
    >
      <ColorReveal
        className={cn(
          "relative overflow-hidden rounded-2xl bg-surface-raised",
          featured ? "aspect-[16/9]" : lead ? "h-[min(324px,40svh)]" : "aspect-[3/2]",
        )}
      >
        <CmsImage
          image={post.image}
          file="posts"
          path={`items.${index}.image`}
          sizes={featured || lead ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 33vw, 100vw"}
          className={cn("transition-transform duration-700 group-hover:scale-[1.03]", lead && "object-left")}
          emptyClassName="absolute inset-0 rounded-2xl"
        />
      </ColorReveal>
      <div className={cn(!featured && !lead && "mt-4", lead && "flex flex-col gap-6")}>
        <div
          className={`label flex items-start justify-between gap-4 ${lead ? "text-ink" : "text-ink-soft"}`}
        >
          <span className={lead ? "text-ink" : undefined}>{post.category}</span>
          <time dateTime={post.date} className={lead ? "text-ink-soft" : undefined}>
            {formatDate(post.date)}
          </time>
        </div>
        {lead ? (
          <div className="flex flex-col gap-2.5">
            <h3 className="text-title transition-colors group-hover:text-accent-ink">{post.title}</h3>
            <p className="text-body text-ink-soft">{post.excerpt}</p>
          </div>
        ) : (
          <>
            <h3 className={`${featured ? "text-headline" : "text-title"} mt-3 transition-colors group-hover:text-accent-ink`}>
              {post.title}
            </h3>
            <p className="text-body mt-3 text-ink-soft">{post.excerpt}</p>
          </>
        )}
      </div>
    </Link>
  );
}
