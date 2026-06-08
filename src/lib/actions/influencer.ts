"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireInfluencer } from "@/lib/auth";
import type { FormState } from "@/lib/actions/auth";

async function myProfileId(): Promise<string> {
  const session = await requireInfluencer();
  const profile = await prisma.influencerProfile.findUnique({
    where: { userId: session.userId },
    select: { id: true },
  });
  if (!profile) throw new Error("インフルエンサープロフィールが見つかりません");
  return profile.id;
}

const applySchema = z.object({
  campaignId: z.string().min(1),
  message: z.string().max(500).optional().default(""),
});

/** 募集中キャンペーンへ応募。OPEN 以外や二重応募は弾く。 */
export async function applyToCampaignAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const influencerId = await myProfileId();
  const parsed = applySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "入力エラー" };
  }

  const campaign = await prisma.campaign.findUnique({
    where: { id: parsed.data.campaignId },
    select: { status: true },
  });
  if (!campaign || campaign.status !== "OPEN") {
    return { error: "この案件は現在応募できません" };
  }

  const dup = await prisma.application.findUnique({
    where: {
      campaignId_influencerId: {
        campaignId: parsed.data.campaignId,
        influencerId,
      },
    },
  });
  if (dup) return { error: "すでに応募済みです" };

  await prisma.application.create({
    data: {
      campaignId: parsed.data.campaignId,
      influencerId,
      message: parsed.data.message,
      status: "APPLIED",
    },
  });
  revalidatePath("/app");
  revalidatePath("/app/mine");
  return { ok: true };
}

const submitSchema = z.object({
  applicationId: z.string().min(1),
  postUrl: z.string().url("投稿 URL の形式が正しくありません"),
  postReach: z.coerce.number().int().min(0).default(0),
});

/** 投稿提出（取り上げ実績）。承認済みの自分の応募のみ。 */
export async function submitPostAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const influencerId = await myProfileId();
  const parsed = submitSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "入力エラー" };
  }

  const app = await prisma.application.findUnique({
    where: { id: parsed.data.applicationId },
    select: { influencerId: true, status: true },
  });
  // 自分のものか & 承認済みかをサーバー側で必ず確認
  if (!app || app.influencerId !== influencerId) {
    return { error: "対象の応募が見つかりません" };
  }
  if (app.status !== "APPROVED" && app.status !== "POSTED") {
    return { error: "承認後に投稿を提出できます" };
  }

  await prisma.application.update({
    where: { id: parsed.data.applicationId },
    data: {
      postUrl: parsed.data.postUrl,
      postReach: parsed.data.postReach,
      postedAt: new Date(),
      status: "POSTED",
    },
  });
  revalidatePath("/app/mine");
  return { ok: true };
}

const profileSchema = z.object({
  bio: z.string().max(500).optional().default(""),
  shippingAddress: z.string().max(500).optional().default(""),
  followers: z.coerce.number().int().min(0).default(0),
});

export async function updateProfileAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const influencerId = await myProfileId();
  const parsed = profileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "入力エラー" };
  }
  await prisma.influencerProfile.update({
    where: { id: influencerId },
    data: parsed.data,
  });
  revalidatePath("/app/mine");
  return { ok: true };
}
