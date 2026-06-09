import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { PageHeader, Stat, CampaignBadge } from "@/components/ui";
import { ArtTile, ART_BY_CATEGORY } from "@/components/Icon";
import { rewardTypeLabel, num, yen } from "@/lib/labels";

export default async function AdminDashboard() {
  await requireAdmin();
  const [brandCount, infCount, openCount, posted, reachAgg, paidAgg, recent, logs] = await Promise.all([
    prisma.brand.count(),
    prisma.influencerProfile.count(),
    prisma.campaign.count({ where: { status: "OPEN" } }),
    prisma.application.count({ where: { status: { in: ["SUBMITTED", "COMPLETED"] } } }),
    prisma.application.aggregate({ _sum: { postReach: true }, where: { status: { in: ["SUBMITTED", "COMPLETED"] } } }),
    prisma.transaction.aggregate({ _sum: { amountYen: true }, where: { status: "振込済み" } }),
    prisma.campaign.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { brand: { select: { name: true } }, product: true, _count: { select: { applications: { where: { status: { in: ["SUBMITTED", "COMPLETED"] } } } } } } }),
    prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 6, include: { actor: { select: { name: true } } } }),
  ]);

  return (
    <div>
      <PageHeader title="ダッシュボード" description="プラットフォーム全体のサマリー" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <Stat label="ブランド" value={brandCount} />
        <Stat label="インフルエンサー" value={infCount} />
        <Stat label="募集中の掲載" value={openCount} />
        <Stat label="取り上げ件数" value={posted} />
        <Stat label="合計リーチ" value={num(reachAgg._sum.postReach ?? 0)} />
        <Stat label="報酬支払額" value={yen(paidAgg._sum.amountYen ?? 0)} sub="振込済みの総額" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="card p-6">
          <div className="mb-4 flex items-center justify-between"><h2 className="display font-semibold text-ink">最近の掲載</h2><Link href="/admin/campaigns" className="text-sm font-medium text-sunny-600">すべて</Link></div>
          <div className="space-y-1">
            {recent.map((c) => (
              <Link key={c.id} href={`/admin/campaigns/${c.id}`} className="flex items-center gap-3 rounded-2xl p-2 hover:bg-canvas">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl"><ArtTile art={ART_BY_CATEGORY(c.product.category)} className="h-12" svgClass="h-8 w-8" /></div>
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-ink">{c.title}</p><p className="truncate text-xs text-muted">{c.brand.name} ・ {rewardTypeLabel[c.rewardType]}</p></div>
                <span className="text-sm font-semibold text-sunny-600">{c._count.applications}/{c.targetInfluencers}</span>
              </Link>
            ))}
          </div>
        </section>
        <section className="card p-6">
          <h2 className="display mb-4 font-semibold text-ink">操作ログ（監査）</h2>
          <ul className="space-y-3 text-sm">
            {logs.map((l) => (
              <li key={l.id} className="flex items-center justify-between gap-2"><span className="truncate text-ink/70"><span className="rounded bg-sunny-50 px-1.5 py-0.5 font-mono text-xs text-sunny-700">{l.action}</span> {l.actor.name}</span><span className="shrink-0 text-xs text-muted">{l.createdAt.toLocaleString("ja-JP", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}</span></li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
