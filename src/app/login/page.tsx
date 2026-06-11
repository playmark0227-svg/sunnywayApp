import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { LoginForm } from "@/components/AuthForms";
import { SunMark, Icon } from "@/components/Icon";

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session?.role === "ADMIN") redirect("/admin");

  return (
    <main className="grid min-h-[100dvh] place-items-center px-6 py-10">
      <div className="w-full max-w-sm lg:max-w-4xl">
        <div className="overflow-hidden rounded-3xl shadow-card lg:grid lg:grid-cols-2">
          {/* ブランドパネル（lg+） */}
          <section className="grad-move shine relative hidden overflow-hidden bg-sunrise p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div className="breathe absolute -right-12 -top-14 opacity-25"><Icon name="spark" className="h-48 w-48" fill /></div>
            <div className="float absolute bottom-24 left-8 opacity-40"><Icon name="spark" className="h-6 w-6" fill /></div>
            <div>
              <p className="kicker text-white/80">Sunnyway Console</p>
              <h2 className="display mt-3 text-3xl font-semibold leading-snug">コスメと、出会う。<br />その裏側を、ここから。</h2>
              <p className="mt-4 text-sm leading-relaxed text-white/85">掲載・応募・報酬・実績を、<br />ひとつの画面で。</p>
            </div>
            <div className="flex items-end justify-between">
              <div className="space-y-1 text-xs text-white/75">
                <p>● 採用も報酬も2タップで完結</p>
                <p>● 全操作に監査ログ</p>
                <p>● 登録アドレスへ一斉メール</p>
              </div>
              <SunMark className="float h-24 w-24 drop-shadow-xl" />
            </div>
          </section>
          {/* ログインカード */}
          <section className="glass p-7 sm:p-10">
            <div className="mb-7 text-center">
              <SunMark className="mx-auto h-14 w-14" />
              <h1 className="display mt-4 text-2xl font-semibold text-ink">運営コンソール</h1>
              <p className="mt-1.5 flex items-center justify-center gap-1.5 text-xs text-muted"><Icon name="shield" className="h-4 w-4" /> 関係者専用 ・ Sunnyway 運営</p>
            </div>
            <LoginForm role="ADMIN" />
            <p className="mt-6 text-center text-xs text-muted">ブランドはこの画面にアクセスできません。<br />掲載は運営が代理で行います。</p>
            <p className="mt-3 text-center text-xs"><Link href="/" className="text-sunny-600 underline">← Sunnyway アプリへ</Link></p>
          </section>
        </div>
      </div>
    </main>
  );
}
