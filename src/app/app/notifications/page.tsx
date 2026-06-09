import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireInfluencer } from "@/lib/auth";
import { Icon } from "@/components/Icon";
import { MarkRead } from "@/components/app/MarkRead";

export default async function NotificationsPage() {
  const me = await requireInfluencer();
  const profile = await prisma.influencerProfile.findUnique({ where: { userId: me.userId }, select: { id: true } });
  const items = await prisma.notification.findMany({ where: { influencerId: profile!.id }, orderBy: { createdAt: "desc" }, take: 50 });

  return (
    <div className="fade">
      <MarkRead />
      <header className="sticky top-0 z-20 flex items-center gap-2 bg-canvas/80 px-3 pb-3 backdrop-blur-xl" style={{ paddingTop: "max(0.9rem,env(safe-area-inset-top))" }}>
        <Link href="/app" className="grid h-10 w-10 place-items-center rounded-full text-ink/65 hover:bg-ink/5"><Icon name="back" className="h-5 w-5" /></Link>
        <h1 className="display text-lg font-semibold text-ink">お知らせ</h1>
      </header>
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-24 text-center"><div className="grid h-16 w-16 place-items-center rounded-full bg-sunny-50 text-sunny-300"><Icon name="bell" className="h-8 w-8" /></div><p className="text-sm text-muted">お知らせはありません</p></div>
      ) : (
        <ul className="divide-y divide-line p-2">
          {items.map((n) => {
            const body = (
              <div className={`flex items-start gap-3 rounded-2xl p-3 ${n.read ? "" : "bg-sunny-50/60"}`}>
                <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sunny-100 text-sunny-600"><Icon name="bell" className="h-5 w-5" /></span>
                <div className="min-w-0 flex-1"><p className="text-sm leading-relaxed text-ink">{n.text}</p><p className="mt-0.5 text-xs text-muted">{n.createdAt.toLocaleString("ja-JP", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}</p></div>
                {!n.read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-sunny-500" />}
              </div>
            );
            return <li key={n.id}>{n.href ? <Link href={n.href}>{body}</Link> : body}</li>;
          })}
        </ul>
      )}
    </div>
  );
}
