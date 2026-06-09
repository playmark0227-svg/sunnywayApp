import { requireInfluencer } from "@/lib/auth";
import { BottomNav } from "@/components/app/BottomNav";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  await requireInfluencer();
  return (
    <div className="flex h-[100dvh] flex-col">
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto min-h-full max-w-md">{children}</div>
      </main>
      <BottomNav />
    </div>
  );
}
