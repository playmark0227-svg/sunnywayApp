import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireInfluencer } from "@/lib/auth";
import { Icon, Thumb, ART_BY_CATEGORY, SunMark } from "@/components/Icon";
import { ApplyForm, FavoriteButton } from "@/components/app/forms";
import { rewardTypeLabel, num, parseTags } from "@/lib/labels";

const CATS = ["すべて", "スキンケア", "メイクアップ", "顔出し不要", "報酬あり"];

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ cat?: string }> }) {
  const me = await requireInfluencer();
  const cat = (await searchParams).cat || "すべて";
  const profile = await prisma.influencerProfile.findUnique({ where: { userId: me.userId }, select: { id: true, favorites: true } });
  const favs = new Set((profile?.favorites || "").split(",").map((s) => s.trim()).filter(Boolean));

  const campaigns = await prisma.campaign.findMany({
    where: { status: "OPEN" },
    orderBy: { createdAt: "desc" },
    include: { brand: { select: { name: true } }, product: true, _count: { select: { applications: true } } },
  });
  const myApps = await prisma.application.findMany({ where: { influencerId: profile!.id }, select: { campaignId: true } });
  const appliedIds = new Set(myApps.map((a) => a.campaignId));
  const unread = await prisma.notification.count({ where: { influencerId: profile!.id, read: false } });

  const match = (c: (typeof campaigns)[number]) =>
    cat === "すべて" ? true
      : cat === "顔出し不要" ? parseTags(c.tags).includes("顔出し不要")
      : cat === "報酬あり" ? (c.rewardType === "PAID" || c.rewardType === "BOTH")
      : c.product.category === cat;
  const list = campaigns.filter(match);
  const medias = [...new Set(list.map((c) => c.media))];

  return (
    <div className="fade">
      <header data-elevate className="elevate sticky top-0 z-20 flex items-center justify-between bg-canvas/80 px-5 pb-3 backdrop-blur-xl" style={{ paddingTop: "max(0.9rem,env(safe-area-inset-top))" }}>
        <h1 className="display text-xl font-semibold text-ink">さがす</h1>
        <Link href="/app/notifications" data-haptic="tap" className="ripple-host relative grid h-10 w-10 place-items-center rounded-full text-ink/65 hover:bg-ink/5">
          <Icon name="bell" className={`h-5 w-5 ${unread > 0 ? "breathe" : ""}`} />
          {unread > 0 && <span className="pop absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-sunny-500 px-1 text-[10px] font-bold text-white">{unread}</span>}
        </Link>
      </header>

      <div className="px-5 pt-1">
        <div className="shine grad-move relative overflow-hidden rounded-3xl bg-sunrise p-6 text-white shadow-lift">
          <div className="breathe absolute -right-6 -top-8 opacity-30"><Icon name="spark" className="h-28 w-28" fill /></div>
          <SunMark className="float absolute bottom-3 right-5 h-16 w-16 drop-shadow-xl" />
          <p className="text-xs font-semibold uppercase tracking-widest text-white/80">Monthly Award</p>
          <p className="display mt-1 text-2xl font-semibold leading-snug">今月のベスト投稿に<br />最大 ¥50,000</p>
          <div className="mt-4 flex gap-1.5">{[0, 1, 2].map((i) => <span key={i} className={`h-1.5 rounded-full transition-all ${i === 0 ? "w-6 bg-white" : "w-1.5 bg-white/50"}`} />)}</div>
        </div>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto px-5 pb-1">
        {CATS.map((c) => (
          <Link key={c} href={c === "すべて" ? "/app" : `/app?cat=${encodeURIComponent(c)}`} data-haptic="select" className={`chip press whitespace-nowrap ${cat === c ? "bg-ink text-white shadow-soft" : "border border-line bg-surface text-ink/70"}`}>{c}</Link>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="px-5 py-20 text-center text-sm text-muted">条件に合う案件がありません</p>
      ) : (
        medias.map((mediaName) => (
          <section key={mediaName} className="mt-7">
            <div className="mb-3 flex items-baseline justify-between px-5"><h2 className="display flex items-center gap-2 text-base font-semibold text-ink"><span className="tick" />{mediaName}</h2><span className="text-xs text-muted">{list.filter((c) => c.media === mediaName).length}件</span></div>
            <div className="flex snap-x gap-4 overflow-x-auto px-5 pb-2 md:grid md:grid-cols-2 md:overflow-visible lg:grid-cols-3">
              {list.filter((c) => c.media === mediaName).map((c, i) => {
                const art = ART_BY_CATEGORY(c.product.category);
                const applied = c.appliedBase + c._count.applications;
                const already = appliedIds.has(c.id);
                const tags = parseTags(c.tags);
                const reward = (c.rewardType === "PAID" || c.rewardType === "BOTH") && c.rewardYen > 0 ? "¥" + num(c.rewardYen) : c.rewardType === "OTHER" ? "特別報酬" : "ギフティング";
                const pct = Math.min(100, Math.round((applied / Math.max(1, c.targetInfluencers)) * 100));
                return (
                  <article key={c.id} style={{ animationDelay: `${i * 80}ms` }} className="reveal ripple-host img-zoom w-[15.5rem] shrink-0 snap-start overflow-hidden rounded-3xl border border-line bg-surface shadow-soft hover-lift md:w-auto md:shrink">
                    <div className="relative">
                      <Link href={`/app/campaign/${c.id}`} data-haptic="tap" className="block"><Thumb imageUrl={c.product.imageUrl} art={art} className="h-44" /></Link>
                      {tags[0] && <span className="badge absolute left-3 top-3 bg-white/90 text-ink/80 backdrop-blur">{tags[0]}</span>}
                      <FavoriteButton campaignId={c.id} fav={favs.has(c.id)} />
                    </div>
                    <div className="p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">{c.brand.name}</p>
                      <Link href={`/app/campaign/${c.id}`}><h3 className="mt-1 line-clamp-2 text-[15px] font-semibold leading-snug text-ink">{c.title}</h3></Link>
                      <div className="mt-3 flex items-center gap-1.5 text-sunny-600"><Icon name="spark" className="h-4 w-4" fill /><span className="grad-num text-sm font-bold">{reward}</span></div>
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-muted"><span>応募 <b className="text-ink">{applied}</b>/{c.targetInfluencers}名</span><span>〆 {c.deadline}</span></div>
                        <div className="progress-track mt-2 h-1.5 bg-ink/5"><div className="progress-fill h-full rounded-full bg-sunrise" style={{ width: `${Math.max(6, pct)}%` }} /></div>
                      </div>
                      <div className="mt-3">{already ? <p className="flex items-center justify-center gap-1 rounded-full bg-emerald-50 py-2.5 text-center text-sm font-medium text-emerald-700"><Icon name="check" className="h-4 w-4" />応募済み</p> : <ApplyForm campaignId={c.id} />}</div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))
      )}
      <div className="h-6" />
    </div>
  );
}
