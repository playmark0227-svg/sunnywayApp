"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/Icon";
import { haptic } from "@/lib/haptics";

// 軽量トースト。モジュールストア方式なので、どのクライアント部品からでも
//   import { toast } from "@/components/fx/Toast";  toast.success("保存しました");
// で呼べる。表示は <Toaster/> を一度だけ常駐させる。

export type ToastKind = "success" | "info" | "error";
export type ToastItem = { id: number; kind: ToastKind; message: string };

let items: ToastItem[] = [];
let seq = 0;
const listeners = new Set<(items: ToastItem[]) => void>();

function emit() {
  for (const l of listeners) l(items);
}
function remove(id: number) {
  items = items.filter((t) => t.id !== id);
  emit();
}
function push(kind: ToastKind, message: string, ms = 3200) {
  const id = ++seq;
  items = [...items, { id, kind, message }];
  emit();
  if (typeof window !== "undefined") {
    haptic(kind === "error" ? "warning" : "success");
    window.setTimeout(() => remove(id), ms);
  }
}

export const toast = {
  success: (m: string, ms?: number) => push("success", m, ms),
  info: (m: string, ms?: number) => push("info", m, ms),
  error: (m: string, ms?: number) => push("error", m, ms),
  dismiss: remove,
};

const STYLE: Record<ToastKind, { ring: string; icon: string; tint: string }> = {
  success: { ring: "text-emerald-600", icon: "check", tint: "bg-emerald-50" },
  info: { ring: "text-sunny-600", icon: "spark", tint: "bg-sunny-50" },
  error: { ring: "text-rose-600", icon: "bell", tint: "bg-rose-50" },
};

export function Toaster() {
  const [list, setList] = useState<ToastItem[]>([]);
  useEffect(() => {
    listeners.add(setList);
    setList(items);
    return () => { listeners.delete(setList); };
  }, []);

  if (list.length === 0) return null;
  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[9998] flex flex-col items-center gap-2 px-4"
      style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
      aria-live="polite"
      role="status"
    >
      {list.map((t) => {
        const s = STYLE[t.kind];
        return (
          <div
            key={t.id}
            onClick={() => remove(t.id)}
            className="toast-in glass pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl px-4 py-3 shadow-card"
          >
            <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${s.tint} ${s.ring}`}>
              <Icon name={s.icon} className="h-[18px] w-[18px]" fill />
            </span>
            <p className="min-w-0 flex-1 text-sm font-medium text-ink">{t.message}</p>
          </div>
        );
      })}
    </div>
  );
}
