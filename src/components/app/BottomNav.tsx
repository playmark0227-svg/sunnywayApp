"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/Icon";

const TABS = [
  { href: "/app", icon: "search", label: "さがす" },
  { href: "/app/manage", icon: "bag", label: "案件管理" },
  { href: "/app/inbox", icon: "chat", label: "メッセージ" },
  { href: "/app/me", icon: "user", label: "マイ" },
];

export function BottomNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/app" ? pathname === "/app" || pathname.startsWith("/app/campaign") || pathname.startsWith("/app/notifications") : pathname.startsWith(href);
  return (
    <nav className="sticky bottom-0 z-20 flex border-t border-line bg-surface/85 backdrop-blur-xl" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      {TABS.map((t) => {
        const on = isActive(t.href);
        return (
          <Link key={t.href} href={t.href} className="tap relative flex flex-1 flex-col items-center gap-1 pb-2 pt-2.5">
            {on && <span className="absolute top-0 h-[3px] w-8 rounded-full bg-sunrise" />}
            <span className={`grid h-9 w-9 place-items-center rounded-full transition-all duration-300 ${on ? "scale-100 bg-sunny-50 text-sunny-600" : "scale-95 text-muted"}`}>
              <Icon name={t.icon} className={`h-[22px] w-[22px] transition-transform duration-300 ${on ? "scale-110" : ""}`} fill={on} />
            </span>
            <span className={`text-[10px] font-medium tracking-wide transition-colors ${on ? "text-sunny-600" : "text-muted"}`}>{t.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
