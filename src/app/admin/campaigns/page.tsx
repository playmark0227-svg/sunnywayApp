import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { PageHeader, EmptyState, StatusBadge } from "@/components/ui";
import { CampaignForm } from "@/components/AdminForms";
import { campaignStatusLabel, rewardTypeLabel } from "@/lib/labels";

export default async function CampaignsPage() {
  await requireAdmin();
  const [campaigns, products] = await Promise.all([
    prisma.campaign.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        brand: { select: { name: true } },
        product: { select: { name: true } },
        _count: {
          select: {
            applications: true,
          },
        },
      },
    }),
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: { brand: { select: { name: true } } },
    }),
  ]);

  // 取り上げ(POSTED)数は別集計
  const postedCounts = await prisma.application.groupBy({
    by: ["campaignId"],
    where: { status: "POSTED" },
    _count: { _all: true },
  });
  const postedMap = new Map(
    postedCounts.map((p) => [p.campaignId, p._count._all])
  );

  const productOptions = products.map((p) => ({
    id: p.id,
    name: p.name,
    brandName: p.brand.name,
  }));

  return (
    <div>
      <PageHeader
        title="掲載（キャンペーン）"
        description="「ここに掲載すれば◯人が取り上げます」の単位。運営がブランドの代理で作成します。"
        action={<CampaignForm products={productOptions} />}
      />

      {campaigns.length === 0 ? (
        <EmptyState>
          まだ掲載がありません。「＋ 掲載を作成」から始めてください。
        </EmptyState>
      ) : (
        <div className="space-y-3">
          {campaigns.map((c) => {
            const posted = postedMap.get(c.id) ?? 0;
            const pct = Math.min(
              100,
              Math.round((posted / Math.max(1, c.targetInfluencers)) * 100)
            );
            return (
              <Link
                key={c.id}
                href={`/admin/campaigns/${c.id}`}
                className="card flex flex-col gap-3 p-5 transition hover:border-sunny-300 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-semibold text-gray-900">
                      {c.title}
                    </h3>
                    <StatusBadge
                      status={c.status}
                      label={campaignStatusLabel[c.status]}
                    />
                  </div>
                  <p className="mt-0.5 truncate text-sm text-gray-500">
                    {c.brand.name} / {c.product.name} ・{" "}
                    {rewardTypeLabel[c.rewardType]}
                  </p>
                </div>

                <div className="sm:w-64">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">取り上げ</span>
                    <span className="font-semibold text-gray-900">
                      {posted}/{c.targetInfluencers}人
                    </span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-sunny-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="mt-1 text-right text-xs text-gray-400">
                    応募 {c._count.applications}件
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
