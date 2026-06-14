import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireInfluencer } from "@/lib/auth";
import { Icon, Thumb, ART_BY_CATEGORY, Pill } from "@/components/Icon";
import { SubmitPostForm } from "@/components/app/forms";
import { rewardTypeLabel, applicationStatusLabel, appStatusStyle, num, yen } from "@/lib/labels";

const TABS: [string, string, string][] = [["todo", "やること", "APPROVED"], ["review", "チェック中", "SUBMITTED"], ["done", "完了", "COMPLETED"]];

export default async function ManagePage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const me = await requireInfluencer();
  const tab = (await searchParams).tab || "todo";
  const profile = await prisma.influencerProfile.findUnique({ where: { userId: me.userId }, select: { id: true } });
  const apps = await prisma.application.findMany({
    where: { influencerId: profile!.id },
    include: { campaign: { include: { brand: { select: { name: true } }, product: true } } },
    orderBy: { updatedAt: "desc" },
  });
  const txns = await prisma.transaction.findMany({ where: { influencerId: profile!.id } });
  const counts = { todo: apps.filter((a) => a.status === "APPROVED").length, review: apps.filter((a) => a.status === "SUBMITTED").length, done: apps.filter((a) => a.status === "COMPLETED").length };
  const status = TABS.find((t) => t[0] === tab)![2];
  const cur = apps.filter((a) => a.status === status);

  return (
    <div className="fade">
      <header data-elevate className="elevate sticky top-0 z-20 flex items-center justify-between bg-canvas/80 px-5 pb-3 backdrop-blur-xl" style={{ paddingTop: "max(0.9rem,env(safe-area-inset-top))" }}>
        <h1 className="display text-xl font-semibold text-ink">案件管理</h1>
        <Link href="/app/history" data-haptic="tap" className="ripple-host rounded-full px-3 py-2 text-sm font-medium text-sunny-600 hover:bg-sunny-50">応募履歴</Link>
      </header>

      <div className="px-5 pt-1"><div className="flex rounded-full bg-ink/5 p-1">
        {TABS.map(([k, label]) => (
          <Link key={k} href={`/app/manage?tab=${k}`} data-haptic="select" className={`press flex-1 rounded-full py-2 text-center text-sm font-semibold transition ${tab === k ? "bg-surface text-ink shadow-soft" : "text-ink/50"}`}>{label}{counts[k as keyof typeof counts] ? ` ${counts[k as keyof typeof counts]}` : ""}</Link>
        ))}
      </div></div>

      <div className="space-y-3 p-5 md:grid md:grid-cols-2 md:gap-3 md:space-y-0">
        {cur.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-center md:col-span-2">
            <div className="float grid h-16 w-16 place-items-center rounded-full bg-sunny-50 text-sunny-300"><Icon name="bag" className="h-8 w-8" /></div>
            <p className="text-sm text-muted">{tab === "todo" ? "やることはありません" : tab === "review" ? "確認待ちの案件はありません" : "完了した案件はありません"}</p>
            <Link href="/app" data-haptic="tap" className="btn-soft ripple-host">案件をさがす</Link>
          </div>
        ) : cur.map((a, i) => {
          const c = a.campaign;
          const tx = txns.find((t) => t.campaignId === c.id);
          return (
            <div key={a.id} style={{ animationDelay: `${i * 70}ms` }} className="reveal card overflow-hidden p-4">
              <div className="flex gap-3">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl"><Thumb imageUrl={c.product.imageUrl} art={ART_BY_CATEGORY(c.product.category)} className="h-16" svgClass="h-10 w-10" /></div>
                <div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><p className="min-w-0 flex-1 truncate font-semibold text-ink">{c.title}</p><Pill label={applicationStatusLabel[a.status]} className={appStatusStyle[a.status]} /></div><p className="mt-0.5 truncate text-xs text-muted">{c.brand.name} ・ {rewardTypeLabel[c.rewardType]}</p></div>
              </div>
              {tab === "todo" && <SubmitPostForm applicationId={a.id} defaultUrl={a.postUrl} defaultReach={a.postReach} />}
              {tab === "review" && <div className="mt-4 flex items-center gap-2 border-t border-line pt-4 text-xs text-muted"><Icon name="clock" className="h-4 w-4 text-amber-500" />運営が確認中・リーチ {num(a.postReach)}</div>}
              {tab === "done" && <div className="mt-4 flex items-center gap-2 border-t border-line pt-4 text-xs text-ink/70"><Icon name="check" className="h-4 w-4 text-sunny-500" />完了・リーチ {num(a.postReach)}{tx ? ` ・ 報酬 ${yen(tx.amountYen)}` : c.rewardType === "GIFTING" ? " ・ 現物提供" : ""}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
