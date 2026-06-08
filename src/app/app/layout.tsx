import { requireInfluencer } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth";
import { BottomNav } from "@/components/InfluencerNav";

// スマホ専用アプリ。大きい画面でも常にモバイル幅(max-w-md)のセンター表示にする。
export default async function InfluencerAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const me = await requireInfluencer();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto flex min-h-screen max-w-md flex-col bg-gray-50 shadow-xl">
        {/* トップバー */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
          <div className="flex items-center gap-1.5">
            <span className="text-lg">☀️</span>
            <span className="font-bold text-gray-900">Sunnyway</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">@{me.name}</span>
            <form action={logoutAction}>
              <button className="text-xs text-gray-400 hover:text-gray-600">
                ログアウト
              </button>
            </form>
          </div>
        </header>

        {/* 本文 */}
        <main className="flex-1 px-4 py-5">{children}</main>

        <BottomNav />
      </div>
    </div>
  );
}
