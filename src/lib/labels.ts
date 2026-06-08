// enum 等の日本語表示ラベル（サーバー/クライアント両方から使う純粋関数のみ）

export const rewardTypeLabel: Record<string, string> = {
  GIFTING: "ギフティング（現物提供）",
  PAID: "金銭報酬",
  BOTH: "現物＋金銭",
};

export const campaignStatusLabel: Record<string, string> = {
  DRAFT: "下書き",
  OPEN: "募集中",
  CLOSED: "募集締切",
  COMPLETED: "完了",
};

export const applicationStatusLabel: Record<string, string> = {
  APPLIED: "応募済み",
  APPROVED: "承認（参加確定）",
  REJECTED: "却下",
  POSTED: "投稿提出済み",
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
  X: "X (Twitter)",
};

/** "MONTHLY,PER_CAMPAIGN" のようなカンマ区切り文字列を配列へ */
export function parseBillingModels(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function yen(n: number): string {
  return "¥" + (n ?? 0).toLocaleString("ja-JP");
}

export function statusBadgeClass(status: string): string {
  switch (status) {
    case "OPEN":
    case "APPROVED":
      return "bg-green-100 text-green-800";
    case "DRAFT":
    case "APPLIED":
      return "bg-gray-100 text-gray-700";
    case "CLOSED":
    case "REJECTED":
      return "bg-red-100 text-red-700";
    case "COMPLETED":
    case "POSTED":
      return "bg-sunny-100 text-sunny-800";
    default:
      return "bg-gray-100 text-gray-700";
  }
}
