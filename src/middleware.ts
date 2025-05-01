import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";
import { getUserAuthorizationStatus } from "@/services/userService";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  console.log("Middleware triggered for pathname:", pathname);

  if (pathname.startsWith("/admin")) {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error("Middleware: Missing or invalid Authorization header", { authHeader });
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const idToken = authHeader.split("Bearer ")[1];
    try {
      const decodedToken = await adminAuth.verifyIdToken(idToken);
      const userId = decodedToken.uid;
      console.log("Middleware: Decoded token UID:", userId);

      const isAuthorized = await getUserAuthorizationStatus(userId);
      console.log("Middleware: User authorization status:", isAuthorized);

      if (!isAuthorized) {
        console.log("Middleware: User not authorized, redirecting to /customer/home");
        return NextResponse.redirect(new URL("/customer/home", req.url));
      }
      console.log("Middleware: User authorized, proceeding to /admin");
      return NextResponse.next();
    } catch (error: any) {
      console.error("Middleware error:", error.code, error.message);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  console.log("Middleware: Pathname does not match /admin, proceeding");
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};