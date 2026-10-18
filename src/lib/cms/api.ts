import "server-only";
import { revalidatePath } from "next/cache";
import { isAuthenticated } from "@/lib/cms/auth";

export async function unauthorized(): Promise<Response | null> {
  if (await isAuthenticated()) return null;
  return Response.json({ error: "Not signed in" }, { status: 401 });
}

export function errorResponse(error: unknown, status = 500): Response {
  const message = error instanceof Error ? error.message : String(error);
  console.error("[cms]", message);
  return Response.json({ error: message }, { status });
}

export function revalidateSite() {
  revalidatePath("/", "layout");
}
