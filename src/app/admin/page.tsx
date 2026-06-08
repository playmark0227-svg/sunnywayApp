import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { PageHeader, Stat, StatusBadge } from "@/components/ui";
import { campaignStatusLabel, rewardTypeLabel } from "@/lib/labels";

export default async function AdminDashboard() {
  await requireAdmin(); // ページ単位でも権限を再検証（レイアウト依存にしない）
  const [
    brandCount,
    productCount,
    influencerCount,
    openCampaigns,
    postedCount,
    reachAgg,
    recentCampaigns,
    recentLogs,
  ] = await Promise.all([
    prisma.brand.count(),
    prisma.product.count(),
    prisma.influencerProfile.count(),
    prisma.campaign.count({ where: { status: "OPEN" } }),
    prisma.application.count({ where: { status: "POSTED" } }),
    prisma.application.aggregate({
      _sum: { postReach: true },
      where: { status: "POSTED" },
    }),
    prisma.campaign.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        brand: true,
        product: true,
        _count: {
          select: { applications: { where: { status: "POSTED" } } },
        },
      },
    }),
    prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { actor: { select: { name: true } } },
    }),
  ]);

  const totalReach = reachAgg._sum.postReach ?? 0;

  return (
    <div>
      <PageHeader
        title="ダッシュボード"
        description="Sunnyway プラットフォーム全体のサマリー"
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <Stat label="登録ブランド" value={brandCount} />
        <Stat label="登録商品" value={productCount} />
        <Stat label="インフルエンサー" value={influencerCount} />
        <Stat label="募集中の掲載" value={openCampaigns} />
        <Stat
          label="取り上げ件数（投稿）"
          value={postedCount}
          sub="POSTED の応募数"
        />
        <Stat
          label="合計リーチ"
          value={totalReach.toLocaleString("ja-JP")}
          sub="投稿リーチの総和"
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* 最近の掲載 */}
        <section className="card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">最近の掲載</h2>
            <Link
              href="/admin/campaigns"
              className="text-sm font-medium text-sunny-600 hover:text-sunny-700"
            >
              すべて見る →
            </Link>
          </div>
          {recentCampaigns.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-400">
              まだ掲載がありません
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {recentCampaigns.map((c) => (
                <li key={c.id} className="py-3">
                  <Link
                    href={`/admin/campaigns/${c.id}`}
                    className="flex items-center justify-between gap-3 hover:opacity-80"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-gray-900">
                        {c.title}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {c.brand.name} ・ {rewardTypeLabel[c.rewardType]}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-sm font-semibold text-sunny-600">
                        {c._count.applications}/{c.targetInfluencers}人
                      </span>
                      <StatusBadge
                        status={c.status}
                        label={campaignStatusLabel[c.status]}
                      />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* 監査ログ */}
        <section className="card p-5">
          <h2 className="mb-3 font-semibold text-gray-900">
            操作ログ（監査）
          </h2>
          {recentLogs.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-400">
              記録はまだありません
            </p>
          ) : (
            <ul className="space-y-2 text-sm">
              {recentLogs.map((log) => (
                <li
                  key={log.id}
                  className="flex items-center justify-between gap-2"
                >
                  <span className="truncate text-gray-700">
                    <span className="font-mono text-xs text-sunny-700">
                      {log.action}
                    </span>{" "}
                    by {log.actor.name}
                  </span>
                  <span className="shrink-0 text-xs text-gray-400">
                    {log.createdAt.toLocaleString("ja-JP", {
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
