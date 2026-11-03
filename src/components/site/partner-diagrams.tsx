"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { PartnerDiagramId } from "./partner-diagram-ids";
import "./solution-illustrations.css";

export type { PartnerDiagramId } from "./partner-diagram-ids";
export { isPartnerDiagram } from "./partner-diagram-ids";

function useArtTheme() {
  const [theme, setTheme] = useState<"th-light" | "th-dark">("th-light");
  useEffect(() => {
    const root = document.documentElement;
    const read = () => setTheme(root.classList.contains("dark") ? "th-dark" : "th-light");
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return theme;
}

function DiagramShell({
  eyebrow,
  title,
  lead,
  note,
  children,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  note: string;
  children: ReactNode;
}) {
  const theme = useArtTheme();
  return (
    <div className="sc-di">
      <div className={cn("pd-board", theme)}>
        <p className="pd-eyebrow">{eyebrow}</p>
        <h3 className="pd-title">{title}</h3>
        <p className="pd-lead">{lead}</p>
        <div className="pd-body">{children}</div>
        <p className="pd-note">{note}</p>
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
      <div className="pd-foundation">
        <div className="pd-audience">
          {audiences.map((label) => (
            <div key={label} className="pd-node">
              <span className="pd-cdot" aria-hidden />
              <span>{label}</span>
            </div>
          ))}
        </div>

        <svg className="pd-tree" viewBox="0 0 600 56" aria-hidden>
          <path className="pd-flow" d="M100 0 V22 H300 V56" />
          <path className="pd-flow" d="M300 0 V22" />
          <path className="pd-flow" d="M500 0 V22 H300" />
          <circle className="pd-dot" cx="100" cy="0" r="2.5" />
          <circle className="pd-dot" cx="300" cy="0" r="2.5" />
          <circle className="pd-dot" cx="500" cy="0" r="2.5" />
          <circle className="pd-dot" cx="300" cy="56" r="2.5" />
        </svg>

        <div className="pd-hub">
          <div className="pd-hub-head">
            <span className="pd-cdot" aria-hidden />
            <span>Liquio</span>
          </div>
          <p>Service design / Forms and workflows / Registers and datasets / APIs</p>
        </div>

        <p className="pd-caption">Connect existing government systems and develop services on a common platform.</p>
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
      <div className="pd-journey">
        {steps.map((step, i) => (
          <div key={step.n} className="contents">
            <div className="pd-step">
              <span className="pd-step-n">{step.n}</span>
              <div className={cn("pd-node pd-step-card", step.accent && "on")}>
                <div className="pd-hub-head">
                  <span className="pd-cdot" aria-hidden />
                  <span>{step.title}</span>
                </div>
                <p>{step.text}</p>
              </div>
            </div>
            {i < steps.length - 1 ? (
              <svg className="pd-arrow" viewBox="0 0 28 16" aria-hidden>
                <path className="pd-flow" d="M1 8 H22" />
                <path className="pd-flow" d="M18 3 L24 8 L18 13" />
              </svg>
            ) : null}
          </div>
        ))}
      </div>
      <p className="pd-caption">Forms, records and workflows follow the service from application to outcome.</p>
    </DiagramShell>
  );
}

/** Institutions connected through RTGS.global and Funds Controllers. */
export function RtgsNetworkDiagram() {
  return (
    <DiagramShell
      eyebrow="RTGS.global / Network"
      title="Connect payment operations to shared settlement infrastructure."
      lead="A conceptual view of participating institutions, the network and Funds Controllers."
      note="Conceptual network diagram. Participation and available services depend on the agreed implementation."
    >
      <div className="pd-network">
        <div className="pd-network-row">
          <div className="pd-node pd-network-card">
            <div className="pd-hub-head">
              <span className="pd-cdot" aria-hidden />
              <span>Institution A</span>
            </div>
            <p>
              Payments and treasury
              <br />
              Connected internal systems
            </p>
          </div>
          <svg className="pd-arrow pd-network-arrow" viewBox="0 0 28 16" aria-hidden>
            <path className="pd-flow" d="M1 8 H22" />
            <path className="pd-flow" d="M18 3 L24 8 L18 13" />
          </svg>
          <div className="pd-hub pd-network-hub">
            <div className="pd-hub-head">
              <span className="pd-cdot" aria-hidden />
              <span>RTGS.global</span>
            </div>
            <p>
              Payment instructions
              <br />
              Settlement and notifications
            </p>
          </div>
          <svg className="pd-arrow pd-network-arrow" viewBox="0 0 28 16" aria-hidden>
            <path className="pd-flow" d="M1 8 H22" />
            <path className="pd-flow" d="M18 3 L24 8 L18 13" />
          </svg>
          <div className="pd-node pd-network-card">
            <div className="pd-hub-head">
              <span className="pd-cdot" aria-hidden />
              <span>Institution B</span>
            </div>
            <p>
              Payments and treasury
              <br />
              Connected internal systems
            </p>
          </div>
        </div>

        <svg className="pd-network-stem" viewBox="0 0 40 36" aria-hidden>
          <path className="pd-flow" d="M20 0 V36" />
          <circle className="pd-dot" cx="20" cy="0" r="2.5" />
          <circle className="pd-dot" cx="20" cy="36" r="2.5" />
        </svg>

        <div className="pd-node pd-network-card pd-network-funds">
          <div className="pd-hub-head">
            <span className="pd-cdot" aria-hidden />
            <span>Funds Controllers</span>
          </div>
          <p>Account and payment-processing services</p>
        </div>
      </div>
    </DiagramShell>
  );
}

/** Agree → Link → Settle FX settlement journey. */
export function RtgsSettlementDiagram() {
  const steps = [
    { n: "01", title: "Agree the trade", text: "Participants agree the currencies, amounts and rate.", accent: false },
    { n: "02", title: "Link the instructions", text: "Each participant submits its settlement instruction.", accent: true },
    { n: "03", title: "Settle and confirm", text: "The network links the requests; accounts and balances update.", accent: false },
  ] as const;

  return (
    <DiagramShell
      eyebrow="RTGS.global / FX settlement"
      title="Two payment instructions. One linked FX settlement."
      lead="Payment-versus-payment settlement after counterparties have agreed a trade."
      note="Concept illustration based on the RTGS.global Link and Settle service."
    >
      <div className="pd-journey pd-settlement">
        {steps.map((step, i) => (
          <div key={step.n} className="contents">
            <div className="pd-step">
              <span className="pd-step-n">{step.n}</span>
              <div className={cn("pd-node pd-step-card", step.accent && "on")}>
                <div className="pd-hub-head">
                  <span className="pd-cdot" aria-hidden />
                  <span>{step.title}</span>
                </div>
                <p>{step.text}</p>
              </div>
            </div>
            {i < steps.length - 1 ? (
              <svg className="pd-arrow" viewBox="0 0 28 16" aria-hidden>
                <path className="pd-flow" d="M1 8 H22" />
                <path className="pd-flow" d="M18 3 L24 8 L18 13" />
              </svg>
            ) : null}
          </div>
        ))}
      </div>
      <p className="pd-caption">Settlement requires matching instructions and sufficient funds.</p>
    </DiagramShell>
  );
}

/** Account tower — same construction as Solutions financial art. */
function IsoTower({
  x,
  y,
  d = 12,
  accent,
}: {
  x: number;
  y: number;
  d?: number;
  accent?: boolean;
}) {
  const top = accent ? "at" : "bt";
  const left = accent ? "al" : "bl";
  const right = accent ? "ar" : "br";
  return (
    <g transform={`translate(${x},${y})`}>
      <rect className={top} width="10" height="10" transform={`matrix(1 .5 -1 .5 0 ${-d})`} />
      <rect className={left} width="10" height={d} transform={`matrix(1 .5 0 1 -10 ${-d / 2})`} />
      <rect className={right} width="10" height={d} transform={`matrix(-1 .5 0 1 10 ${-d / 2})`} />
    </g>
  );
}

/** Pure isometric fund-flow — Solutions language, illustration only. */
export function SentinelConnectionsDiagram() {
  const theme = useArtTheme();

  return (
    <div className="sc-ai pd-sentinel">
      <svg
        className={cn("iso pd-sentinel-svg", theme)}
        viewBox="0 0 460 280"
        role="img"
        aria-label="Isometric network of accounts with funds moving along a circular transfer path"
      >
        <g transform="translate(230,152)">
          <rect className="sf" width="190" height="170" transform="matrix(1 .5 -1 .5 0 -14)" />
          <rect className="sl" width="190" height="14" transform="matrix(1 .5 0 1 -170 71)" />
          <rect className="sr" width="190" height="14" transform="matrix(-1 .5 0 1 190 71)" />
        </g>

        <g transform="translate(230,136)">
          <g transform="matrix(1 .5 -1 .5 0 0)">
            <path
              className="edge"
              d="M18 22L54 12M54 12L96 28M18 22L28 58M96 28L118 62M28 58L70 50M70 50L118 62M28 58L42 96M118 62L124 104M42 96L86 90M96 28L70 50M18 22L70 50M42 96L86 90"
            />
            <path className="flow" d="M54 12L70 50L86 90L124 104" />
            <path className="flow pd-sentinel-flow-loop" d="M54 12L70 50L42 96L54 12" />
          </g>

          <IsoTower x={-12} y={18} d={12} />
          <IsoTower x={36} y={12} d={18} accent />
          <IsoTower x={-48} y={42} d={14} />
          <IsoTower x={68} y={48} d={10} />
          <IsoTower x={8} y={52} d={20} accent />
          <IsoTower x={-78} y={66} d={10} />
          <IsoTower x={48} y={78} d={12} />
          <IsoTower x={-24} y={84} d={14} accent />
          <IsoTower x={4} y={108} d={28} accent />

          <g className="pd-sentinel-packets" aria-hidden>
            <circle className="dot run-ab" cx="36" cy="4" r="3.4" />
            <circle className="dot run-ab d2" cx="36" cy="4" r="3.4" />
            <circle className="dot run-bc" cx="8" cy="42" r="3.4" />
            <circle className="dot run-ca d3" cx="-24" cy="74" r="3.4" />
          </g>
        </g>
      </svg>
    </div>
  );
}


const DIAGRAMS: Record<PartnerDiagramId, () => ReactNode> = {
  "liquio-foundation": LiquioFoundationDiagram,
  "liquio-journey": LiquioJourneyDiagram,
  "rtgs-network": RtgsNetworkDiagram,
  "rtgs-settlement": RtgsSettlementDiagram,
  "sentinel-connections": SentinelConnectionsDiagram,
};

export function PartnerDiagram({ id }: { id: string }) {
  const Diagram = DIAGRAMS[id as PartnerDiagramId];
  return Diagram ? <Diagram /> : null;
}
