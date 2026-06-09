/* ============================================================
   Sunnyway 共通基盤（アプリ/運営の両ページで共有）
   - データ（デモ）・整形・アイコン・イラスト・トースト
   ============================================================ */

// ---------- アイコン ----------
const ICON = {
  search: '<circle cx="11" cy="11" r="7"/><path d="m20.5 20.5-3.7-3.7"/>',
  bag: '<path d="M6 8.5h12l-1 10.5a2.2 2.2 0 0 1-2.2 2H9.2A2.2 2.2 0 0 1 7 19L6 8.5Z"/><path d="M9 8.5a3 3 0 0 1 6 0"/>',
  chat: '<path d="M5 6.5h14a1.2 1.2 0 0 1 1.2 1.2v7.6A1.2 1.2 0 0 1 19 16.5H10l-4 3v-3a1.2 1.2 0 0 1-1.2-1.2V7.7A1.2 1.2 0 0 1 5 6.5Z"/>',
  user: '<circle cx="12" cy="8.3" r="3.6"/><path d="M5.2 20a6.8 6.8 0 0 1 13.6 0"/>',
  bell: '<path d="M6.2 10a5.8 5.8 0 0 1 11.6 0c0 4.4 1.8 5.6 1.8 5.6H4.4S6.2 14.4 6.2 10Z"/><path d="M10.2 19.2a1.9 1.9 0 0 0 3.6 0"/>',
  heart: '<path d="M12 20s-6.8-4.2-9.1-8.6A4.4 4.4 0 0 1 12 6.6a4.4 4.4 0 0 1 9.1 4.8C18.8 15.8 12 20 12 20Z"/>',
  chevron: '<path d="m9.5 6 6 6-6 6"/>',
  back: '<path d="m14.5 5.5-6.5 6.5 6.5 6.5"/>',
  plus: '<path d="M12 5.5v13M5.5 12h13"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7"/>',
  send: '<path d="M5 12 20 5l-5 15-3.5-6.5L5 12Z"/>',
  edit: '<path d="M5 19h4l9.5-9.5a2 2 0 0 0-2.8-2.8L6 16v3Z"/><path d="M14.5 7.5 17 10"/>',
  pin: '<path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z"/><circle cx="12" cy="11" r="2.2"/>',
  link: '<path d="M9 13a4 4 0 0 0 6 .5l2.5-2.5a4 4 0 1 0-5.7-5.7L10.6 6.4"/><path d="M15 11a4 4 0 0 0-6-.5L6.5 13a4 4 0 1 0 5.7 5.7l1.2-1.2"/>',
  card: '<rect x="3.5" y="6" width="17" height="12" rx="2.4"/><path d="M3.5 10h17"/>',
  receipt: '<path d="M6 3.5h12v17l-2.2-1.4-2 1.4-2-1.4-2 1.4-2-1.4L6 20.5v-17Z"/><path d="M9 8h6M9 12h6"/>',
  bellgear: '<path d="M6.5 10a5.5 5.5 0 0 1 11 0c0 4.2 1.7 5.4 1.7 5.4H4.8S6.5 14.2 6.5 10Z"/><path d="M10.2 19a1.9 1.9 0 0 0 3.6 0"/>',
  logout: '<path d="M14 5h4.5v14H14"/><path d="M10 12h8M14.5 8.5 18 12l-3.5 3.5"/>',
  grid: '<rect x="4" y="4" width="7" height="7" rx="1.6"/><rect x="13" y="4" width="7" height="7" rx="1.6"/><rect x="4" y="13" width="7" height="7" rx="1.6"/><rect x="13" y="13" width="7" height="7" rx="1.6"/>',
  store: '<path d="M5 9.5 6 5h12l1 4.5M5 9.5h14M5 9.5v9.5h14V9.5M5 9.5a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0"/>',
  spark: '<path d="M12 3c.7 4.6 1.4 5.3 6 6-4.6.7-5.3 1.4-6 6-.7-4.6-1.4-5.3-6-6 4.6-.7 5.3-1.4 6-6Z"/>',
  sun: '<circle cx="12" cy="12" r="4.3"/><path d="M12 3v2.4M12 18.6V21M3 12h2.4M18.6 12H21M5.6 5.6l1.7 1.7M16.7 16.7l1.7 1.7M18.4 5.6l-1.7 1.7M7.3 16.7l-1.7 1.7"/>',
  mail: '<rect x="3.5" y="5.5" width="17" height="13" rx="2.2"/><path d="m4 7 8 6 8-6"/>',
  lock: '<rect x="5" y="10.5" width="14" height="9.5" rx="2.2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
  insta: '<rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.6"/><circle cx="17" cy="7" r="1.1" fill="currentColor" stroke="none"/>',
  shield: '<path d="M12 3 19 6v5c0 5-3.2 8-7 10-3.8-2-7-5-7-10V6l7-3Z"/>',
};
function ic(name, cls = "h-6 w-6", fill = false) {
  const f = fill ? 'fill="currentColor" stroke="none"' : 'fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"';
  return `<svg class="${cls}" viewBox="0 0 24 24" ${f}>${ICON[name] || ""}</svg>`;
}
function sunMark(cls) {
  return `<span class="grid shrink-0 place-items-center overflow-hidden rounded-full bg-white shadow-soft ${cls}"><img src="brand/mascot.png" alt="Sunnyway" class="h-[82%] w-[82%] object-contain"></span>`;
}

