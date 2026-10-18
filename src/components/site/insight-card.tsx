import Link from "next/link";
import { CmsImage } from "@/components/cms/cms-image";
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
  size?: "default" | "featured";
}) {
  const featured = size === "featured";
  return (
    <Link
      href={`/insights/${post.slug}`}
      className={cn("group block", featured && "grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-12")}
    >
      <div className={cn("relative overflow-hidden rounded-2xl bg-surface-raised", featured ? "aspect-[16/9]" : "aspect-[3/2]")}>
        <CmsImage
          image={post.image}
          file="posts"
          path={`items.${index}.image`}
          sizes={featured ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1024px) 33vw, 100vw"}
          className="transition-transform duration-700 group-hover:scale-[1.03]"
          emptyClassName="absolute inset-0 rounded-2xl"
        />
      </div>
      <div className={cn(!featured && "mt-4")}>
        <div className="flex items-center justify-between gap-4 text-[11px] text-ink-soft">
          <span>{post.category}</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </div>
        <h3 className={cn("mt-3 transition-colors group-hover:text-signal", featured ? "display text-3xl leading-tight" : "text-lg leading-snug")}>
          {post.title}
        </h3>
        <p className="mt-3 text-[13px] leading-relaxed text-ink-soft">{post.excerpt}</p>
      </div>
    </Link>
  );
}
