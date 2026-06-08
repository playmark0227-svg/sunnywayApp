import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import type { Role } from "@prisma/client";

const COOKIE_NAME = "sw_session";

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "JWT_SECRET が未設定/短すぎます。.env を設定してください（.env.example 参照）。"
    );
  }
  return new TextEncoder().encode(secret);
}

function ttlSeconds(): number {
  const hours = Number(process.env.SESSION_TTL_HOURS ?? "12");
  return Math.max(1, hours) * 60 * 60;
}

export type SessionPayload = {
  userId: string;
  role: Role;
  name: string;
};

// ===== パスワード =====

export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

// ===== JWT セッション（httpOnly Cookie）=====

export async function createSession(payload: SessionPayload): Promise<void> {
  const token = await new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${ttlSeconds()}s`)
    .sign(getSecret());

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ttlSeconds(),
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return {
      userId: String(payload.userId),
      role: payload.role as Role,
      name: String(payload.name),
    };
  } catch {
    return null;
  }
}

// ===== ロールガード（サーバー側で必ず再検証する）=====

/** ADMIN 必須。未ログイン/権限不足はログインへリダイレクト。 */
export async function requireAdmin(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/login");
  }
  return session;
}

/** INFLUENCER 必須。未ログイン/権限不足はインフルエンサーログインへリダイレクト。 */
export async function requireInfluencer(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session || session.role !== "INFLUENCER") {
    redirect("/influencer/login");
  }
  return session;
}
