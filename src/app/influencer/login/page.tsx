import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LoginForm } from "@/components/AuthForms";

export default async function InfluencerLoginPage() {
  const session = await getSession();
  if (session?.role === "INFLUENCER") redirect("/app");

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            ← Sunnyway
          </Link>
          <h1 className="mt-3 text-2xl font-bold text-gray-900">
            インフルエンサー ログイン
          </h1>
        </div>
        <div className="card p-6">
          <LoginForm role="INFLUENCER" />
        </div>
        <p className="mt-6 text-center text-sm text-gray-500">
          はじめての方は{" "}
          <Link
            href="/influencer/register"
            className="font-semibold text-sunny-600 hover:text-sunny-700"
          >
            新規登録
          </Link>
        </p>
      </div>
    </main>
  );
}
