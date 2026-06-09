import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { PageHeader, EmptyState, CampaignBadge } from "@/components/ui";
import { ArtTile, ART_BY_CATEGORY, Icon } from "@/components/Icon";
import { CampaignForm } from "@/components/AdminForms";
import { rewardTypeLabel } from "@/lib/labels";

export default async function CampaignsPage() {
  await requireAdmin();
  const [campaigns, products] = await Promise.all([
    prisma.campaign.findMany({ orderBy: { createdAt: "desc" }, include: { brand: { select: { name: true } }, product: true, _count: { select: { applications: true } } } }),
    prisma.product.findMany({ orderBy: { createdAt: "desc" }, include: { brand: { select: { name: true } } } }),
  ]);
  const postedCounts = await prisma.application.groupBy({ by: ["campaignId"], where: { status: { in: ["SUBMITTED", "COMPLETED"] } }, _count: { _all: true } });
  const postedMap = new Map(postedCounts.map((p) => [p.campaignId, p._count._all]));
  const productOptions = products.map((p) => ({ id: p.id, name: p.name, brandName: p.brand.name }));

  return (
    <div>
      <PageHeader title="掲載（キャンペーン）" description="運営がブランドの代理で作成。" action={<CampaignForm products={productOptions} />} />
      {campaigns.length === 0 ? (
        <EmptyState>まだ掲載がありません。右上から作成してください。</EmptyState>
      ) : (
        <div className="space-y-3">
          {campaigns.map((c) => {
            const posted = postedMap.get(c.id) ?? 0;
            const pct = Math.min(100, Math.round((posted / Math.max(1, c.targetInfluencers)) * 100));
            return (
              <Link key={c.id} href={`/admin/campaigns/${c.id}`} className="card flex items-center gap-4 p-4 transition hover:shadow-card">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl"><ArtTile art={ART_BY_CATEGORY(c.product.category)} className="h-16" svgClass="h-10 w-10" /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2"><h3 className="truncate font-semibold text-ink">{c.title}</h3><CampaignBadge status={c.status} /></div>
                  <p className="mt-0.5 truncate text-sm text-muted">{c.brand.name} ・ {rewardTypeLabel[c.rewardType]}</p>
                  <div className="mt-2 flex items-center gap-3"><div className="h-1.5 w-32 overflow-hidden rounded-full bg-ink/5"><div className="h-full rounded-full bg-sunrise" style={{ width: `${pct}%` }} /></div><span className="text-xs font-medium text-ink/70">{posted}/{c.targetInfluencers}人 取り上げ</span></div>
                </div>
                <Icon name="chevron" className="h-5 w-5 text-ink/20" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