// ---------- コスメのイラスト ----------
const ART = {
  serum: '<rect x="23" y="33" width="18" height="34" rx="7"/><path d="M28 33v-5h8v5"/><rect x="29" y="15" width="6" height="9" rx="2"/><path d="M32 24v5"/><path d="M27 47h10"/>',
  jar: '<rect x="18" y="39" width="28" height="25" rx="10"/><rect x="23" y="27" width="18" height="12" rx="5"/><path d="M26 50h12"/>',
  lipstick: '<rect x="25" y="41" width="14" height="25" rx="4"/><path d="M27 41v-7h10v7"/><path d="M28.5 34l3.5-9 3.5 9"/>',
  tube: '<path d="M27 25h10v5l-1.6 35a3 3 0 0 1-3 2.8h-.8a3 3 0 0 1-3-2.8L27 30v-5Z"/><rect x="29" y="19" width="6" height="6" rx="2"/>',
};
function artTile(p, hClass) {
  if (p.image) {
    return `<div class="relative ${hClass} w-full overflow-hidden"><img src="${p.image}" alt="" loading="lazy" decoding="async" class="h-full w-full object-cover"></div>`;
  }
  return `<div class="relative ${hClass} w-full overflow-hidden" style="background:${p.tint}">
    <div class="absolute right-3 top-3 h-10 w-10 rounded-full bg-white/35"></div>
    <div class="absolute inset-0 grid place-items-center text-ink/55"><svg class="h-24 w-24" viewBox="0 0 64 80" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linejoin="round" stroke-linecap="round">${ART[p.art] || ""}</svg></div></div>`;
}

// ---------- 整形・ラベル ----------
const fmt = (n) => (n ?? 0).toLocaleString("ja-JP");
const yen = (n) => "¥" + fmt(n);
const REWARD = { GIFTING: "ギフティング", PAID: "金銭報酬", BOTH: "現物＋報酬", OTHER: "特別報酬" };
const CSTATUS = { DRAFT: "下書き", OPEN: "募集中", CLOSED: "締切", COMPLETED: "完了" };
const ASTATUS = { APPLIED: "応募済み", APPROVED: "やること", SUBMITTED: "チェック中", COMPLETED: "完了", REJECTED: "見送り" };
const BILLING = { MONTHLY: "月額・掲載料", PER_CAMPAIGN: "キャンペーン課金", PERFORMANCE: "成果連動", SALES_COMMISSION: "販売手数料" };
const PLATFORM = { INSTAGRAM: "Instagram", TIKTOK: "TikTok", YOUTUBE: "YouTube", X: "X" };
const ASTYLE = { APPLIED: "bg-ink/5 text-ink/60", APPROVED: "bg-emerald-50 text-emerald-700", SUBMITTED: "bg-amber-50 text-amber-700", COMPLETED: "bg-sunny-50 text-sunny-700", REJECTED: "bg-rose-50 text-rose-500" };
const CSTYLE = { OPEN: "bg-emerald-50 text-emerald-700", DRAFT: "bg-ink/5 text-ink/60", CLOSED: "bg-rose-50 text-rose-500", COMPLETED: "bg-sunny-50 text-sunny-700" };
const pill = (label, cls) => `<span class="badge ${cls}">${label}</span>`;

