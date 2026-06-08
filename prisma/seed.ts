import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 seeding…");

  // 既存データを掃除（開発用）
  await prisma.auditLog.deleteMany();
  await prisma.application.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.product.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.influencerProfile.deleteMany();
  await prisma.user.deleteMany();

  const adminPass = await bcrypt.hash("sunnyway123", 10);
  const infPass = await bcrypt.hash("password123", 10);

  // --- 運営(ADMIN) ---
  const admin = await prisma.user.create({
    data: {
      email: "admin@sunnyway.test",
      name: "Sunnyway 運営",
      role: "ADMIN",
      passwordHash: adminPass,
    },
  });

  // --- ブランド & 商品 ---
  const lumiere = await prisma.brand.create({
    data: {
      name: "Lumière Cosmetics",
      contactName: "佐藤 美咲",
      contactEmail: "miyabi@lumiere.test",
      monthlyFeeYen: 50000,
      notes: "新規スキンケアライン展開中",
      products: {
        create: [
          {
            name: "グロウセラム C",
            category: "スキンケア",
            description: "ビタミンC配合の美容液。透明感のある肌へ。",
            retailPriceYen: 4800,
          },
          {
            name: "モイストクリーム",
            category: "スキンケア",
            description: "高保湿のナイトクリーム。",
            retailPriceYen: 3600,
          },
        ],
      },
    },
    include: { products: true },
  });

  const blossom = await prisma.brand.create({
    data: {
      name: "Blossom Tokyo",
      contactName: "田中 玲奈",
      contactEmail: "rena@blossom.test",
      monthlyFeeYen: 0,
      notes: "メイクアップ中心。キャンペーン課金希望。",
      products: {
        create: [
          {
            name: "ベルベットリップ 03",
            category: "メイクアップ",
            description: "マットな発色が続くリップ。",
            retailPriceYen: 2200,
          },
        ],
      },
    },
    include: { products: true },
  });

  // --- キャンペーン(掲載) ---
  const camp1 = await prisma.campaign.create({
    data: {
      brandId: lumiere.id,
      productId: lumiere.products[0].id,
      title: "【ギフティング】グロウセラムCを使ってみて！",
      brief:
        "2週間使用して、使用感・テクスチャーを率直にレビューしてください。ストーリーズ1回＋フィード1投稿。",
      status: "OPEN",
      targetInfluencers: 15,
      rewardType: "GIFTING",
      billingModels: "MONTHLY,PERFORMANCE",
    },
  });

  const camp2 = await prisma.campaign.create({
    data: {
      brandId: blossom.id,
      productId: blossom.products[0].id,
      title: "新色リップ 03 PRキャンペーン",
      brief: "リップスウォッチ＋着用カットを投稿してください。",
      status: "OPEN",
      targetInfluencers: 8,
      rewardType: "BOTH",
      rewardYen: 5000,
      billingModels: "PER_CAMPAIGN,SALES_COMMISSION",
      campaignFeeYen: 120000,
      salesCommissionPct: 10,
    },
  });

  // --- インフルエンサー ---
  async function makeInfluencer(
    email: string,
    name: string,
    handle: string,
    platform: string,
    followers: number,
    verified = false
  ) {
    return prisma.user.create({
      data: {
        email,
        name,
        role: "INFLUENCER",
        passwordHash: infPass,
        influencer: {
          create: { handle, platform, followers, verified },
        },
      },
      include: { influencer: true },
    });
  }

  const aoi = await makeInfluencer(
    "aoi@influencer.test",
    "Aoi",
    "aoi_beauty",
    "INSTAGRAM",
    28000,
    true
  );
  const mei = await makeInfluencer(
    "mei@influencer.test",
    "Mei",
    "mei_cosme",
    "TIKTOK",
    51000
  );
  const rina = await makeInfluencer(
    "rina@influencer.test",
    "Rina",
    "rina_skin",
    "INSTAGRAM",
    9800
  );

  // --- 応募・実績 ---
  // camp1: aoi=投稿済み, mei=承認, rina=応募
  await prisma.application.create({
    data: {
      campaignId: camp1.id,
      influencerId: aoi.influencer!.id,
      status: "POSTED",
      message: "ビタミンC系大好きです！",
      postUrl: "https://www.instagram.com/p/example-aoi",
      postReach: 18400,
      postedAt: new Date(),
    },
  });
  await prisma.application.create({
    data: {
      campaignId: camp1.id,
      influencerId: mei.influencer!.id,
      status: "APPROVED",
      message: "ショート動画で紹介したいです",
    },
  });
  await prisma.application.create({
    data: {
      campaignId: camp1.id,
      influencerId: rina.influencer!.id,
      status: "APPLIED",
      message: "敏感肌レビュー得意です",
    },
  });

  // camp2: aoi=承認, rina=投稿済み
  await prisma.application.create({
    data: {
      campaignId: camp2.id,
      influencerId: aoi.influencer!.id,
      status: "APPROVED",
    },
  });
  await prisma.application.create({
    data: {
      campaignId: camp2.id,
      influencerId: rina.influencer!.id,
      status: "POSTED",
      postUrl: "https://www.instagram.com/p/example-rina",
      postReach: 7200,
      postedAt: new Date(),
    },
  });

  // --- 監査ログのサンプル ---
  await prisma.auditLog.createMany({
    data: [
      { actorId: admin.id, action: "brand.create", target: lumiere.id },
      { actorId: admin.id, action: "campaign.create", target: camp1.id },
      {
        actorId: admin.id,
        action: "application.decide",
        target: aoi.influencer!.id,
        meta: JSON.stringify({ decision: "APPROVED" }),
      },
    ],
  });

  console.log("✅ seeding done");
  console.log("--------------------------------------------------");
  console.log("管理者ログイン:  admin@sunnyway.test  / sunnyway123");
  console.log("インフルエンサー: aoi@influencer.test  / password123");
  console.log("               mei@influencer.test  / password123");
  console.log("               rina@influencer.test / password123");
  console.log("--------------------------------------------------");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
