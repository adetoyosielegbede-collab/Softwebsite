import { ExternalLink } from "lucide-react";
import { CmsImage } from "@/components/cms/cms-image";
import type { CaseStudiesContent } from "@/lib/content-types";
import { cn } from "@/lib/utils";

type Item = CaseStudiesContent["items"][number];

function ClientMark({ item, index, compact }: { item: Item; index: number; compact?: boolean }) {
  if (!item.logo?.src) return null;
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-xl bg-neutral-950",
        compact ? "max-w-[7.5rem] px-2.5 py-1.5" : "max-w-[9.5rem] px-3 py-2",
      )}
    >
      <CmsImage
        image={item.logo}
        file="case-studies"
        path={`items.${index}.logo`}
        fluid
        className={cn("w-auto object-contain brightness-0 invert", compact ? "h-8 max-w-[6.75rem]" : "h-10 max-w-[8.5rem]")}
        emptyClassName="hidden"
      />
    </span>
  );
}

/** Shared study body for the listing overlay and the dedicated study URL. */
export function CaseStudyDetail({
  item,
  index,
  compact = false,
}: {
  item: Item;
  index: number;
  compact?: boolean;
}) {
  return (
    <div className={cn("flex flex-col", compact ? "gap-6" : "gap-12")}>
      <dl
        className={cn(
          "grid overflow-hidden rounded-2xl bg-surface ring-1 ring-line",
          compact ? "grid-cols-2 sm:grid-cols-3" : "sm:grid-cols-3",
        )}
      >
        <div className={cn("border-b border-line sm:border-r sm:border-b-0", compact ? "p-4" : "p-5")}>
          <dt className="label text-ink-faint">Outcome</dt>
          <dd className={cn("mt-2 font-heading leading-none heading-type", compact ? "text-2xl" : "text-3xl")}>{item.metric}</dd>
          <dd className="text-body mt-2 text-ink-soft">{item.metricLabel}</dd>
        </div>
        <div className={cn("border-b border-line sm:border-r sm:border-b-0", compact ? "p-4" : "p-5")}>
          <dt className="label text-ink-faint">Sector</dt>
          <dd className="text-body mt-2">{item.tag}</dd>
        </div>
        <div className={cn(compact ? "col-span-2 border-line p-4 sm:col-span-1" : "p-5")}>
          <dt className="label text-ink-faint">Client</dt>
          <dd className="mt-2 flex min-w-0 flex-nowrap items-center gap-3 overflow-hidden">
            <ClientMark item={item} index={index} compact={compact} />
            <span className="text-body min-w-0 truncate whitespace-nowrap">{item.client}</span>
          </dd>
        </div>
      </dl>

      {(item.aboutClient || item.clientUrl) && (
        <section>
          <h3 className="label text-ink-faint">About the Client</h3>
          {item.aboutClient ? <p className={cn("text-body text-ink-soft", compact ? "mt-2" : "mt-3")}>{item.aboutClient}</p> : null}
          {item.clientUrl ? (
            <a
              href={item.clientUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex h-10 items-center gap-2 rounded-full bg-ink px-4 text-sm font-medium text-paper transition-colors hover:bg-signal hover:text-black"
            >
              Visit Client Site
              <ExternalLink className="size-3.5" aria-hidden />
            </a>
          ) : null}
        </section>
      )}

      <section>
        <h3 className="label text-ink-faint">Challenge</h3>
        <p className={cn("text-body text-ink-soft", compact ? "mt-2" : "mt-3")}>{item.text}</p>
      </section>
      {item.solution ? (
        <section>
          <h3 className="label text-ink-faint">Solution</h3>
          <p className={cn("text-body text-ink-soft", compact ? "mt-2" : "mt-3")}>{item.solution}</p>
        </section>
      ) : null}
      {item.impact.length ? (
        <section>
          <h3 className="label text-ink-faint">Impact</h3>
          <ul className={cn(compact ? "mt-3 space-y-2.5" : "mt-4 space-y-3")}>
            {item.impact.map((point) => (
              <li key={point} className="text-body flex gap-3 text-ink-soft">
                <span aria-hidden className="mt-[0.55em] size-1.5 shrink-0 rounded-full bg-signal" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {item.takeaway ? (
        <section className={cn("rounded-2xl bg-surface ring-1 ring-line", compact ? "p-4" : "p-6")}>
          <h3 className="label text-ink-faint">Takeaway</h3>
          <p className={cn(compact ? "text-body mt-2" : "text-lede mt-3")}>{item.takeaway}</p>
        </section>
      ) : null}
    </div>
  );
}
