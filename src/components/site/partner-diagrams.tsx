"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { PartnerDiagramId } from "./partner-diagram-ids";
import "./solution-illustrations.css";

export type { PartnerDiagramId } from "./partner-diagram-ids";
export { isPartnerDiagram } from "./partner-diagram-ids";

function useArtTheme() {
  const [theme, setTheme] = useState<"th-light" | "th-dark">("th-dark");
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

/** Account tower in Solutions isometric language — no captions. */
function IsoAccount({
  x,
  y,
  accent,
  wire,
  size = 12,
  rise = 14,
}: {
  x: number;
  y: number;
  accent?: boolean;
  wire?: boolean;
  size?: number;
  rise?: number;
}) {
  if (wire) {
    return (
      <g transform={`translate(${x},${y})`}>
        <rect className="win" width={size} height={size} transform={`matrix(1 .5 -1 .5 0 ${-rise})`} />
        <rect className="win" width={size} height={rise} transform={`matrix(1 .5 0 1 ${-size} ${-(rise / 2)})`} />
        <rect className="win" width={size} height={rise} transform={`matrix(-1 .5 0 1 ${size} ${-(rise / 2)})`} />
      </g>
    );
  }
  const top = accent ? "at" : "bt";
  const left = accent ? "al" : "bl";
  const right = accent ? "ar" : "br";
  return (
    <g transform={`translate(${x},${y})`}>
      <rect
        className={top}
        width={size}
        height={size}
        transform={`matrix(1 .5 -1 .5 0 ${-rise})`}
      />
      <rect
        className={left}
        width={size}
        height={rise}
        transform={`matrix(1 .5 0 1 ${-size} ${-(rise / 2)})`}
      />
      <rect
        className={right}
        width={size}
        height={rise}
        transform={`matrix(-1 .5 0 1 ${size} ${-(rise / 2)})`}
      />
      {accent ? <circle className="ring" cx="0" cy={-(rise / 4)} r={size + 7} /> : null}
    </g>
  );
}

/**
 * Hero figure: circular fund-flow diagram (A→B→C→A amid surrounding accounts)
 * redrawn as Solutions isometric art sized to fill the hero column.
 */
export function SentinelConnectionsDiagram() {
  const theme = useArtTheme();

  return (
    <div className="sc-ai pd-sentinel">
      <svg
        className={cn("iso pd-sentinel-svg", theme)}
        viewBox="48 8 464 340"
        role="img"
        aria-label="Isometric network of accounts with funds circulating on a selected path"
      >
        <g transform="translate(280,188)">
          <rect className="sf" width="248" height="220" transform="matrix(1 .5 -1 .5 0 -20)" />
          <rect className="sl" width="248" height="20" transform="matrix(1 .5 0 1 -220 90)" />
          <rect className="sr" width="248" height="20" transform="matrix(-1 .5 0 1 248 90)" />
        </g>

        <g transform="translate(280,160)">
          <g transform="matrix(1 .5 -1 .5 0 0)">
            <path
              className="edge"
              d="M24 18 L108 6 M108 6 L188 34 M24 18 L40 92 M188 34 L210 116 M40 92 L124 86 M124 86 L210 116 M40 92 L82 164 M210 116 L168 172 M24 18 L124 86 M108 6 L124 86 M82 164 L168 172 M82 164 L24 18"
            />
            <path className="flow" d="M24 18 L108 6 L124 86 L24 18" />
            <path className="flow pd-sentinel-flow-b" d="M24 18 L108 6 L124 86 L24 18" />
          </g>

          {/* Surrounding field — solid + wireframe towers */}
          <IsoAccount x={-108} y={28} size={11} rise={11} wire />
          <IsoAccount x={-52} y={-16} size={11} rise={13} />
          <IsoAccount x={102} y={-14} size={11} rise={11} wire />
          <IsoAccount x={158} y={42} size={11} rise={12} />
          <IsoAccount x={-138} y={88} size={10} rise={10} wire />
          <IsoAccount x={122} y={108} size={10} rise={11} wire />
          <IsoAccount x={-14} y={138} size={11} rise={12} />
          <IsoAccount x={64} y={132} size={10} rise={10} wire />

          {/* Selected circular path — A · B · C */}
          <IsoAccount x={-86} y={6} size={16} rise={20} accent />
          <IsoAccount x={58} y={-26} size={16} rise={22} accent />
          <IsoAccount x={22} y={58} size={16} rise={24} accent />

          {/* Neighbours on secondary edges — D · E */}
          <IsoAccount x={136} y={36} size={13} rise={15} />
          <IsoAccount x={-34} y={116} size={13} rise={15} />

          <g className="pd-sentinel-packets" aria-hidden>
            <circle className="dot run-x" cx="-52" cy="-12" r="4" />
            <circle className="dot run-x d2" cx="16" cy="4" r="4" />
            <circle className="dot run-y d3" cx="-4" cy="40" r="4" />
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
