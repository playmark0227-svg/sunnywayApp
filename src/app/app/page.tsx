import { prisma } from "@/lib/db";
import { requireInfluencer } from "@/lib/auth";
import { ApplyForm } from "@/components/InfluencerForms";
import { rewardTypeLabel, yen } from "@/lib/labels";

export default async function InfluencerFeed() {
  const me = await requireInfluencer();
  const profile = await prisma.influencerProfile.findUnique({
    where: { userId: me.userId },
    select: { id: true },
  });

  const [campaigns, myApps] = await Promise.all([
    prisma.campaign.findMany({
      where: { status: "OPEN" },
      orderBy: { createdAt: "desc" },
      include: {
        brand: { select: { name: true } },
        product: true,
      },
    }),
    profile
      ? prisma.application.findMany({
          where: { influencerId: profile.id },
          select: { campaignId: true },
        })
      : Promise.resolve([]),
  ]);

  const appliedIds = new Set(myApps.map((a) => a.campaignId));

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900">募集中の案件</h1>
      <p className="mt-0.5 text-sm text-gray-500">
        気になるコスメに応募して、投稿しよう
      </p>

      {campaigns.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-400">
          いまは募集中の案件がありません。
          <br />
          また見にきてね ☀️
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {campaigns.map((c) => {
            const applied = appliedIds.has(c.id);
            return (
              <article key={c.id} className="card overflow-hidden">
                <div className="flex h-40 items-center justify-center bg-sunny-50">
                  {c.product.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={c.product.imageUrl}
                      alt={c.product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-5xl">💄</span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="badge bg-sunny-100 text-sunny-700">
                      {rewardTypeLabel[c.rewardType]}
                    </span>
                    <span className="badge bg-gray-100 text-gray-600">
                      {c.product.category}
                    </span>
                  </div>
                  <h2 className="mt-2 font-bold text-gray-900">{c.title}</h2>
                  <p className="text-sm text-gray-500">
                    {c.brand.name} / {c.product.name}
                  </p>
                  {c.brief && (
                    <p className="mt-2 line-clamp-3 text-sm text-gray-600">
                      {c.brief}
                    </p>
                  )}

                  <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
                    {c.rewardType !== "GIFTING" && c.rewardYen > 0 && (
                      <span>
                        💰 報酬 <b>{yen(c.rewardYen)}</b>
                      </span>
                    )}
                    {c.rewardType !== "PAID" && (
                      <span>🎁 現物提供</span>
                    )}
                    <span className="text-gray-400">
                      募集 {c.targetInfluencers}人
                    </span>
                  </div>

                  <div className="mt-4">
                    {applied ? (
                      <p className="rounded-lg bg-gray-100 px-3 py-2 text-center text-sm text-gray-500">
                        応募済み（マイページで確認）
                      </p>
                    ) : (
                      <ApplyForm campaignId={c.id} />
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
