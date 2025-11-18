import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const userCookie = req.cookies.get("user");
  const user = userCookie ? JSON.parse(userCookie.value) : null;

  const signupCookie = req.cookies.get("signup");

  // ADULT 전용 라우트 보호
  if (pathname.startsWith("/adult") || pathname.startsWith("/team")) {
    if (!user || user.role !== "ADULT") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // mypage/[id] 보호
  if (pathname.startsWith("/mypage")) {
    if (!user) return NextResponse.redirect(new URL("/", req.url));
    const id = pathname.split("/")[2];
    if (id && Number(id) !== Number(user.memberId)) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // questions 보호
  if (pathname.startsWith("/questions")) {
    if (user) return NextResponse.redirect(new URL("/", req.url)); // 이미 로그인한 유저 접근 금지
    if (!signupCookie) return NextResponse.redirect(new URL("/", req.url)); // signup 쿠키 없으면 접근 금지
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/adult/:path*",
    "/mypage/:path*",
  ],
};
