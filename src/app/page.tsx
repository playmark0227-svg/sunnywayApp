import Link from "next/link";
import { getSession } from "@/lib/auth";

export default async function Home() {
  const session = await getSession();

  return (
    <main className="min-h-screen">
      {/* ヒーロー */}
      <section className="bg-gradient-to-b from-sunny-50 to-white">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-sunny-100 px-4 py-1.5 text-sm font-medium text-sunny-700">
            ☀️ Sunnyway Platform
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            ここに掲載すれば、
            <br className="sm:hidden" />
            <span className="text-sunny-500">何人ものインフルエンサー</span>
            が
            <br />
            あなたのコスメを取り上げる。
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            Sunnyway は、コスメブランドとインフルエンサーをつなぐマッチング
            プラットフォームです。掲載から投稿・成果レポートまでを一気通貫で。
          </p>

          {session ? (
            <div className="mt-10">
              <Link
                href={session.role === "ADMIN" ? "/admin" : "/app"}
                className="btn-primary px-6 py-3 text-base"
              >
                {session.name} さんのダッシュボードへ →
              </Link>
            </div>
          ) : (
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/app"
                className="btn-primary px-6 py-3 text-base"
              >
                インフルエンサーとして参加する
              </Link>
              <Link href="/login" className="btn-ghost px-6 py-3 text-base">
                運営（Sunnyway）管理ログイン
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 3 者の関係 */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-center text-2xl font-bold text-gray-900">
          仕組み
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <RoleCard
            emoji="☀️"
            title="Sunnyway（運営）"
            desc="プラットフォームを所有・運営。ブランドの掲載を代理で作成し、インフルエンサーを束ね、成果をレポート。"
            tag="管理 Web ・ セキュア"
          />
          <RoleCard
            emoji="💄"
            title="コスメブランド"
            desc="商品を掲載してもらう顧客。管理権限は持たず、Sunnyway 経由で掲載・成果を受け取る。"
            tag="運営が代理"
          />
          <RoleCard
            emoji="✨"
            title="インフルエンサー"
            desc="募集中の商品に応募し、現物提供や報酬を受けて投稿。取り上げ実績がレポートに反映。"
            tag="アプリ（PWA）"
          />
        </div>
      </section>

      <footer className="border-t border-gray-200 py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Sunnyway
      </footer>
    </main>
  );
}

function RoleCard({
  emoji,
  title,
  desc,
  tag,
}: {
  emoji: string;
  title: string;
  desc: string;
  tag: string;
}) {
  return (
    <div className="card p-6">
      <div className="text-3xl">{emoji}</div>
      <h3 className="mt-3 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{desc}</p>
      <span className="badge mt-4 bg-sunny-100 text-sunny-700">{tag}</span>
    </div>
  );
}
