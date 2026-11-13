"use client";

import { createContext, useContext } from "react";

const CmsEditingContext = createContext(false);

/** Server passes whether this response has a signed-in studio session. */
export function CmsEditingProvider({ enabled, children }: { enabled: boolean; children: React.ReactNode }) {
  return <CmsEditingContext.Provider value={enabled}>{children}</CmsEditingContext.Provider>;
}

export function useCmsEditing() {
  return useContext(CmsEditingContext);
}
