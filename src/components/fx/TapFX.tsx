"use client";

import { useEffect } from "react";
import { haptic, type Haptic } from "@/lib/haptics";

// 一度だけ常駐するグローバルのタップ演出。
//   - class="ripple-host" の要素 … 押下点から波紋
//   - data-haptic="tap|select|success|…" の要素 … 触覚フィードバック
// サーバーコンポーネント側はクラス/属性を付けるだけでよい（クライアント化不要）。
export function TapFX() {
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const hapEl = target.closest<HTMLElement>("[data-haptic]");
      if (hapEl) haptic((hapEl.dataset.haptic || "tap") as Haptic);

      const host = target.closest<HTMLElement>(".ripple-host");
      if (host) {
        const rect = host.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 1.25;
        const dot = document.createElement("span");
        dot.className = "ripple-dot";
        dot.style.width = `${size}px`;
        dot.style.height = `${size}px`;
        dot.style.left = `${e.clientX - rect.left}px`;
        dot.style.top = `${e.clientY - rect.top}px`;
        host.appendChild(dot);
        window.setTimeout(() => dot.remove(), 650);
      }
    };
    document.addEventListener("pointerdown", onDown, { passive: true });
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);
  return null;
}
