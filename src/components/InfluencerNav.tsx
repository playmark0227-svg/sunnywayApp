"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/app", label: "さがす", icon: "🔍" },
  { href: "/app/mine", label: "マイ", icon: "✨" },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="sticky bottom-0 z-10 grid grid-cols-2 border-t border-gray-200 bg-white/95 backdrop-blur">
      {TABS.map((t) => {
        const active = pathname === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium ${
              active ? "text-sunny-600" : "text-gray-400"
            }`}
          >
            <span className="text-lg">{t.icon}</span>
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
