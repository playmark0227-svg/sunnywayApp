"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/Icon";

const NAV = [
  { href: "/admin", icon: "grid", label: "ダッシュボード" },
  { href: "/admin/campaigns", icon: "bag", label: "掲載" },
  { href: "/admin/products", icon: "tag", label: "商品" },
  { href: "/admin/brands", icon: "store", label: "ブランド" },
  { href: "/admin/influencers", icon: "user", label: "インフルエンサー" },
  { href: "/admin/mails", icon: "mail", label: "メール" },
];

export function AdminNav() {
  const pathname = usePathname();
  const on = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));
  return (
    <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col">
      {NAV.map((n) => {
        const active = on(n.href);
        return (
          <Link key={n.href} href={n.href} data-haptic="select" className={`press ripple-host flex items-center gap-2.5 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-medium transition ${active ? "bg-sunrise text-white shadow-lift" : "text-ink/60 hover:bg-canvas"}`}>
            <span key={`${n.href}-${active}`} className={active ? "icon-bounce" : ""}><Icon name={n.icon} className="h-5 w-5" fill={active} /></span> {n.label}
          </Link>
        );
      })}
    </nav>
  );
}
