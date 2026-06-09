// enum 等の日本語表示ラベルとバッジ配色（サーバー/クライアント両用の純粋関数）

export const rewardTypeLabel: Record<string, string> = {
  GIFTING: "ギフティング",
  PAID: "金銭報酬",
  BOTH: "現物＋報酬",
  OTHER: "特別報酬",
};

export const campaignStatusLabel: Record<string, string> = {
  DRAFT: "下書き",
  OPEN: "募集中",
  CLOSED: "締切",
  COMPLETED: "完了",
};

export const applicationStatusLabel: Record<string, string> = {
  APPLIED: "応募済み",
  APPROVED: "やること",
  SUBMITTED: "チェック中",
  COMPLETED: "完了",
  REJECTED: "見送り",
};

export const billingModelLabel: Record<string, string> = {
  MONTHLY: "月額・掲載料",
  PER_CAMPAIGN: "キャンペーン課金",
  PERFORMANCE: "成果連動",
  SALES_COMMISSION: "販売手数料",
};

export const platformLabel: Record<string, string> = {
  INSTAGRAM: "Instagram",
  TIKTOK: "TikTok",
  YOUTUBE: "YouTube",
  X: "X",
};

export const appStatusStyle: Record<string, string> = {
  APPLIED: "bg-ink/5 text-ink/60",
  APPROVED: "bg-emerald-50 text-emerald-700",
  SUBMITTED: "bg-amber-50 text-amber-700",
  COMPLETED: "bg-sunny-50 text-sunny-700",
  REJECTED: "bg-rose-50 text-rose-500",
};

export const campaignStatusStyle: Record<string, string> = {
  OPEN: "bg-emerald-50 text-emerald-700",
  DRAFT: "bg-ink/5 text-ink/60",
  CLOSED: "bg-rose-50 text-rose-500",
  COMPLETED: "bg-sunny-50 text-sunny-700",
};

export function parseBillingModels(value: string): string[] {
  return value.split(",").map((s) => s.trim()).filter(Boolean);
}
export function parseTags(value: string): string[] {
  return value.split(",").map((s) => s.trim()).filter(Boolean);
}

export function yen(n: number): string {
  return "¥" + (n ?? 0).toLocaleString("ja-JP");
}
export function num(n: number): string {
  return (n ?? 0).toLocaleString("ja-JP");
}

/** 投稿提出済み（取り上げ）と数える応募ステータス */
export function isPosted(status: string): boolean {
  return status === "SUBMITTED" || status === "COMPLETED";
}
