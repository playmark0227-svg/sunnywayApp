import { prisma } from "@/lib/db";
import { requireInfluencer } from "@/lib/auth";
import { StatusBadge } from "@/components/ui";
import { ProfileForm, SubmitPostForm } from "@/components/InfluencerForms";
import {
  applicationStatusLabel,
  platformLabel,
  rewardTypeLabel,
} from "@/lib/labels";

export default async function MinePage() {
  const me = await requireInfluencer();
  const profile = await prisma.influencerProfile.findUnique({
    where: { userId: me.userId },
    include: {
      applications: {
        orderBy: { createdAt: "desc" },
        include: {
          campaign: {
            include: {
              brand: { select: { name: true } },
              product: { select: { name: true } },
            },
          },
        },
      },
    },
  });

  if (!profile) {
    return <p className="text-sm text-gray-500">プロフィールが見つかりません。</p>;
  }

  const postedCount = profile.applications.filter(
    (a) => a.status === "POSTED"
  ).length;
  const totalReach = profile.applications.reduce(
    (s, a) => s + a.postReach,
    0
  );

  return (
    <div className="space-y-6">
      {/* プロフィール概要 */}
      <section className="card p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sunny-100 text-2xl">
            ✨
          </div>
          <div>
            <p className="font-bold text-gray-900">@{profile.handle}</p>
            <p className="text-xs text-gray-500">
              {platformLabel[profile.platform] ?? profile.platform} ・ フォロワー{" "}
              {profile.followers.toLocaleString("ja-JP")}
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <Mini label="応募" value={profile.applications.length} />
          <Mini label="取り上げ" value={postedCount} />
          <Mini label="累計リーチ" value={totalReach.toLocaleString("ja-JP")} />
        </div>
      </section>

      {/* 参加中・応募中 */}
      <section>
        <h2 className="mb-2 font-bold text-gray-900">応募・参加状況</h2>
        {profile.applications.length === 0 ? (
          <p className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-400">
            まだ応募がありません。「さがす」から案件に応募してみよう。
          </p>
        ) : (
          <div className="space-y-3">
            {profile.applications.map((a) => (
              <div key={a.id} className="card p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-gray-900">
                      {a.campaign.title}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {a.campaign.brand.name} / {a.campaign.product.name} ・{" "}
                      {rewardTypeLabel[a.campaign.rewardType]}
                    </p>
                  </div>
                  <StatusBadge
                    status={a.status}
                    label={applicationStatusLabel[a.status]}
                  />
                </div>

                {/* 承認済み or 提出済みなら投稿フォームを表示 */}
                {(a.status === "APPROVED" || a.status === "POSTED") && (
                  <div className="mt-3 border-t border-gray-100 pt-3">
                    <p className="mb-2 text-xs font-medium text-gray-500">
                      {a.status === "POSTED"
                        ? "提出済み（更新も可能）"
                        : "投稿したら URL を提出してください"}
                    </p>
                    <SubmitPostForm
                      applicationId={a.id}
                      defaultUrl={a.postUrl}
                      defaultReach={a.postReach}
                    />
                  </div>
                )}
                {a.status === "REJECTED" && (
                  <p className="mt-2 text-xs text-gray-400">
                    今回は見送りとなりました。
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* プロフィール編集 */}
      <section className="card p-4">
        <h2 className="mb-3 font-bold text-gray-900">プロフィール設定</h2>
        <ProfileForm
          bio={profile.bio}
          shippingAddress={profile.shippingAddress}
          followers={profile.followers}
        />
      </section>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg bg-gray-50 py-2">
      <div className="text-lg font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}
