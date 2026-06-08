import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Edge ミドルウェアでの一次防御。最終的な権限判定は各サーバーコンポーネント/
// サーバーアクション側（src/lib/auth.ts の requireAdmin/requireInfluencer）でも必ず行う。

const COOKIE_NAME = "sw_session";

async function readRole(req: NextRequest): Promise<string | null> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? "");
    const { payload } = await jwtVerify(token, secret);
    return (payload.role as string) ?? null;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const role = await readRole(req);

  // 管理画面: ADMIN 以外は管理ログインへ
  if (pathname.startsWith("/admin")) {
    if (role !== "ADMIN") {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  // インフルエンサーアプリ: INFLUENCER 以外はインフルログインへ
  if (pathname.startsWith("/app")) {
    if (role !== "INFLUENCER") {
      const url = req.nextUrl.clone();
      url.pathname = "/influencer/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/app/:path*"],
};