// ---------- データ（デモ） ----------
const S = {
  brands: [
    { id: "b-lum", name: "Lumière", contactName: "佐藤 美咲", contactEmail: "miyabi@lumiere.test", monthlyFeeYen: 50000, notes: "新スキンケアライン" },
    { id: "b-blo", name: "Blossom Tokyo", contactName: "田中 玲奈", contactEmail: "rena@blossom.test", monthlyFeeYen: 0, notes: "メイクアップ中心" },
  ],
  products: [
    { id: "p-serum", brandId: "b-lum", name: "グロウ セラム C", category: "スキンケア", price: 4800, art: "serum", image: "products/serum.jpg", tint: "linear-gradient(135deg,#FDEFE7,#FBE6EC)" },
    { id: "p-cream", brandId: "b-lum", name: "モイスト クリーム", category: "スキンケア", price: 3600, art: "jar", image: "products/cream.jpg", tint: "linear-gradient(135deg,#F4EFE6,#FBEFD9)" },
    { id: "p-lip", brandId: "b-blo", name: "ベルベット リップ 03", category: "メイクアップ", price: 2200, art: "lipstick", image: "products/lip.jpg", tint: "linear-gradient(135deg,#FBE6EC,#F6DCEA)" },
  ],
  campaigns: [
    { id: "c1", brandId: "b-lum", productId: "p-serum", title: "グロウ セラム C を2週間レビュー", brief: "使用感とテクスチャーを率直に。ストーリーズ1回＋フィード1投稿。", status: "OPEN", target: 30, applied: 42, deadline: "6/30", media: "Instagram Feed", tags: ["顔出し不要"], rewardType: "GIFTING", rewardYen: 0, billing: ["MONTHLY", "PERFORMANCE"], fee: 0, commission: 0 },
    { id: "c2", brandId: "b-blo", productId: "p-lip", title: "新色リップ 03 リール投稿", brief: "スウォッチ＋着用カットをリールで。", status: "OPEN", target: 15, applied: 20, deadline: "6/20", media: "Instagram Reels", tags: ["顔出しあり"], rewardType: "BOTH", rewardYen: 5000, billing: ["PER_CAMPAIGN", "SALES_COMMISSION"], fee: 120000, commission: 10 },
    { id: "c3", brandId: "b-lum", productId: "p-cream", title: "モイスト クリーム 保湿チャレンジ", brief: "夜のケアに2週間。翌朝の肌を投稿。", status: "OPEN", target: 20, applied: 33, deadline: "7/10", media: "Instagram Feed", tags: ["顔出し不要"], rewardType: "GIFTING", rewardYen: 0, billing: ["MONTHLY"], fee: 0, commission: 0 },
    { id: "c4", brandId: "b-blo", productId: "p-lip", title: "発売イベント 招待 ＋ 商品", brief: "発売イベントへご招待。来場レポートを投稿。", status: "OPEN", target: 8, applied: 11, deadline: "6/15", media: "TikTok", tags: ["来場必須"], rewardType: "OTHER", rewardYen: 0, billing: ["PER_CAMPAIGN"], fee: 80000, commission: 0, rewardNote: "イベント招待＋商品一式" },
  ],
  influencers: [
    { id: "inf-aoi", name: "あゆむ", handle: "aoi_beauty", platform: "INSTAGRAM", followers: 28000, verified: true, bio: "コスメと美容が好き。", address: "東京都渋谷区…", bank: "みずほ銀行 渋谷支店 普通 1234567", igLinked: true, ttLinked: false, notify: false },
    { id: "inf-mei", name: "めい", handle: "mei_cosme", platform: "TIKTOK", followers: 51000, verified: false, bio: "", address: "", bank: "", igLinked: false, ttLinked: true, notify: true },
    { id: "inf-rina", name: "りな", handle: "rina_skin", platform: "INSTAGRAM", followers: 9800, verified: false, bio: "敏感肌レビュー", address: "", bank: "", igLinked: true, ttLinked: false, notify: false },
  ],
  applications: [
    { id: "a1", campaignId: "c1", influencerId: "inf-aoi", status: "COMPLETED", message: "ビタミンC系が好きです", postUrl: "https://www.instagram.com/p/demo-aoi", postReach: 18400 },
    { id: "a2", campaignId: "c1", influencerId: "inf-mei", status: "APPROVED", message: "ショート動画で紹介したい", postUrl: "", postReach: 0 },
    { id: "a3", campaignId: "c1", influencerId: "inf-rina", status: "APPLIED", message: "敏感肌レビュー得意です", postUrl: "", postReach: 0 },
    { id: "a4", campaignId: "c2", influencerId: "inf-aoi", status: "APPROVED", message: "", postUrl: "", postReach: 0 },
    { id: "a5", campaignId: "c2", influencerId: "inf-rina", status: "SUBMITTED", message: "", postUrl: "https://www.instagram.com/p/demo-rina", postReach: 7200 },
  ],
  favorites: { "inf-aoi": ["c2"] },
  transactions: [{ id: "t1", influencerId: "inf-aoi", campaignId: "c2", amountYen: 5000, date: "5/20", status: "振込済み" }],
  inbox: [{ from: "staff", text: "Sunnyway へようこそ。ご不明な点はお気軽にどうぞ。", time: "6/01 10:00" }],
  audit: [
    { actor: "運営", action: "campaign.create", when: "6/08 10:20" },
    { actor: "運営", action: "application.decide", when: "6/08 11:05" },
    { actor: "運営", action: "payout.complete", when: "6/08 12:30" },
  ],
};

