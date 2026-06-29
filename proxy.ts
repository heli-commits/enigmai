import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Routes that don't require auth.
// `/forgot-password` MUST be here: it's the recovery path for logged-out users,
// so the proxy must not bounce them to /login before they can request a reset.
// `/update-password` is intentionally NOT public — it's reached with a recovery
// session after the email-callback, and marking it public would redirect that
// authenticated user away to /dashboard before they can set a new password.
const PUBLIC_PATHS = ["/login", "/signup", "/forgot-password", "/auth/callback"];

// Copy any cookies the Supabase client wrote during session refresh onto a
// redirect response. Without this, a rotated (single-use) refresh token is lost
// whenever the proxy redirects, which logs the user straight back out.
function withRefreshedCookies(
  source: NextResponse,
  redirect: NextResponse
): NextResponse {
  source.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  return redirect;
}

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  // Create a Supabase client that can read/write cookies on the response
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(toSet) {
          toSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          toSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session – this also writes updated cookies to the response
  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  // Not authenticated → redirect to login (except for public + API routes)
  if (!user && !isPublic && !pathname.startsWith("/api")) {
    return withRefreshedCookies(
      response,
      NextResponse.redirect(new URL("/login", request.url))
    );
  }

  // Already authenticated → redirect away from auth pages
  if (user && isPublic && pathname !== "/auth/callback") {
    return withRefreshedCookies(
      response,
      NextResponse.redirect(new URL("/dashboard", request.url))
    );
  }

  return response;
}

export const config = {
  matcher: [
    // Run on all routes except Next.js internals and static assets
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
