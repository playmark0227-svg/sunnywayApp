import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { PageHeader, EmptyState } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { platformLabel, num } from "@/lib/labels";

export default async function InfluencersPage() {
  await requireAdmin();
  const influencers = await prisma.influencerProfile.findMany({ orderBy: { createdAt: "desc" }, include: { user: { select: { name: true, email: true } }, _count: { select: { applications: true } } } });
  const posted = await prisma.application.groupBy({ by: ["influencerId"], where: { status: { in: ["SUBMITTED", "COMPLETED"] } }, _count: { _all: true }, _sum: { postReach: true } });
  const map = new Map(posted.map((p) => [p.influencerId, { count: p._count._all, reach: p._sum.postReach ?? 0 }]));

  return (
    <div>
      <PageHeader title="インフルエンサー" description="登録者の一覧と実績" />
      {influencers.length === 0 ? <EmptyState>まだ登録がありません。</EmptyState> : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead><tr className="text-left text-xs uppercase tracking-wider text-muted"><th className="px-5 py-3">ハンドル</th><th className="px-5 py-3">媒体</th><th className="px-5 py-3 text-right">フォロワー</th><th className="px-5 py-3 text-center">応募</th><th className="px-5 py-3 text-center">取り上げ</th><th className="px-5 py-3 text-right">累計リーチ</th></tr></thead>
            <tbody>
              {influencers.map((inf) => {
                const s = map.get(inf.id);
                return (
                  <tr key={inf.id} className="border-t border-line hover:bg-canvas">
                    <td className="px-5 py-4"><div className="flex items-center gap-2 font-semibold text-ink">@{inf.handle}{inf.verified && <Icon name="check" className="h-4 w-4 text-sunny-500" />}</div><div className="text-xs text-muted">{inf.user.name} ・ {inf.user.email}</div></td>
                    <td className="px-5 py-4 text-sm text-ink/70">{platformLabel[inf.platform] ?? inf.platform}</td>
                    <td className="px-5 py-4 text-right text-sm">{num(inf.followers)}</td>
                    <td className="px-5 py-4 text-center text-sm">{inf._count.applications}</td>
                    <td className="px-5 py-4 text-center text-sm font-semibold text-sunny-600">{s?.count ?? 0}</td>
                    <td className="px-5 py-4 text-right text-sm">{num(s?.reach ?? 0)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
