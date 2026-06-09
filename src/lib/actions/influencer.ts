"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireInfluencer } from "@/lib/auth";
import type { FormState } from "@/lib/actions/auth";

async function myProfile() {
  const session = await requireInfluencer();
  const profile = await prisma.influencerProfile.findUnique({
    where: { userId: session.userId },
    select: { id: true, userId: true, favorites: true },
  });
  if (!profile) throw new Error("プロフィールが見つかりません");
  return profile;
}

// ===== 応募 =====
const applySchema = z.object({ campaignId: z.string().min(1), message: z.string().max(500).optional().default("") });
export async function applyToCampaignAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const me = await myProfile();
  const parsed = applySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "入力エラー" };
  const campaign = await prisma.campaign.findUnique({ where: { id: parsed.data.campaignId }, select: { status: true } });
  if (!campaign || campaign.status !== "OPEN") return { error: "この案件は現在応募できません" };
  const dup = await prisma.application.findUnique({ where: { campaignId_influencerId: { campaignId: parsed.data.campaignId, influencerId: me.id } } });
  if (dup) return { error: "すでに応募済みです" };
  await prisma.application.create({ data: { campaignId: parsed.data.campaignId, influencerId: me.id, message: parsed.data.message, status: "APPLIED" } });
  revalidatePath("/app");
  revalidatePath("/app/manage");
  return { ok: true };
}

// ===== 投稿提出（→ チェック中 SUBMITTED）=====
const submitSchema = z.object({ applicationId: z.string().min(1), postUrl: z.string().url("投稿 URL の形式が正しくありません"), postReach: z.coerce.number().int().min(0).default(0) });
export async function submitPostAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const me = await myProfile();
  const parsed = submitSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "入力エラー" };
  const app = await prisma.application.findUnique({ where: { id: parsed.data.applicationId }, select: { influencerId: true, status: true } });
  if (!app || app.influencerId !== me.id) return { error: "対象の応募が見つかりません" };
  if (app.status !== "APPROVED" && app.status !== "SUBMITTED") return { error: "採用後に投稿を提出できます" };
  await prisma.application.update({ where: { id: parsed.data.applicationId }, data: { postUrl: parsed.data.postUrl, postReach: parsed.data.postReach, postedAt: new Date(), status: "SUBMITTED" } });
  revalidatePath("/app/manage");
  return { ok: true };
}

// ===== プロフィール / 住所 / 振込先 =====
const profileSchema = z.object({ name: z.string().min(1, "お名前を入力してください"), bio: z.string().max(500).optional().default(""), followers: z.coerce.number().int().min(0).default(0) });
export async function updateProfileAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const me = await myProfile();
  const parsed = profileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "入力エラー" };
  await prisma.influencerProfile.update({ where: { id: me.id }, data: { bio: parsed.data.bio, followers: parsed.data.followers } });
  await prisma.user.update({ where: { id: me.userId }, data: { name: parsed.data.name } });
  revalidatePath("/app/me");
  return { ok: true };
}
export async function updateAddressAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const me = await myProfile();
  await prisma.influencerProfile.update({ where: { id: me.id }, data: { shippingAddress: String(formData.get("address") ?? "") } });
  revalidatePath("/app/me");
  return { ok: true };
}
export async function updateBankAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const me = await myProfile();
  await prisma.influencerProfile.update({ where: { id: me.id }, data: { bank: String(formData.get("bank") ?? "") } });
  revalidatePath("/app/me");
  return { ok: true };
}

// ===== トグル系（bind して form から呼ぶ）=====
export async function toggleSnsAction(which: "ig" | "tt"): Promise<void> {
  const me = await myProfile();
  const p = await prisma.influencerProfile.findUnique({ where: { id: me.id }, select: { igLinked: true, ttLinked: true } });
  await prisma.influencerProfile.update({ where: { id: me.id }, data: which === "ig" ? { igLinked: !p!.igLinked } : { ttLinked: !p!.ttLinked } });
  revalidatePath("/app/me/sns");
}
export async function setNotifyAction(value: boolean): Promise<void> {
  const me = await myProfile();
  await prisma.influencerProfile.update({ where: { id: me.id }, data: { notify: value } });
  revalidatePath("/app/me/notify");
}
export async function toggleFavoriteAction(campaignId: string): Promise<void> {
  const me = await myProfile();
  const set = new Set(me.favorites.split(",").map((s) => s.trim()).filter(Boolean));
  set.has(campaignId) ? set.delete(campaignId) : set.add(campaignId);
  await prisma.influencerProfile.update({ where: { id: me.id }, data: { favorites: [...set].join(",") } });
  revalidatePath("/app");
}

// ===== メッセージ =====
const msgSchema = z.object({ text: z.string().min(1).max(1000) });
export async function sendMessageAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const me = await myProfile();
  const parsed = msgSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "メッセージを入力してください" };
  await prisma.message.create({ data: { influencerId: me.id, fromStaff: false, text: parsed.data.text } });
  // デモ: 運営から自動返信
  await prisma.message.create({ data: { influencerId: me.id, fromStaff: true, text: "ありがとうございます。担当より追ってご連絡します。" } });
  revalidatePath("/app/inbox");
  return { ok: true };
}
