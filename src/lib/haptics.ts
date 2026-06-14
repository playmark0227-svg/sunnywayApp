// 触覚フィードバック（対応端末のみ）。
// Web の Vibration API を使い、操作の手応えを軽く返す。
// 非対応端末・「視差効果を減らす」設定では自動的に無効化する。

export type Haptic = "tap" | "soft" | "select" | "success" | "warning" | "error";

const PATTERN: Record<Haptic, number | number[]> = {
  tap: 8,            // 通常のタップ
  soft: 4,           // ごく軽い反応
  select: 12,        // 選択・切り替え
  success: [14, 40, 22],
  warning: [10, 30, 10],
  error: [22, 50, 22],
};

let allowed: boolean | null = null;

function canVibrate(): boolean {
  if (allowed !== null) return allowed;
  if (typeof window === "undefined" || typeof navigator === "undefined" || typeof navigator.vibrate !== "function") {
    allowed = false;
    return allowed;
  }
  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  allowed = !reduce;
  return allowed;
}

/** 触覚を一発返す。非対応なら何もしない（呼び出し側でガード不要）。 */
export function haptic(kind: Haptic = "tap"): void {
  try {
    if (!canVibrate()) return;
    navigator.vibrate(PATTERN[kind]);
  } catch {
    /* no-op */
  }
}
