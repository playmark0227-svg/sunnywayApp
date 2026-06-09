import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 seeding…");
  await prisma.notification.deleteMany();
  await prisma.message.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.application.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.product.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.influencerProfile.deleteMany();
  await prisma.user.deleteMany();

  const adminPass = await bcrypt.hash("demo1234", 10);
  const infPass = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.create({
    data: { email: "admin@sunnyway.io", name: "Sunnyway 運営", role: "ADMIN", passwordHash: adminPass },
  });

  // --- ブランド & 商品 ---
  const lumiere = await prisma.brand.create({
    data: {
      name: "Lumière", contactName: "佐藤 美咲", contactEmail: "miyabi@lumiere.test", monthlyFeeYen: 50000, notes: "新スキンケアライン",
      products: {
        create: [
          { name: "グロウ セラム C", category: "スキンケア", description: "ビタミンC配合の美容液。", retailPriceYen: 4800 },
          { name: "モイスト クリーム", category: "スキンケア", description: "高保湿のナイトクリーム。", retailPriceYen: 3600 },
        ],
      },
    },
    include: { products: true },
  });
  const blossom = await prisma.brand.create({
    data: {
      name: "Blossom Tokyo", contactName: "田中 玲奈", contactEmail: "rena@blossom.test", monthlyFeeYen: 0, notes: "メイクアップ中心",
      products: { create: [{ name: "ベルベット リップ 03", category: "メイクアップ", description: "マットな発色のリップ。", retailPriceYen: 2200 }] },
    },
    include: { products: true },
  });
  const serum = lumiere.products[0], cream = lumiere.products[1], lip = blossom.products[0];

  // --- キャンペーン ---
  const c1 = await prisma.campaign.create({
    data: {
      brandId: lumiere.id, productId: serum.id, title: "グロウ セラム C を2週間レビュー",
      brief: "使用感とテクスチャーを率直に。ストーリーズ1回＋フィード1投稿。", status: "OPEN",
      media: "Instagram Feed", tags: "顔出し不要", appliedBase: 42, deadline: "6/30",
      targetInfluencers: 30, rewardType: "GIFTING", rewardYen: 0, billingModels: "MONTHLY,PERFORMANCE",
    },
  });
  const c2 = await prisma.campaign.create({
    data: {
      brandId: blossom.id, productId: lip.id, title: "新色リップ 03 リール投稿",
      brief: "スウォッチ＋着用カットをリールで。", status: "OPEN",
      media: "Instagram Reels", tags: "顔出しあり", appliedBase: 20, deadline: "6/20",
      targetInfluencers: 15, rewardType: "BOTH", rewardYen: 5000, billingModels: "PER_CAMPAIGN,SALES_COMMISSION", campaignFeeYen: 120000, salesCommissionPct: 10,
    },
  });
  const c3 = await prisma.campaign.create({
    data: {
      brandId: lumiere.id, productId: cream.id, title: "モイスト クリーム 保湿チャレンジ",
      brief: "夜のケアに2週間。翌朝の肌を投稿。", status: "OPEN",
      media: "Instagram Feed", tags: "顔出し不要", appliedBase: 33, deadline: "7/10",
      targetInfluencers: 20, rewardType: "GIFTING", rewardYen: 0, billingModels: "MONTHLY",
    },
  });
  const c4 = await prisma.campaign.create({
    data: {
      brandId: blossom.id, productId: lip.id, title: "発売イベント 招待 ＋ 商品",
      brief: "発売イベントへご招待。来場レポートを投稿。", status: "OPEN",
      media: "TikTok", tags: "来場必須", appliedBase: 11, deadline: "6/15",
      targetInfluencers: 8, rewardType: "OTHER", rewardYen: 0, billingModels: "PER_CAMPAIGN", campaignFeeYen: 80000,
    },
  });

  // --- インフルエンサー ---
  async function makeInf(email: string, name: string, handle: string, platform: string, followers: number, extra: Record<string, unknown> = {}) {
    const u = await prisma.user.create({
      data: { email, name, role: "INFLUENCER", passwordHash: infPass, influencer: { create: { handle, platform, followers, ...extra } } },
      include: { influencer: true },
    });
    return u.influencer!;
  }
  const aoi = await makeInf("aoi@influencer.test", "あゆむ", "aoi_beauty", "INSTAGRAM", 28000, {
    verified: true, bio: "コスメと美容が好き。", shippingAddress: "東京都渋谷区…", bank: "みずほ銀行 渋谷支店 普通 1234567", igLinked: true, favorites: c2.id,
  });
  const mei = await makeInf("mei@influencer.test", "めい", "mei_cosme", "TIKTOK", 51000, { ttLinked: true, notify: true });
  const rina = await makeInf("rina@influencer.test", "りな", "rina_skin", "INSTAGRAM", 9800, { bio: "敏感肌レビュー", igLinked: true });

  // --- 応募・実績 ---
  await prisma.application.createMany({
    data: [
      { campaignId: c1.id, influencerId: aoi.id, status: "COMPLETED", message: "ビタミンC系が好きです", postUrl: "https://www.instagram.com/p/demo-aoi", postReach: 18400, postedAt: new Date() },
      { campaignId: c1.id, influencerId: mei.id, status: "APPROVED", message: "ショート動画で紹介したい" },
      { campaignId: c1.id, influencerId: rina.id, status: "APPLIED", message: "敏感肌レビュー得意です" },
      { campaignId: c2.id, influencerId: aoi.id, status: "APPROVED" },
      { campaignId: c2.id, influencerId: rina.id, status: "SUBMITTED", postUrl: "https://www.instagram.com/p/demo-rina", postReach: 7200, postedAt: new Date() },
    ],
  });

  await prisma.transaction.create({ data: { influencerId: aoi.id, campaignId: c2.id, amountYen: 5000, status: "振込済み" } });
  await prisma.message.create({ data: { influencerId: aoi.id, fromStaff: true, text: "Sunnyway へようこそ。ご不明な点はお気軽にどうぞ。" } });
  await prisma.notification.createMany({
    data: [
      { influencerId: aoi.id, text: "案件が完了しました。報酬 ¥5,000 を振り込みました。", href: "/app/me/transactions", read: false },
      { influencerId: aoi.id, text: "「グロウ セラム C を2週間レビュー」に採用されました。", href: "/app/manage", read: true },
    ],
  });
  await prisma.auditLog.createMany({
    data: [
      { actorId: admin.id, action: "campaign.create", target: c1.id },
      { actorId: admin.id, action: "application.decide", target: aoi.id, meta: JSON.stringify({ decision: "APPROVED" }) },
      { actorId: admin.id, action: "payout.complete", target: aoi.id },
    ],
  });

  console.log("✅ done");
  console.log("----------------------------------------------------");
  console.log("運営  : admin@sunnyway.io / demo1234   → /login");
  console.log("アプリ: aoi@influencer.test / password123 → /");
  console.log("----------------------------------------------------");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
