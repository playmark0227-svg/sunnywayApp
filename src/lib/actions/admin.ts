"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import type { FormState } from "@/lib/actions/auth";

// すべての管理アクションは requireAdmin() でサーバー側再検証 → 監査ログ記録、を徹底する。

const brandSchema = z.object({
  name: z.string().min(1, "ブランド名を入力してください"),
  contactName: z.string().optional().default(""),
  contactEmail: z.string().email().or(z.literal("")).optional().default(""),
  monthlyFeeYen: z.coerce.number().int().min(0).default(0),
  notes: z.string().optional().default(""),
});

export async function createBrandAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const admin = await requireAdmin();
  const parsed = brandSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "入力エラー" };
  }
  const brand = await prisma.brand.create({ data: parsed.data });
  await recordAudit({
    actorId: admin.userId,
    action: "brand.create",
    target: brand.id,
    meta: { name: brand.name },
  });
  revalidatePath("/admin/brands");
  return { ok: true };
}

const productSchema = z.object({
  brandId: z.string().min(1, "ブランドを選択してください"),
  name: z.string().min(1, "商品名を入力してください"),
  category: z.string().default("スキンケア"),
  description: z.string().optional().default(""),
  imageUrl: z.string().max(3_000_000, "画像が大きすぎます").optional().default(""),
  retailPriceYen: z.coerce.number().int().min(0).default(0),
});

export async function createProductAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const admin = await requireAdmin();
  const parsed = productSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "入力エラー" };
  }
  const product = await prisma.product.create({ data: parsed.data });
  await recordAudit({
    actorId: admin.userId,
    action: "product.create",
    target: product.id,
    meta: { name: product.name, brandId: product.brandId },
  });
  revalidatePath("/admin/products");
  return { ok: true };
}

const campaignSchema = z.object({
  productId: z.string().min(1, "商品を選択してください"),
  title: z.string().min(1, "タイトルを入力してください"),
  brief: z.string().optional().default(""),
  targetInfluencers: z.coerce.number().int().min(1, "目標人数は1以上"),
  rewardType: z.enum(["GIFTING", "PAID", "BOTH", "OTHER"]),
  rewardYen: z.coerce.number().int().min(0).default(0),
  campaignFeeYen: z.coerce.number().int().min(0).default(0),
  salesCommissionPct: z.coerce.number().int().min(0).max(100).default(0),
  media: z.string().default("Instagram Feed"),
  tags: z.string().optional().default(""),
  deadline: z.string().optional().default(""),
  // チェックボックス（複数選択）。FormData からは getAll で受ける
  billingModels: z.array(z.string()).min(1, "収益モデルを1つ以上選択"),
});

export async function createCampaignAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const admin = await requireAdmin();
  const raw = {
    ...Object.fromEntries(formData),
    billingModels: formData.getAll("billingModels").map(String),
  };
  const parsed = campaignSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "入力エラー" };
  }

  // 商品からブランドを引いて整合性を取る
  const product = await prisma.product.findUnique({
    where: { id: parsed.data.productId },
  });
  if (!product) return { error: "商品が見つかりません" };

  const campaign = await prisma.campaign.create({
    data: {
      brandId: product.brandId,
      productId: product.id,
      title: parsed.data.title,
      brief: parsed.data.brief,
      targetInfluencers: parsed.data.targetInfluencers,
      rewardType: parsed.data.rewardType,
      rewardYen: parsed.data.rewardYen,
      billingModels: parsed.data.billingModels.join(","),
      campaignFeeYen: parsed.data.campaignFeeYen,
      salesCommissionPct: parsed.data.salesCommissionPct,
      media: parsed.data.media,
      tags: parsed.data.tags,
      deadline: parsed.data.deadline,
      status: "OPEN", // 作成と同時に募集開始
    },
  });
  await recordAudit({
    actorId: admin.userId,
    action: "campaign.create",
    target: campaign.id,
    meta: { title: campaign.title },
  });
  revalidatePath("/admin/campaigns");
  return { ok: true };
}

