"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import {
  hashPassword,
  verifyPassword,
  createSession,
  destroySession,
} from "@/lib/auth";

export type FormState = { error?: string; ok?: boolean; message?: string } | undefined;

const loginSchema = z.object({
  email: z.string().email("メールアドレスの形式が正しくありません"),
  password: z.string().min(1, "パスワードを入力してください"),
});

/** ログイン（ADMIN / INFLUENCER 共通）。expectedRole で入口を分離する。 */
export async function loginAction(
  expectedRole: "ADMIN" | "INFLUENCER",
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "入力エラー" };
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });
  // ユーザー有無を区別しない（列挙攻撃対策）
  if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
    return { error: "メールアドレスまたはパスワードが違います" };
  }
  if (user.role !== expectedRole) {
    return {
      error:
        expectedRole === "ADMIN"
          ? "この入口は運営（管理者）専用です"
          : "この入口はインフルエンサー専用です",
    };
  }

  await createSession({ userId: user.id, role: user.role, name: user.name });
  redirect(expectedRole === "ADMIN" ? "/admin" : "/app");
}

const registerSchema = z.object({
  name: z.string().min(1, "お名前を入力してください"),
  email: z.string().email("メールアドレスの形式が正しくありません"),
  password: z.string().min(8, "パスワードは8文字以上にしてください"),
  handle: z.string().min(2, "SNS ハンドルを入力してください"),
  platform: z.string().default("INSTAGRAM"),
  followers: z.coerce.number().int().min(0).default(0),
});

/** インフルエンサーのセルフ登録。ADMIN はセルフ登録不可（運営が発行）。 */
export async function registerInfluencerAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    handle: formData.get("handle"),
    platform: formData.get("platform") ?? "INSTAGRAM",
    followers: formData.get("followers") ?? 0,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "入力エラー" };
  }

  const email = parsed.data.email.toLowerCase();
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return { error: "このメールアドレスは既に登録されています" };
  }
  const handleExists = await prisma.influencerProfile.findUnique({
    where: { handle: parsed.data.handle },
  });
  if (handleExists) {
    return { error: "このハンドルは既に使われています" };
  }

  const user = await prisma.user.create({
    data: {
      email,
      name: parsed.data.name,
      role: "INFLUENCER",
      passwordHash: await hashPassword(parsed.data.password),
      influencer: {
        create: {
          handle: parsed.data.handle,
          platform: parsed.data.platform,
          followers: parsed.data.followers,
        },
      },
    },
  });

  await createSession({ userId: user.id, role: "INFLUENCER", name: user.name });
  redirect("/app");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/");
}
