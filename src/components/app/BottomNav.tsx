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
    href === "/app" ? pathname === "/app" || pathname.startsWith("/app/campaign") : pathname.startsWith(href);
  return (
    <nav
      className="sticky bottom-0 z-20 flex border-t border-line bg-surface/85 backdrop-blur-xl"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {TABS.map((t) => {
        const on = isActive(t.href);
        return (
          <Link key={t.href} href={t.href} className={`flex flex-1 flex-col items-center gap-1 py-2.5 ${on ? "text-sunny-600" : "text-muted"}`}>
            <Icon name={t.icon} className="h-6 w-6" />
            <span className="text-[10px] font-medium tracking-wide">{t.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
