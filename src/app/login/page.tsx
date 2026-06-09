import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { LoginForm } from "@/components/AuthForms";
import { SunMark, Icon } from "@/components/Icon";

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session?.role === "ADMIN") redirect("/admin");

  return (
    <main className="grid min-h-[100dvh] place-items-center bg-canvas px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <SunMark className="mx-auto h-14 w-14" />
          <h1 className="display mt-4 text-2xl font-semibold text-ink">運営コンソール</h1>
          <p className="mt-1.5 flex items-center justify-center gap-1.5 text-xs text-muted"><Icon name="shield" className="h-4 w-4" /> 関係者専用 ・ Sunnyway 運営</p>
        </div>
        <div className="card p-6"><LoginForm role="ADMIN" /></div>
        <p className="mt-5 text-center text-xs text-muted">ブランドはこの画面にアクセスできません。掲載は運営が代理で行います。</p>
        <p className="mt-3 text-center text-xs"><Link href="/" className="text-sunny-600 underline">← Sunnyway アプリへ</Link></p>
      </div>
    </main>
  );
}
