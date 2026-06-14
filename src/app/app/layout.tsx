import { requireInfluencer } from "@/lib/auth";
import { BottomNav } from "@/components/app/BottomNav";
import { HeaderElevation } from "@/components/fx/HeaderElevation";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  await requireInfluencer();
  // モバイル: 縦積み(本文→下部タブ) / タブレット(md+): 左サイドレール＋本文
  return (
    <div className="flex h-[100dvh] flex-col md:flex-row-reverse">
      <main data-scroll-root className="flex-1 overflow-y-auto">
        <div className="mx-auto min-h-full max-w-md md:max-w-3xl lg:max-w-5xl">{children}</div>
      </main>
      <BottomNav />
      <HeaderElevation />
    </div>
  );
}
