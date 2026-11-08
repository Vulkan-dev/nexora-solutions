import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const secret = process.env.NEXTAUTH_SECRET || "dev-super-secret-key-for-local-testing-min-32-chars-long";

  // Protect /admin routes
  if (pathname.startsWith("/admin")) {
    const token = await getToken({
      req,
      secret,
    });

    if (!token) {
      const url = new URL("/auth/signin", req.url);
      url.searchParams.set("callbackUrl", encodeURI(pathname));
      return NextResponse.redirect(url);
    }

    if (token.role !== "ADMIN") {
      // Forbidden: redirect to customer dashboard or home
      return NextResponse.redirect(new URL("/dashboard?error=unauthorized", req.url));
    }
  }

  // Protect /dashboard routes (Customer must be logged in)
  if (pathname.startsWith("/dashboard")) {
    const token = await getToken({
      req,
      secret,
    });

    if (!token) {
      const url = new URL("/auth/signin", req.url);
      url.searchParams.set("callbackUrl", encodeURI(pathname));
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
