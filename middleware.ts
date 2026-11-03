import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AuthService } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protege /dashboard — exige cookie JWT valido
  if (pathname.startsWith("/dashboard")) {
    const token = request.cookies.get("axiom_session")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // AuthService.verifyToken usa o mesmo JWT_SECRET de lib/auth.ts
    const session = await AuthService.verifyToken(token);
    if (!session) {
      const res = NextResponse.redirect(new URL("/login", request.url));
      res.cookies.delete("axiom_session");
      return res;
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
