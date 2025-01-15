import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { createAdminClient } from "./utils/supabase/admin";

const actualLinks = ["/", "/qr", "/alarm", "/code", "/compressor", "/counter", "/countdown", "/link"]

async function redirectMiddleware(request: NextRequest) {
  const supabase = createAdminClient();
  const domain = request.nextUrl.host;
  const pathname = request.nextUrl.pathname;

  const { data, error } = await supabase.from("links").select("*").eq("domain", domain).eq("enabled", true).eq("short_path", pathname.split("/")[1]).single()

  console.log(data, error)

  if (!error && data) {
    await supabase.from("clicks").insert([{ link_id: data.id, is_mobile: request.headers.get("user-agent")?.includes("Mobile"), referrer: request.headers.get("referer"), user_agent: request.headers.get("user-agent"), os: request.headers.get("user-agent")?.split(") ")[0].split("; ").pop() }])
    return Response.redirect(data.original_url)
  } else {
    return Response.redirect(`https://alfabeta.dk/`)
  }
}

export async function middleware(request: NextRequest) {
  if (actualLinks.includes(request.nextUrl.pathname)) {
    if (request.nextUrl.hostname !== 'alfabeta.dk' && request.nextUrl.hostname !== 'localhost') {
      return Response.redirect(`https://alfabeta.dk/`)
    }
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
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
