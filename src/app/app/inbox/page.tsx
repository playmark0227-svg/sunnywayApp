import { prisma } from "@/lib/db";
import { requireInfluencer } from "@/lib/auth";
import { SunMark } from "@/components/Icon";
import { MessageForm } from "@/components/app/forms";

export default async function InboxPage() {
  const me = await requireInfluencer();
  const profile = await prisma.influencerProfile.findUnique({ where: { userId: me.userId }, select: { id: true } });
  const messages = await prisma.message.findMany({ where: { influencerId: profile!.id }, orderBy: { createdAt: "asc" } });

  return (
    <div className="flex h-[calc(100dvh-4.5rem-env(safe-area-inset-bottom))] flex-col md:h-[100dvh]">
      <header className="flex items-center justify-between bg-canvas/80 px-5 pb-3 backdrop-blur-xl" style={{ paddingTop: "max(0.9rem,env(safe-area-inset-top))" }}>
        <h1 className="display text-xl font-semibold text-ink">メッセージ</h1>
      </header>
      <div className="flex items-center gap-2 border-b border-line px-5 py-2.5 text-sm font-semibold text-ink"><SunMark className="h-6 w-6" /> Sunnyway 公式</div>
      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
        {messages.length === 0 && <p className="py-10 text-center text-sm text-muted">メッセージはまだありません</p>}
        {messages.map((m) => m.fromStaff ? (
          <div key={m.id} className="flex items-end gap-2"><SunMark className="h-7 w-7" /><div className="max-w-[78%] rounded-2xl rounded-bl-md border border-line bg-surface px-4 py-2.5 text-sm leading-relaxed text-ink">{m.text}</div></div>
        ) : (
          <div key={m.id} className="flex justify-end"><div className="max-w-[78%] rounded-2xl rounded-br-md bg-sunrise px-4 py-2.5 text-sm leading-relaxed text-white shadow-lift">{m.text}</div></div>
        ))}
      </div>
      <MessageForm />
    </div>
  );
}
