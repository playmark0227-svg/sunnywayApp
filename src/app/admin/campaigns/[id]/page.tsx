import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { PageHeader, Stat, StatusBadge } from "@/components/ui";
import {
  decideApplicationAction,
  updateCampaignStatusAction,
} from "@/lib/actions/admin";
import {
  applicationStatusLabel,
  billingModelLabel,
  campaignStatusLabel,
  parseBillingModels,
  rewardTypeLabel,
  yen,
} from "@/lib/labels";

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const campaign = await prisma.campaign.findUnique({
    where: { id },
    include: {
      brand: true,
      product: true,
      applications: {
        orderBy: { createdAt: "desc" },
        include: { influencer: { include: { user: { select: { name: true } } } } },
      },
    },
  });
  if (!campaign) notFound();

  const posted = campaign.applications.filter((a) => a.status === "POSTED");
  const approved = campaign.applications.filter((a) => a.status === "APPROVED");
  const applied = campaign.applications.filter((a) => a.status === "APPLIED");
  const totalReach = posted.reduce((s, a) => s + a.postReach, 0);

  return (
    <div>
      <Link
        href="/admin/campaigns"
        className="text-sm text-gray-500 hover:text-gray-700"
      >
        ← 掲載一覧へ
      </Link>

      <PageHeader
        title={campaign.title}
        description={`${campaign.brand.name} / ${campaign.product.name}`}
        action={
          <div className="flex items-center gap-2">
            <StatusBadge
              status={campaign.status}
              label={campaignStatusLabel[campaign.status]}
            />
          </div>
        }
      />

      {/* レポートのハイライト */}
      <div className="card mb-6 bg-gradient-to-r from-sunny-50 to-white p-6">
        <p className="text-sm text-gray-600">この掲載の成果</p>
        <p className="mt-1 text-3xl font-bold text-gray-900">
          <span className="text-sunny-600">{posted.length}人</span>
          のインフルエンサーが取り上げました
        </p>
        <p className="mt-1 text-sm text-gray-500">
          目標 {campaign.targetInfluencers}人 ・ 合計リーチ{" "}
          {totalReach.toLocaleString("ja-JP")}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="応募" value={campaign.applications.length} />
        <Stat label="承認（参加確定）" value={approved.length + posted.length} />
        <Stat label="取り上げ（投稿）" value={posted.length} />
        <Stat label="合計リーチ" value={totalReach.toLocaleString("ja-JP")} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* 掲載・課金情報 */}
        <section className="card p-5 lg:col-span-1">
          <h2 className="mb-3 font-semibold text-gray-900">掲載情報</h2>
          <dl className="space-y-2 text-sm">
            <Row label="報酬タイプ" value={rewardTypeLabel[campaign.rewardType]} />
            {campaign.rewardYen > 0 && (
              <Row label="1人あたり報酬" value={yen(campaign.rewardYen)} />
            )}
            <Row
              label="収益モデル"
              value={parseBillingModels(campaign.billingModels)
                .map((m) => billingModelLabel[m] ?? m)
                .join(" / ")}
            />
            {campaign.campaignFeeYen > 0 && (
              <Row label="キャンペーン費用" value={yen(campaign.campaignFeeYen)} />
            )}
            {campaign.salesCommissionPct > 0 && (
              <Row
                label="販売手数料率"
                value={`${campaign.salesCommissionPct}%`}
              />
            )}
          </dl>
          {campaign.brief && (
            <>
              <h3 className="mb-1 mt-4 text-sm font-medium text-gray-700">
                依頼内容
              </h3>
              <p className="whitespace-pre-wrap text-sm text-gray-600">
                {campaign.brief}
              </p>
            </>
          )}

          {/* ステータス操作 */}
          <h3 className="mb-2 mt-4 text-sm font-medium text-gray-700">
            ステータス変更
          </h3>
          <div className="flex flex-wrap gap-2">
            {(["OPEN", "CLOSED", "COMPLETED"] as const).map((s) => (
              <form key={s} action={updateCampaignStatusAction}>
                <input type="hidden" name="campaignId" value={campaign.id} />
                <input type="hidden" name="status" value={s} />
                <button
                  className="btn-ghost text-xs"
                  disabled={campaign.status === s}
                >
                  {campaignStatusLabel[s]}にする
                </button>
              </form>
            ))}
          </div>
        </section>

        {/* 応募・実績 */}
        <section className="card p-5 lg:col-span-2">
          <h2 className="mb-3 font-semibold text-gray-900">
            応募・取り上げ実績
          </h2>

          {applied.length > 0 && (
            <p className="mb-3 rounded-lg bg-sunny-50 px-3 py-2 text-sm text-sunny-800">
              未対応の応募が {applied.length} 件あります。承認すると参加確定です。
            </p>
          )}

          {campaign.applications.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-400">
              まだ応募はありません。
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {campaign.applications.map((a) => (
                <li key={a.id} className="py-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          @{a.influencer.handle}
                        </span>
                        <StatusBadge
                          status={a.status}
                          label={applicationStatusLabel[a.status]}
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        {a.influencer.user.name} ・ フォロワー{" "}
                        {a.influencer.followers.toLocaleString("ja-JP")}
                      </p>
                      {a.message && (
                        <p className="mt-1 text-sm text-gray-600">
                          「{a.message}」
                        </p>
                      )}
                      {a.status === "POSTED" && (
                        <p className="mt-1 text-sm">
                          <a
                            href={a.postUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sunny-600 underline"
                          >
                            投稿を見る
                          </a>{" "}
                          <span className="text-gray-500">
                            ・ リーチ {a.postReach.toLocaleString("ja-JP")}
                          </span>
                        </p>
                      )}
                    </div>

                    {a.status === "APPLIED" && (
                      <div className="flex shrink-0 gap-2">
                        <form action={decideApplicationAction}>
                          <input
                            type="hidden"
                            name="applicationId"
                            value={a.id}
                          />
                          <input
                            type="hidden"
                            name="decision"
                            value="APPROVED"
                          />
                          <button className="btn-primary text-xs">承認</button>
                        </form>
                        <form action={decideApplicationAction}>
                          <input
                            type="hidden"
                            name="applicationId"
                            value={a.id}
                          />
                          <input
                            type="hidden"
                            name="decision"
                            value="REJECTED"
                          />
                          <button className="btn-ghost text-xs">却下</button>
                        </form>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-gray-500">{label}</dt>
      <dd className="text-right font-medium text-gray-800">{value}</dd>
    </div>
  );
}
