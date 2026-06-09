import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireInfluencer } from "@/lib/auth";
import { Icon, ArtTile, ART_BY_CATEGORY, Pill } from "@/components/Icon";
import { applicationStatusLabel, appStatusStyle } from "@/lib/labels";

export default async function HistoryPage() {
  const me = await requireInfluencer();
  const profile = await prisma.influencerProfile.findUnique({ where: { userId: me.userId }, select: { id: true } });
  const apps = await prisma.application.findMany({
    where: { influencerId: profile!.id },
    include: { campaign: { include: { brand: { select: { name: true } }, product: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="fade">
      <header className="sticky top-0 z-20 flex items-center gap-2 bg-canvas/80 px-3 pb-3 backdrop-blur-xl" style={{ paddingTop: "max(0.9rem,env(safe-area-inset-top))" }}>
        <Link href="/app/manage" className="grid h-10 w-10 place-items-center rounded-full text-ink/65 hover:bg-ink/5"><Icon name="back" className="h-5 w-5" /></Link>
        <h1 className="display text-lg font-semibold text-ink">応募履歴</h1>
      </header>
      <div className="space-y-2 p-5">
        {apps.length === 0 ? <p className="py-20 text-center text-sm text-muted">応募履歴はありません</p> : apps.map((a) => {
          const c = a.campaign;
          return (
            <Link key={a.id} href={`/app/campaign/${c.id}`} className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3">
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl"><ArtTile art={ART_BY_CATEGORY(c.product.category)} className="h-12" svgClass="h-8 w-8" /></div>
              <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-ink">{c.title}</p><p className="truncate text-xs text-muted">{c.brand.name}</p></div>
              <Pill label={applicationStatusLabel[a.status]} className={appStatusStyle[a.status]} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
