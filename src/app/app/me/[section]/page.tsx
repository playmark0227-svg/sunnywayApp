import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireInfluencer } from "@/lib/auth";
import { Icon } from "@/components/Icon";
import { ProfileForm, AddressForm, BankForm, SnsToggle, NotifyToggle } from "@/components/app/forms";
import { yen, num } from "@/lib/labels";

const TITLES: Record<string, string> = { profile: "プロフィール", address: "住所", sns: "SNS連携", bank: "振込先", transactions: "取引履歴", notify: "通知" };

export default async function MeSection({ params }: { params: Promise<{ section: string }> }) {
  const me = await requireInfluencer();
  const { section } = await params;
  if (!TITLES[section]) notFound();
  const profile = await prisma.influencerProfile.findUnique({
    where: { userId: me.userId },
    include: { user: { select: { name: true } }, transactions: { orderBy: { createdAt: "desc" } } },
  });
  if (!profile) return null;

  return (
    <div className="fade">
      <header className="sticky top-0 z-20 flex items-center gap-2 bg-canvas/80 px-3 pb-3 backdrop-blur-xl" style={{ paddingTop: "max(0.9rem,env(safe-area-inset-top))" }}>
        <Link href="/app/me" className="grid h-10 w-10 place-items-center rounded-full text-ink/65 hover:bg-ink/5"><Icon name="back" className="h-5 w-5" /></Link>
        <h1 className="display text-lg font-semibold text-ink">{TITLES[section]}</h1>
      </header>

      {section === "profile" && <ProfileForm name={profile.user.name} bio={profile.bio} followers={profile.followers} />}
      {section === "address" && <AddressForm address={profile.shippingAddress} />}
      {section === "bank" && <BankForm bank={profile.bank} />}
      {section === "sns" && (
        <div className="space-y-4 p-5">
          <div className="flex items-center justify-between rounded-2xl border border-line bg-surface px-4 py-3.5"><span className="flex items-center gap-2 text-sm font-medium text-ink"><Icon name="link" className="h-4 w-4 text-muted" />Instagram</span><SnsToggle which="ig" linked={profile.igLinked} /></div>
          <div className="flex items-center justify-between rounded-2xl border border-line bg-surface px-4 py-3.5"><span className="flex items-center gap-2 text-sm font-medium text-ink"><Icon name="link" className="h-4 w-4 text-muted" />TikTok</span><SnsToggle which="tt" linked={profile.ttLinked} /></div>
          <p className="text-xs leading-relaxed text-muted">連携するとフォロワー数やリーチを自動取得します。</p>
        </div>
      )}
      {section === "notify" && (
        <div className="space-y-4 p-5">
          <div className="flex items-center justify-between rounded-2xl border border-line bg-surface px-4 py-4"><div><p className="text-sm font-semibold text-ink">プッシュ通知</p><p className="text-xs text-muted">採用・連絡・報酬振込をお知らせ</p></div><NotifyToggle on={profile.notify} /></div>
        </div>
      )}
      {section === "transactions" && (
        <div className="p-5">
          {profile.transactions.length === 0 ? <p className="py-16 text-center text-sm text-muted">取引履歴はまだありません</p> : (
            <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
              {profile.transactions.map((t) => (
                <div key={t.id} className="flex items-center justify-between px-4 py-4"><div><p className="text-sm font-semibold text-ink">案件報酬</p><p className="text-xs text-muted">{t.createdAt.toLocaleDateString("ja-JP")}</p></div><div className="text-right"><p className="display text-lg font-semibold text-ink">{yen(t.amountYen)}</p><span className="badge bg-emerald-50 text-emerald-700">{t.status}</span></div></div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
