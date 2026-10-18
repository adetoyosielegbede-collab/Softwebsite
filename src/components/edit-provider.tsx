"use client";

import { createContext, useContext } from "react";

const EditContext = createContext(false);

export function EditProvider({
  editing,
  children,
}: {
  editing: boolean;
  children: React.ReactNode;
}) {
  return <EditContext.Provider value={editing}>{children}</EditContext.Provider>;
}

export function useEditing() {
  return useContext(EditContext);
}
