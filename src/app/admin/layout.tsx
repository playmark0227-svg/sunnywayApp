import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth";

const NAV = [
  { href: "/admin", label: "ダッシュボード" },
  { href: "/admin/brands", label: "ブランド" },
  { href: "/admin/products", label: "商品" },
  { href: "/admin/campaigns", label: "掲載（キャンペーン）" },
  { href: "/admin/influencers", label: "インフルエンサー" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen lg:flex">
      {/* サイドバー */}
      <aside className="border-b border-gray-200 bg-white lg:w-60 lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-5 py-4 lg:block">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="text-xl">☀️</span>
            <span className="font-bold text-gray-900">Sunnyway 管理</span>
          </Link>
          <span className="badge bg-sunny-100 text-sunny-700 lg:mt-2">
            運営者: {admin.name}
          </span>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:px-3">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-sunny-50 hover:text-sunny-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden border-t border-gray-200 p-3 lg:block">
          <form action={logoutAction}>
            <button className="btn-ghost w-full text-sm">ログアウト</button>
          </form>
        </div>
      </aside>

      {/* メイン */}
      <main className="flex-1 px-5 py-6 lg:px-10 lg:py-8">{children}</main>
    </div>
  );
}
