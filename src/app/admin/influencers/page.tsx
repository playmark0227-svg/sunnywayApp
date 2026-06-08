import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { PageHeader, EmptyState } from "@/components/ui";
import { platformLabel } from "@/lib/labels";

export default async function InfluencersPage() {
  await requireAdmin();
  const influencers = await prisma.influencerProfile.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      _count: { select: { applications: true } },
    },
  });

  // 取り上げ(POSTED)実績数
  const posted = await prisma.application.groupBy({
    by: ["influencerId"],
    where: { status: "POSTED" },
    _count: { _all: true },
    _sum: { postReach: true },
  });
  const postedMap = new Map(
    posted.map((p) => [p.influencerId, { count: p._count._all, reach: p._sum.postReach ?? 0 }])
  );

  return (
    <div>
      <PageHeader
        title="インフルエンサー"
        description="アプリから登録したインフルエンサーの一覧と実績"
      />

      {influencers.length === 0 ? (
        <EmptyState>まだ登録されたインフルエンサーがいません。</EmptyState>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">ハンドル</th>
                <th className="px-4 py-3">媒体</th>
                <th className="px-4 py-3 text-right">フォロワー</th>
                <th className="px-4 py-3 text-center">応募</th>
                <th className="px-4 py-3 text-center">取り上げ</th>
                <th className="px-4 py-3 text-right">累計リーチ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {influencers.map((inf) => {
                const stat = postedMap.get(inf.id);
                return (
                  <tr key={inf.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 font-medium text-gray-900">
                        @{inf.handle}
                        {inf.verified && (
                          <span className="badge bg-sunny-100 text-sunny-700">
                            認証済
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400">
                        {inf.user.name} ・ {inf.user.email}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {platformLabel[inf.platform] ?? inf.platform}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      {inf.followers.toLocaleString("ja-JP")}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600">
                      {inf._count.applications}
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-sunny-600">
                      {stat?.count ?? 0}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      {(stat?.reach ?? 0).toLocaleString("ja-JP")}
                    </td>
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
