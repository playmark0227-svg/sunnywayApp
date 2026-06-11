import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { Icon, Thumb, ART_BY_CATEGORY } from "@/components/Icon";
import { AppBadge, CampaignBadge } from "@/components/ui";
import { CountUp } from "@/components/CountUp";
import { decideApplicationAction, confirmApplicationAction, sendbackApplicationAction, updateCampaignStatusAction } from "@/lib/actions/admin";
import { CampaignEditButton } from "@/components/AdminForms";
import { rewardTypeLabel, billingModelLabel, campaignStatusLabel, parseBillingModels, num, yen } from "@/lib/labels";

const POSTED = ["SUBMITTED", "COMPLETED"];

export default async function CampaignReport({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const c = await prisma.campaign.findUnique({
    where: { id },
    include: { brand: true, product: true, applications: { orderBy: { createdAt: "desc" }, include: { influencer: { include: { user: { select: { name: true } } } } } } },
  });
  if (!c) notFound();
  const products = await prisma.product.findMany({ orderBy: { name: "asc" }, include: { brand: { select: { name: true } } } });
  const posted = c.applications.filter((a) => POSTED.includes(a.status));
  const approved = c.applications.filter((a) => a.status === "APPROVED");
  const applied = c.applications.filter((a) => a.status === "APPLIED");
  const reach = posted.reduce((s, a) => s + a.postReach, 0);

  const rows: [string, string][] = [["報酬", rewardTypeLabel[c.rewardType]]];
  if (c.rewardYen > 0) rows.push(["1人あたり", yen(c.rewardYen)]);
  rows.push(["収益モデル", parseBillingModels(c.billingModels).map((m) => billingModelLabel[m] ?? m).join(" / ")]);
  if (c.campaignFeeYen > 0) rows.push(["費用", yen(c.campaignFeeYen)]);
  if (c.salesCommissionPct > 0) rows.push(["手数料率", `${c.salesCommissionPct}%`]);

  return (
    <div>
      <Link href="/admin/campaigns" className="mb-2 flex items-center gap-1 text-sm text-muted hover:text-ink"><Icon name="back" className="h-4 w-4" /> 掲載一覧</Link>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3"><div><h1 className="display text-3xl font-semibold text-ink">{c.title}</h1><p className="mt-1 text-sm text-muted">{c.brand.name} / {c.product.name}</p></div><CampaignBadge status={c.status} /></div>

      <div className="card overflow-hidden">
        <div className="flex items-center gap-5 bg-sunrise-soft p-7">
          <div className="hidden h-20 w-20 shrink-0 overflow-hidden rounded-2xl sm:block"><Thumb imageUrl={c.product.imageUrl} art={ART_BY_CATEGORY(c.product.category)} className="h-20" svgClass="h-12 w-12" /></div>
          <div><p className="text-sm text-ink/60">この掲載の成果</p><p className="display mt-1 text-3xl font-semibold text-ink"><span className="grad-text bg-sunrise bg-clip-text text-transparent"><CountUp value={posted.length} />人</span>が取り上げました</p><p className="mt-1 text-sm text-muted">目標 {c.targetInfluencers}人 ・ 合計リーチ {num(reach)}</p></div>
        </div>
        <div className="grid grid-cols-2 divide-x divide-y divide-line sm:grid-cols-4 sm:divide-y-0">
          {([["応募", c.applications.length], ["採用", approved.length + posted.length], ["取り上げ", posted.length], ["リーチ", reach]] as [string, number][]).map(([l, v]) => (
            <div key={l} className="p-5 text-center"><div className="display text-2xl font-semibold text-ink"><CountUp value={v} /></div><div className="text-xs text-muted">{l}</div></div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="card p-6 lg:col-span-1">
          <h2 className="display mb-3 font-semibold text-ink">掲載・課金</h2>
          <dl className="text-sm">{rows.map(([k, v]) => <div key={k} className="flex justify-between gap-3 py-1"><dt className="text-muted">{k}</dt><dd className="text-right font-medium text-ink">{v}</dd></div>)}</dl>
          <h3 className="mb-1 mt-4 text-xs font-semibold uppercase tracking-wider text-muted">依頼内容</h3>
          <p className="text-sm leading-relaxed text-ink/80">{c.brief || "—"}</p>
          <h3 className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wider text-muted">ステータス</h3>
          <div className="flex flex-wrap gap-2">
            {(["OPEN", "CLOSED", "COMPLETED"] as const).map((s) => (
              <form key={s} action={updateCampaignStatusAction}><input type="hidden" name="campaignId" value={c.id} /><input type="hidden" name="status" value={s} /><button disabled={c.status === s} className="btn-ghost px-3 py-2 text-xs">{campaignStatusLabel[s]}</button></form>
            ))}
          </div>
          <div className="mt-4 border-t border-line pt-4">
            <CampaignEditButton
              campaign={{ id: c.id, productId: c.productId, title: c.title, brief: c.brief, media: c.media, tags: c.tags, deadline: c.deadline, targetInfluencers: c.targetInfluencers, rewardType: c.rewardType, rewardYen: c.rewardYen, billingModels: c.billingModels, campaignFeeYen: c.campaignFeeYen, salesCommissionPct: c.salesCommissionPct }}
              products={products.map((p) => ({ id: p.id, name: p.name, brandName: p.brand.name }))}
            />
          </div>
        </section>

        <section className="card p-6 lg:col-span-2">
          <h2 className="display mb-3 font-semibold text-ink">応募・取り上げ実績</h2>
          {applied.length > 0 && <p className="mb-3 rounded-2xl bg-sunny-50 px-4 py-3 text-sm text-sunny-800">未対応の応募が {applied.length} 件。採用で参加確定です。</p>}
          {c.applications.length === 0 ? <p className="py-8 text-center text-sm text-muted">まだ応募はありません</p> : (
            <ul className="divide-y divide-line">
              {c.applications.map((a) => (
                <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2"><span className="font-semibold text-ink">@{a.influencer.handle}</span><AppBadge status={a.status} /></div>
                    <p className="text-xs text-muted">{a.influencer.user.name} ・ {num(a.influencer.followers)} フォロワー</p>
                    {a.message && <p className="mt-1 text-sm text-ink/70">「{a.message}」</p>}
                    {POSTED.includes(a.status) && <p className="mt-1 text-sm"><a href={a.postUrl} target="_blank" rel="noreferrer" className="text-sunny-600 underline">投稿を見る</a> <span className="text-muted">・ リーチ {num(a.postReach)}</span></p>}
                  </div>
                  {a.status === "APPLIED" && (
                    <div className="flex shrink-0 gap-2">
                      <form action={decideApplicationAction}><input type="hidden" name="applicationId" value={a.id} /><input type="hidden" name="decision" value="APPROVED" /><button className="btn-primary px-4 py-2 text-xs">採用</button></form>
                      <form action={decideApplicationAction}><input type="hidden" name="applicationId" value={a.id} /><input type="hidden" name="decision" value="REJECTED" /><button className="btn-ghost px-4 py-2 text-xs">見送り</button></form>
                    </div>
                  )}
                  {a.status === "SUBMITTED" && (
                    <div className="flex shrink-0 gap-2">
                      <form action={confirmApplicationAction}><input type="hidden" name="applicationId" value={a.id} /><button className="btn-primary px-4 py-2 text-xs">確認OK・完了</button></form>
                      <form action={sendbackApplicationAction}><input type="hidden" name="applicationId" value={a.id} /><button className="btn-ghost px-4 py-2 text-xs">差し戻し</button></form>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
