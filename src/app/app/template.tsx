"use client";

import { usePathname } from "next/navigation";

// ルート遷移ごとに前面へ乗るアニメーション（key でリマウント）
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="screen-in">
      {children}
    </div>
  );
}
