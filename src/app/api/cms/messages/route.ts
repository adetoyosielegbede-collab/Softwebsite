import { unauthorized } from "@/lib/cms/api";
import { readMessages } from "@/lib/cms/storage";

export async function GET() {
  const denied = await unauthorized();
  if (denied) return denied;
  return Response.json(await readMessages(), { headers: { "Cache-Control": "no-store" } });
}
