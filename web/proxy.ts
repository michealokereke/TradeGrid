// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const authPages = ["/login", "/register"];
const protectedPages = ["/dashboard"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const access_Token_name = process.env.NEXT_PUBLIC_ACCESS_COOKIE_NAME!;
  const refresh_Token_Name = process.env.NEXT_PUBLIC_REFRESH_COOKIE_NAME!;

  const access_Token = req.cookies.get(access_Token_name)?.value;
  const refresh_Token = req.cookies.get(refresh_Token_Name)?.value;
  const isLoggedIn = access_Token || refresh_Token;

  const isAuthPage = authPages.some((page) => pathname.startsWith(page));
  const isProtectedPage = protectedPages.some((page) =>
    pathname.startsWith(page)
  );

  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (isProtectedPage && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
