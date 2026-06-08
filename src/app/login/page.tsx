import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LoginForm } from "@/components/AuthForms";

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session?.role === "ADMIN") redirect("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            ← Sunnyway
          </Link>
          <h1 className="mt-3 text-2xl font-bold text-gray-900">
            運営 管理ログイン
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Sunnyway 運営（管理者）専用の入口です
          </p>
        </div>
        <div className="card p-6">
          <LoginForm role="ADMIN" />
        </div>
        <p className="mt-6 text-center text-xs text-gray-400">
          🔒 ブランドは管理画面にアクセスできません。掲載は運営が代理で行います。
        </p>
      </div>
    </main>
  );
}
