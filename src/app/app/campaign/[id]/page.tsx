import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireInfluencer } from "@/lib/auth";
import { Icon, Thumb, ART_BY_CATEGORY, Pill } from "@/components/Icon";
import { ApplyForm } from "@/components/app/forms";
import { rewardTypeLabel, applicationStatusLabel, appStatusStyle, num, parseTags, yen } from "@/lib/labels";

export default async function CampaignDetail({ params }: { params: Promise<{ id: string }> }) {
  const me = await requireInfluencer();
  const { id } = await params;
  const profile = await prisma.influencerProfile.findUnique({ where: { userId: me.userId }, select: { id: true } });
  const c = await prisma.campaign.findUnique({ where: { id }, include: { brand: true, product: true, _count: { select: { applications: true } } } });
  if (!c) notFound();
  const mine = await prisma.application.findUnique({ where: { campaignId_influencerId: { campaignId: id, influencerId: profile!.id } } });
  const art = ART_BY_CATEGORY(c.product.category);
  const applied = c.appliedBase + c._count.applications;
  const tags = parseTags(c.tags);

  return (
    <div className="fade pb-28">
      <header className="sticky top-0 z-20 flex items-center gap-2 bg-canvas/80 px-3 pb-3 backdrop-blur-xl" style={{ paddingTop: "max(0.9rem,env(safe-area-inset-top))" }}>
        <Link href="/app" className="grid h-10 w-10 place-items-center rounded-full text-ink/65 hover:bg-ink/5"><Icon name="back" className="h-5 w-5" /></Link>
        <h1 className="display text-lg font-semibold text-ink">案件の詳細</h1>
      </header>

      <div className="px-5">
        <div className="overflow-hidden rounded-3xl border border-line"><Thumb imageUrl={c.product.imageUrl} art={art} className="h-60" svgClass="h-32 w-32" /></div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Pill label={rewardTypeLabel[c.rewardType]} className="bg-sunny-50 text-sunny-700" />
          {tags.map((t) => <Pill key={t} label={t} className="bg-ink/5 text-ink/60" />)}
          <span className="badge bg-ink/5 text-ink/60">{c.media}</span>
        </div>
        <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted">{c.brand.name}</p>
        <h2 className="display mt-1 text-2xl font-semibold leading-snug text-ink">{c.title}</h2>
        <p className="mt-1 text-sm text-muted">{c.product.name}</p>

        <div className="mt-5 grid grid-cols-3 gap-3">
          {[["報酬", (c.rewardType === "PAID" || c.rewardType === "BOTH") && c.rewardYen > 0 ? yen(c.rewardYen) : c.rewardType === "GIFTING" || c.rewardType === "BOTH" ? "現物提供" : "特別"], ["募集", `${c.targetInfluencers}名`], ["締切", c.deadline || "—"]].map(([l, v]) => (
            <div key={l} className="rounded-2xl border border-line bg-surface p-3 text-center"><div className="display text-base font-semibold text-ink">{v}</div><div className="mt-0.5 text-[11px] text-muted">{l}</div></div>
          ))}
        </div>

        <div className="mt-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">依頼内容</h3>
          <p className="mt-2 whitespace-pre-wrap text-[15px] leading-relaxed text-ink/85">{c.brief || "—"}</p>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-canvas px-4 py-3 text-sm text-muted">
          <Icon name="user" className="h-4 w-4" /> これまで <b className="text-ink">{applied}</b> 名が応募
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md border-t border-line bg-surface/90 p-4 backdrop-blur-xl" style={{ paddingBottom: "max(1rem,env(safe-area-inset-bottom))" }}>
        {mine ? (
          <div className="flex items-center justify-between"><span className="text-sm text-muted">応募状況</span><Pill label={applicationStatusLabel[mine.status]} className={appStatusStyle[mine.status]} /></div>
        ) : (
          <ApplyForm campaignId={c.id} />
        )}
      </div>
    </div>
  );
}
