import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const secret = process.env.NEXTAUTH_SECRET || "dev-super-secret-key-for-local-testing-min-32-chars-long";

  // Protect /kernel administration routes
  if (pathname.startsWith("/kernel")) {
    const token = await getToken({
      req,
      secret,
    });

    // If already logged in as ADMIN, allow access
    if (token && token.role === "ADMIN") {
      return NextResponse.next();
    }

    // Otherwise, redirect to the hidden /kernel signin
    const url = new URL("/kernel/login", req.url);
    if (pathname !== "/kernel/login") {
      url.searchParams.set("callbackUrl", encodeURI(pathname));
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Legacy /admin redirect to /kernel
  if (pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/kernel", req.url));
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
  matcher: ["/kernel/:path*", "/admin/:path*", "/dashboard/:path*"],
};
