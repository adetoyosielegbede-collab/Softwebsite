import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const plate =
  "overflow-hidden rounded-[1.25rem] bg-surface ring-1 ring-line text-ink [--diagram-accent:var(--color-accent-ink)] [--diagram-tint:color-mix(in_srgb,var(--color-accent-ink)_12%,var(--color-surface))] [--diagram-line:color-mix(in_srgb,var(--color-accent-ink)_55%,transparent)]";

function DiagramShell({
  eyebrow,
  title,
  lead,
  note,
  children,
  className,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  note: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(plate, "px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10", className)}>
      <p className="label text-[color:var(--diagram-accent)]">{eyebrow}</p>
      <h3 className="mt-3 max-w-[22ch] font-heading text-[clamp(1.35rem,2.4vw,1.85rem)] leading-[1.12] heading-type">{title}</h3>
      <p className="mt-3 max-w-2xl text-sm leading-[1.5] text-ink-soft sm:text-base">{lead}</p>
      <div className="mt-8 sm:mt-10">{children}</div>
      <div className="mt-8 border-t border-line pt-4">
        <p className="text-xs leading-[1.5] text-ink-faint sm:text-sm">{note}</p>
      </div>
    </div>
  );
}

/** Citizens, businesses and teams sharing one Liquio foundation. */
export function LiquioFoundationDiagram() {
  const audiences = ["Citizens", "Businesses", "Public-service teams"] as const;

  return (
    <DiagramShell
      eyebrow="Liquio by Kitsoft / Digital services"
      title="One foundation. Services across departments."
      lead="Shared platform capabilities connect the public-facing service with the work behind it."
      note="Conceptual platform diagram. Integration and service scope are defined for each engagement."
    >
      <div className="mx-auto w-full max-w-3xl">
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {audiences.map((label) => (
            <div
              key={label}
              className="rounded-xl border border-line bg-surface px-2 py-3 text-center text-[0.7rem] font-medium leading-snug text-ink sm:rounded-2xl sm:px-4 sm:py-4 sm:text-sm"
            >
              {label}
            </div>
          ))}
        </div>

        <div className="relative mx-[16.66%] h-10 sm:h-12" aria-hidden>
          <span className="absolute top-0 left-0 h-1/2 w-px bg-[color:var(--diagram-line)]" />
          <span className="absolute top-0 left-1/2 h-1/2 w-px -translate-x-1/2 bg-[color:var(--diagram-line)]" />
          <span className="absolute top-0 right-0 h-1/2 w-px bg-[color:var(--diagram-line)]" />
          <span className="absolute top-1/2 right-0 left-0 h-px bg-[color:var(--diagram-line)]" />
          <span className="absolute top-1/2 left-1/2 h-1/2 w-px -translate-x-1/2 bg-[color:var(--diagram-line)]" />
        </div>

        <div className="rounded-2xl border border-[color:var(--diagram-line)] bg-[color:var(--diagram-tint)] px-4 py-5 sm:px-6 sm:py-6">
          <p className="font-heading text-lg text-[color:var(--diagram-accent)] heading-type sm:text-xl">Liquio</p>
          <p className="mt-2 text-sm leading-[1.45] text-[color:var(--diagram-accent)] sm:text-base">
            Service design / Forms and workflows / Registers and datasets / APIs
          </p>
        </div>

        <p className="mt-5 text-center text-sm leading-[1.45] text-ink-soft sm:mt-6 sm:text-base">
          Connect existing government systems and develop services on a common platform.
        </p>
      </div>
    </DiagramShell>
  );
}

/** Apply → Check → Review → Deliver service journey. */
export function LiquioJourneyDiagram() {
  const steps = [
    { n: "01", title: "Apply", text: "Capture information and supporting documents.", accent: false },
    { n: "02", title: "Check", text: "Connect the records needed for assessment.", accent: false },
    { n: "03", title: "Review", text: "Route work through the required approvals.", accent: true },
    { n: "04", title: "Deliver", text: "Issue the response or service document.", accent: false },
  ] as const;

  return (
    <DiagramShell
      eyebrow="Liquio by Kitsoft / Service delivery"
      title="Connect every stage of a public service."
      lead="An illustrative application journey, configured around the institution’s requirements."
      note="Illustrative workflow, not a product screenshot or a claim about a specific deployed service."
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] lg:items-stretch lg:gap-x-2 lg:gap-y-0">
        {steps.map((step, i) => (
          <div key={step.n} className="contents">
            <div className="flex flex-col">
              <span className="mb-2 font-mono text-[11px] tracking-wide text-[color:var(--diagram-accent)]">{step.n}</span>
              <div
                className={cn(
                  "flex h-full flex-col rounded-2xl border px-4 py-4 sm:px-5 sm:py-5",
                  step.accent
                    ? "border-[color:var(--diagram-line)] bg-[color:var(--diagram-tint)]"
                    : "border-line bg-surface",
                )}
              >
                <p
                  className={cn(
                    "font-heading text-lg leading-none heading-type",
                    step.accent ? "text-[color:var(--diagram-accent)]" : "text-ink",
                  )}
                >
                  {step.title}
                </p>
                <p className="mt-3 text-sm leading-[1.45] text-ink-soft">{step.text}</p>
              </div>
            </div>
            {i < steps.length - 1 ? (
              <div
                className="hidden items-center justify-center self-center pt-6 text-lg text-[color:var(--diagram-accent)] lg:flex"
                aria-hidden
              >
                →
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <p className="mt-6 text-center text-sm leading-[1.45] text-ink-soft sm:mt-8 sm:text-base">
        Forms, records and workflows follow the service from application to outcome.
      </p>
    </DiagramShell>
  );
}

const DIAGRAMS = {
  "liquio-foundation": LiquioFoundationDiagram,
  "liquio-journey": LiquioJourneyDiagram,
} as const;

export type PartnerDiagramId = keyof typeof DIAGRAMS;

export function PartnerDiagram({ id }: { id: string }) {
  const Diagram = DIAGRAMS[id as PartnerDiagramId];
  return Diagram ? <Diagram /> : null;
}

export function isPartnerDiagram(id: string | undefined): id is PartnerDiagramId {
  return !!id && id in DIAGRAMS;
}