let _seq = 100;
const uid = (p) => p + ++_seq;
const brand = (id) => S.brands.find((b) => b.id === id);
const product = (id) => S.products.find((p) => p.id === id);
const campaign = (id) => S.campaigns.find((c) => c.id === id);
const influencer = (id) => S.influencers.find((i) => i.id === id);
const appsOf = (cid) => S.applications.filter((a) => a.campaignId === cid);
const appsByInf = (iid) => S.applications.filter((a) => a.influencerId === iid);
const isPosted = (a) => a.status === "SUBMITTED" || a.status === "COMPLETED";
const postedApps = (cid) => appsOf(cid).filter(isPosted);
const reachOf = (cid) => postedApps(cid).reduce((s, a) => s + a.postReach, 0);
const favsOf = (iid) => S.favorites[iid] || (S.favorites[iid] = []);
function pushAudit(action) {
  const d = new Date();
  S.audit.unshift({ actor: "運営", action, when: `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}` });
}
function completeApp(a) {
  a.status = "COMPLETED";
  const c = campaign(a.campaignId);
  if ((c.rewardType === "PAID" || c.rewardType === "BOTH") && c.rewardYen > 0 && !S.transactions.some((t) => t.campaignId === a.campaignId && t.influencerId === a.influencerId)) {
    const d = new Date();
    S.transactions.unshift({ id: uid("t"), influencerId: a.influencerId, campaignId: a.campaignId, amountYen: c.rewardYen, date: `${d.getMonth() + 1}/${d.getDate()}`, status: "振込済み" });
    pushAudit("payout.complete");
  } else pushAudit("application.complete");
}

// ---------- トースト ----------
function toast(msg) {
  let el = document.getElementById("toast");
  if (!el) { el = document.createElement("div"); el.id = "toast"; el.className = "pointer-events-none fixed left-1/2 bottom-24 z-50 -translate-x-1/2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white opacity-0 shadow-card transition"; document.body.appendChild(el); }
  el.textContent = msg; el.style.opacity = "1"; clearTimeout(el._t); el._t = setTimeout(() => (el.style.opacity = "0"), 1900);
}
const val = (id, d) => { const el = document.getElementById(id); return el ? el.value : d; };
