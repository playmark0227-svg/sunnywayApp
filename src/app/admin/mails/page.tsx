import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { PageHeader } from "@/components/ui";
import { MailForm } from "@/components/AdminForms";

const STATUS_STYLE: Record<string, string> = {
  SENT: "bg-emerald-50 text-emerald-700",
  LOGGED: "bg-sunny-50 text-sunny-700",
  ERROR: "bg-rose-50 text-rose-600",
};
const STATUS_LABEL: Record<string, string> = { SENT: "送信済み", LOGGED: "記録のみ", ERROR: "失敗" };

export default async function MailsPage({ searchParams }: { searchParams: Promise<{ to?: string }> }) {
  await requireAdmin();
  const { to } = await searchParams;
  const [influencers, brands, logs] = await Promise.all([
    prisma.influencerProfile.findMany({ orderBy: { createdAt: "desc" }, select: { handle: true, user: { select: { name: true, email: true } } } }),
    prisma.brand.findMany({ where: { contactEmail: { not: "" } }, orderBy: { name: "asc" }, select: { name: true, contactEmail: true } }),
    prisma.mailLog.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
  ]);
  const providerReady = Boolean(process.env.RESEND_API_KEY);

  return (
    <div>
      <PageHeader title="メール" description="登録アドレスへのお知らせ送信と送信履歴" />
      <div className="grid gap-6 lg:grid-cols-5">
        <section className="card p-6 lg:col-span-2">
          <h2 className="display mb-1 font-semibold text-ink">メールを作成</h2>
          <p className="mb-4 text-xs text-muted">
            {providerReady
              ? "送信プロバイダ設定済み。実際にメールが送信されます。"
              : "メールプロバイダ未設定のため、内容は送信履歴への記録のみ（本番は RESEND_API_KEY を設定）。"}
          </p>
          <MailForm
            influencers={influencers.map((i) => ({ name: i.user.name, handle: i.handle, email: i.user.email }))}
            brands={brands}
            defaultTo={to}
          />
        </section>

        <section className="card overflow-hidden lg:col-span-3">
          <h2 className="display px-6 pt-6 font-semibold text-ink">送信履歴</h2>
          {logs.length === 0 ? <p className="px-6 py-10 text-center text-sm text-muted">まだ送信履歴はありません</p> : (
            <ul className="mt-3 divide-y divide-line">
              {logs.map((m) => (
                <li key={m.id} className="px-6 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className="font-semibold text-ink">{m.subject}</span>
                      <span className="ml-2 text-xs text-muted">→ {m.to}</span>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className={`badge ${STATUS_STYLE[m.status] ?? "bg-ink/5 text-ink/60"}`}>{STATUS_LABEL[m.status] ?? m.status}</span>
                      <span className="text-xs text-muted">{m.createdAt.toLocaleString("ja-JP", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                  </div>
                  <p className="mt-1 line-clamp-2 whitespace-pre-line text-sm text-ink/70">{m.body}</p>
                  {m.error && <p className="mt-1 text-xs text-rose-500">{m.error}</p>}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
