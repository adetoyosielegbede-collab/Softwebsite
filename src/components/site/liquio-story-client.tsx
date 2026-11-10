"use client";

import { useEffect, useRef } from "react";

const LAYERS: [string, string, string[]][] = [
  [
    "Citizen channels",
    "Where people meet the service.",
    [
      "AI Agent: a conversational guide that takes a citizen from a question to the right service, delivered",
      "Web Portal: an information hub and personal cabinet with every service in one place",
      "Mobile App: secure access to documents and the most-used services",
    ],
  ],
  [
    "Service Builder",
    "Where the service is designed, by analysts rather than backend engineers.",
    [
      "Low-code design of forms, steps, rules and approvals",
      "Business analysis tools to model the service before it is built",
      "Best-practice modules shaped by 200+ government services, ready to reuse",
    ],
  ],
  [
    "Integrations",
    "How the service reaches the data it needs.",
    [
      "API-first architecture that connects current and future systems",
      "120 ready-made integrations with government registers, already used by other public bodies",
      "Lower launch risk: integrations are proven before day one",
    ],
  ],
  [
    "Registers & datasets",
    "Where the government keeps its own records.",
    [
      "Create and manage government data stores",
      "Built with compliance requirements in mind",
      "Records stay with the institution",
    ],
  ],
  [
    "Open-source core",
    "What everything runs on.",
    [
      "Built on widely adopted open-source technologies most developers know",
      "Microservice architecture that scales on demand for national peaks",
      "Operated under an ISO/IEC 27001-certified information security management system",
    ],
  ],
];

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;");
}

/** Client shell: anatomy layer tabs + pulse sizing from the Liquio HTML brief. */
export function LiquioStoryClient({ html }: { html: string }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const tabs = Array.from(root.querySelectorAll<HTMLElement>(".layer"));
    const detail = root.querySelector<HTMLElement>("#detail");
    const layers = root.querySelector<HTMLElement>("#layers");
    const pulse = root.querySelector<HTMLElement>("#pulse");
    if (!detail || tabs.length === 0) return;

    const show = (index: number, focus = false) => {
      tabs.forEach((tab, k) => {
        tab.setAttribute("aria-selected", String(k === index));
        tab.tabIndex = k === index ? 0 : -1;
      });
      const layer = LAYERS[index];
      if (!layer) return;
      const [title, body, points] = layer;
      detail.setAttribute("aria-labelledby", tabs[index]?.id ?? "");
      detail.innerHTML = `<p class="label">Layer 0${index + 1}</p><h3>${escapeHtml(title)}</h3><p class="body">${escapeHtml(body)}</p><ul>${points
        .map((point) => `<li><span>${escapeHtml(point)}</span></li>`)
        .join("")}</ul>`;
      if (focus) tabs[index]?.focus();
    };

    const onClick = (event: Event) => {
      const index = tabs.indexOf(event.currentTarget as HTMLElement);
      if (index >= 0) show(index);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      const index = tabs.indexOf(event.currentTarget as HTMLElement);
      if (index < 0) return;
      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        event.preventDefault();
        show((index + 1) % tabs.length, true);
      }
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        event.preventDefault();
        show((index + tabs.length - 1) % tabs.length, true);
      }
    };

    tabs.forEach((tab) => {
      tab.addEventListener("click", onClick);
      tab.addEventListener("keydown", onKeyDown);
    });
    show(0);

    const sizePulse = () => {
      if (!layers || !pulse) return;
      pulse.style.setProperty("--h", `${layers.clientHeight - 44}px`);
    };
    sizePulse();
    const ro = layers && "ResizeObserver" in window ? new ResizeObserver(sizePulse) : null;
    if (layers && ro) ro.observe(layers);

    return () => {
      tabs.forEach((tab) => {
        tab.removeEventListener("click", onClick);
        tab.removeEventListener("keydown", onKeyDown);
      });
      ro?.disconnect();
    };
  }, [html]);

  return (
    <div
      ref={rootRef}
      className="liquio-page"
      // Static markup from the Softcom Liquio HTML brief; captions come from the CMS.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
