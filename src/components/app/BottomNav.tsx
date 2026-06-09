"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, SunMark } from "@/components/Icon";

const TABS = [
  { href: "/app", icon: "search", label: "さがす" },
  { href: "/app/manage", icon: "bag", label: "案件管理" },
  { href: "/app/inbox", icon: "chat", label: "メッセージ" },
  { href: "/app/me", icon: "user", label: "マイ" },
];

// モバイル＝下部タブバー / タブレット(md+)＝左サイドレール
export function BottomNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/app"
      ? pathname === "/app" || pathname.startsWith("/app/campaign") || pathname.startsWith("/app/notifications")
      : pathname.startsWith(href);

  return (
    <nav
      className="flex shrink-0 border-t border-line bg-surface/85 backdrop-blur-xl md:w-[84px] md:flex-col md:border-r md:border-t-0 lg:w-60"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {/* ロゴ（タブレット以上） */}
      <Link href="/app" className="hidden items-center gap-2 px-4 py-5 md:flex md:justify-center lg:justify-start">
        <SunMark className="h-9 w-9" />
        <span className="display hidden text-lg font-bold text-ink lg:inline">Sunnyway</span>
      </Link>

      <div className="flex flex-1 md:flex-none md:flex-col md:gap-1 md:px-3">
        {TABS.map((t) => {
          const on = isActive(t.href);
          return (
            <Link
              key={t.href}
              href={t.href}
              className={`tap relative flex flex-1 flex-col items-center gap-1 py-2.5 md:flex-none lg:flex-row lg:justify-start lg:gap-3 lg:rounded-xl lg:px-3 lg:py-3 ${on ? "text-sunny-600 lg:bg-sunny-50" : "text-muted lg:hover:bg-canvas"}`}
            >
              {on && <span className="absolute top-0 h-[3px] w-8 rounded-full bg-sunrise lg:hidden" />}
              <span className={`grid h-9 w-9 place-items-center rounded-full transition-all lg:h-auto lg:w-auto lg:rounded-none ${on ? "bg-sunny-50 lg:bg-transparent" : "scale-95 lg:scale-100"}`}>
                <Icon name={t.icon} className="h-[22px] w-[22px]" fill={on} />
              </span>
              <span className="text-[10px] font-medium tracking-wide lg:text-sm">{t.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
