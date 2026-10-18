import { isAuthenticated, usingDevPassword } from "@/lib/cms/auth";
import { storageMode } from "@/lib/cms/storage";

export async function GET() {
  const mode = storageMode();
  return Response.json(
    {
      authenticated: await isAuthenticated(),
      mode,
      devPassword: usingDevPassword(),
      // Vercel (and similar) serves a read-only filesystem, so local writes cannot persist.
      readOnly: mode === "local" && Boolean(process.env.VERCEL),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
