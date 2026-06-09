import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireInfluencer } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth";
import { Icon } from "@/components/Icon";
import { num, yen, isPosted } from "@/lib/labels";

const ITEMS: [string, string, string][] = [
  ["profile", "edit", "プロフィール"],
  ["address", "pin", "住所"],
  ["sns", "link", "SNS連携"],
  ["bank", "card", "振込先"],
  ["transactions", "receipt", "取引履歴"],
  ["notify", "bellgear", "通知"],
];

export default async function MePage() {
  const me = await requireInfluencer();
  const profile = await prisma.influencerProfile.findUnique({
    where: { userId: me.userId },
    include: { user: { select: { name: true } }, applications: { select: { status: true } }, transactions: { select: { amountYen: true } } },
  });
  if (!profile) return null;
  const reward = profile.transactions.reduce((s, t) => s + t.amountYen, 0);
  const posted = profile.applications.filter((a) => isPosted(a.status)).length;

  return (
    <div className="fade">
      <header className="sticky top-0 z-20 flex items-center bg-canvas/80 px-5 pb-3 backdrop-blur-xl" style={{ paddingTop: "max(0.9rem,env(safe-area-inset-top))" }}>
        <h1 className="display text-xl font-semibold text-ink">マイページ</h1>
      </header>

      <div className="px-5 pb-6 pt-2">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-sunrise p-0.5"><div className="grid h-full w-full place-items-center rounded-full bg-canvas text-sunny-500"><Icon name="spark" className="h-7 w-7" fill /></div></div>
          <div><div className="flex items-center gap-1.5"><p className="display text-xl font-semibold text-ink">{profile.user.name}</p>{profile.verified && <Icon name="check" className="h-4 w-4 text-sunny-500" />}</div><p className="text-sm text-muted">@{profile.handle} ・ {num(profile.followers)} フォロワー</p></div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 px-5">
        {[["応募", String(profile.applications.length)], ["取り上げ", String(posted)], ["報酬", yen(reward)]].map(([l, v]) => (
          <div key={l} className="rounded-2xl border border-line bg-surface p-3 text-center"><div className="display text-xl font-semibold text-ink">{v}</div><div className="mt-0.5 text-[11px] text-muted">{l}</div></div>
        ))}
      </div>

      <p className="px-5 pb-2 pt-7 text-xs font-semibold uppercase tracking-wider text-muted">アカウント</p>
      <div className="mx-5 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
        {ITEMS.map(([k, icon, label]) => (
          <Link key={k} href={`/app/me/${k}`} className="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-canvas">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-sunny-50 text-sunny-600"><Icon name={icon} className="h-5 w-5" /></span>
            <span className="flex-1 text-sm font-medium text-ink">{label}</span>
            {k === "notify" && !profile.notify && <span className="text-xs text-sunny-600">ONにしよう</span>}
            <span className="text-ink/25"><Icon name="chevron" className="h-4 w-4" /></span>
          </Link>
        ))}
      </div>

      <p className="px-5 pb-2 pt-7 text-xs font-semibold uppercase tracking-wider text-muted">サポート</p>
      <div className="mx-5 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
        <Link href="/app/inbox" className="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-canvas"><span className="grid h-9 w-9 place-items-center rounded-xl bg-sunny-50 text-sunny-600"><Icon name="chat" className="h-5 w-5" /></span><span className="flex-1 text-sm font-medium text-ink">お問い合わせ</span><span className="text-ink/25"><Icon name="chevron" className="h-4 w-4" /></span></Link>
        <form action={logoutAction}>
          <button className="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-canvas"><span className="grid h-9 w-9 place-items-center rounded-xl bg-ink/5 text-ink/50"><Icon name="logout" className="h-5 w-5" /></span><span className="flex-1 text-sm font-medium text-ink">ログアウト</span></button>
        </form>
      </div>
      <div className="h-8" />
    </div>
  );
}
