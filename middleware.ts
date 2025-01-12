import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { createAdminClient } from "./utils/supabase/admin";

async function redirectMiddleware(request: NextRequest) {
  const supabase = createAdminClient();
  const domain = request.nextUrl.host;
  const pathname = request.nextUrl.pathname;

  const { data, error } = await supabase.from("links").select("*").eq("domain", domain).eq("active", true).eq("short_path", pathname.split("/")[1]).single()

  if (!error && data) {
    return Response.redirect(data.original_url)
  } else {
    return Response.redirect(`https://${request.nextUrl.host}/`)
  }
}

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/') {
    return await updateSession(request);
  } else {
    return await redirectMiddleware(request);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
