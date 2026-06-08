import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { RegisterForm } from "@/components/AuthForms";

export default async function InfluencerRegisterPage() {
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
            インフルエンサー 新規登録
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            登録後すぐに募集中の案件を見られます
          </p>
        </div>
        <div className="card p-6">
          <RegisterForm />
        </div>
        <p className="mt-6 text-center text-sm text-gray-500">
          すでに登録済みの方は{" "}
          <Link
            href="/influencer/login"
            className="font-semibold text-sunny-600 hover:text-sunny-700"
          >
            ログイン
          </Link>
        </p>
      </div>
    </main>
  );
}