const statusSchema = z.object({
  campaignId: z.string().min(1),
  status: z.enum(["DRAFT", "OPEN", "CLOSED", "COMPLETED"]),
});

export async function updateCampaignStatusAction(
  formData: FormData
): Promise<void> {
  const admin = await requireAdmin();
  const parsed = statusSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  await prisma.campaign.update({
    where: { id: parsed.data.campaignId },
    data: { status: parsed.data.status },
  });
  await recordAudit({
    actorId: admin.userId,
    action: "campaign.status",
    target: parsed.data.campaignId,
    meta: { status: parsed.data.status },
  });
  revalidatePath(`/admin/campaigns/${parsed.data.campaignId}`);
  revalidatePath("/admin/campaigns");
}

const decisionSchema = z.object({
  applicationId: z.string().min(1),
  decision: z.enum(["APPROVED", "REJECTED"]),
});

/** 応募の承認/却下。承認すると「参加確定」となり取り上げ予定人数に数える。 */
export async function decideApplicationAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  const parsed = decisionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const app = await prisma.application.update({
    where: { id: parsed.data.applicationId },
    data: { status: parsed.data.decision },
    select: { campaignId: true, influencerId: true, campaign: { select: { title: true } } },
  });
  if (parsed.data.decision === "APPROVED") {
    await prisma.notification.create({
      data: { influencerId: app.influencerId, text: `「${app.campaign.title}」に採用されました。投稿を提出しましょう。`, href: "/app/manage" },
    });
  }
  await recordAudit({
    actorId: admin.userId,
    action: "application.decide",
    target: parsed.data.applicationId,
    meta: { decision: parsed.data.decision },
  });
  revalidatePath(`/admin/campaigns/${app.campaignId}`);
}

/** 投稿の確認OK → 完了。金銭報酬なら取引(振込)を生成する。 */
export async function confirmApplicationAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  const id = String(formData.get("applicationId") ?? "");
  if (!id) return;
  const app = await prisma.application.findUnique({
    where: { id },
    include: { campaign: { select: { id: true, rewardType: true, rewardYen: true } } },
  });
  if (!app || app.status !== "SUBMITTED") return;

  await prisma.application.update({ where: { id }, data: { status: "COMPLETED" } });

  const c = app.campaign;
  const paid = (c.rewardType === "PAID" || c.rewardType === "BOTH") && c.rewardYen > 0;
  if (paid) {
    const exists = await prisma.transaction.findFirst({ where: { influencerId: app.influencerId, campaignId: c.id } });
    if (!exists) {
      await prisma.transaction.create({ data: { influencerId: app.influencerId, campaignId: c.id, amountYen: c.rewardYen, status: "振込済み" } });
    }
    await recordAudit({ actorId: admin.userId, action: "payout.complete", target: id, meta: { amountYen: c.rewardYen } });
  } else {
    await recordAudit({ actorId: admin.userId, action: "application.complete", target: id });
  }
  await prisma.notification.create({
    data: {
      influencerId: app.influencerId,
      text: paid ? `案件が完了しました。報酬 ¥${c.rewardYen.toLocaleString("ja-JP")} を振り込みました。` : "案件が完了しました。お疲れさまでした！",
      href: paid ? "/app/me/transactions" : "/app/manage",
    },
  });
  revalidatePath(`/admin/campaigns/${c.id}`);
}

/** 差し戻し（SUBMITTED → APPROVED）。 */
export async function sendbackApplicationAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  const id = String(formData.get("applicationId") ?? "");
  if (!id) return;
  const app = await prisma.application.update({ where: { id }, data: { status: "APPROVED" }, select: { campaignId: true } });
  await recordAudit({ actorId: admin.userId, action: "application.sendback", target: id });
  revalidatePath(`/admin/campaigns/${app.campaignId}`);
}
