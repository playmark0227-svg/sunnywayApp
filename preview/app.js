/* ============================================================
   Sunnyway — エディトリアルな高級コスメ・プラットフォーム（デモ）
   情報設計/ロジックは維持し、ビジュアルを全面リデザイン。
   ============================================================ */

// ---------- アイコン（インライン SVG・人手で揃えたラインアイコン） ----------
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
  arrowswap: '<path d="M7 7h11l-3-3M17 17H6l3 3"/>',
  logout: '<path d="M14 5h4.5v14H14"/><path d="M10 12h8M14.5 8.5 18 12l-3.5 3.5"/>',
  grid: '<rect x="4" y="4" width="7" height="7" rx="1.6"/><rect x="13" y="4" width="7" height="7" rx="1.6"/><rect x="4" y="13" width="7" height="7" rx="1.6"/><rect x="13" y="13" width="7" height="7" rx="1.6"/>',
  store: '<path d="M5 9.5 6 5h12l1 4.5M5 9.5h14M5 9.5v9.5h14V9.5M5 9.5a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0"/>',
  spark: '<path d="M12 3c.7 4.6 1.4 5.3 6 6-4.6.7-5.3 1.4-6 6-.7-4.6-1.4-5.3-6-6 4.6-.7 5.3-1.4 6-6Z"/>',
  sun: '<circle cx="12" cy="12" r="4.3"/><path d="M12 3v2.4M12 18.6V21M3 12h2.4M18.6 12H21M5.6 5.6l1.7 1.7M16.7 16.7l1.7 1.7M18.4 5.6l-1.7 1.7M7.3 16.7l-1.7 1.7"/>',
  star: '<path d="M12 4l2.3 4.9 5.2.6-3.9 3.6 1.1 5.2L12 16.3 7.2 18.9l1.1-5.2L4.4 10l5.2-.6L12 4Z"/>',
};
function ic(name, cls = "h-6 w-6", fill = false) {
  const f = fill ? `fill="currentColor" stroke="none"` : `fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"`;
  return `<svg class="${cls}" viewBox="0 0 24 24" ${f}>${ICON[name] || ""}</svg>`;
}

// ---------- コスメのラインイラスト ----------
const ART = {
  serum: '<rect x="23" y="33" width="18" height="34" rx="7"/><path d="M28 33v-5h8v5"/><rect x="29" y="15" width="6" height="9" rx="2"/><path d="M32 24v5"/><path d="M27 47h10"/>',
  jar: '<rect x="18" y="39" width="28" height="25" rx="10"/><rect x="23" y="27" width="18" height="12" rx="5"/><path d="M26 50h12"/>',
  lipstick: '<rect x="25" y="41" width="14" height="25" rx="4"/><path d="M27 41v-7h10v7"/><path d="M28.5 34l3.5-9 3.5 9"/>',
  tube: '<path d="M27 25h10v5l-1.6 35a3 3 0 0 1-3 2.8h-.8a3 3 0 0 1-3-2.8L27 30v-5Z"/><rect x="29" y="19" width="6" height="6" rx="2"/>',
};
function artTile(p, hClass) {
  return `<div class="relative ${hClass} w-full overflow-hidden" style="background:${p.tint}">
    <div class="absolute right-3 top-3 h-10 w-10 rounded-full bg-white/35"></div>
    <div class="absolute inset-0 grid place-items-center text-ink/55">
      <svg class="h-24 w-24" viewBox="0 0 64 80" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linejoin="round" stroke-linecap="round">${ART[p.art] || ""}</svg>
    </div></div>`;
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

// ---------- デモ状態 ----------
const state = {
  me: "inf-aoi",
  brands: [
    { id: "b-lum", name: "Lumière", contactName: "佐藤 美咲", contactEmail: "miyabi@lumiere.test", monthlyFeeYen: 50000, notes: "新スキンケアライン" },
    { id: "b-blo", name: "Blossom Tokyo", contactName: "田中 玲奈", contactEmail: "rena@blossom.test", monthlyFeeYen: 0, notes: "メイクアップ中心" },
  ],
  products: [
    { id: "p-serum", brandId: "b-lum", name: "グロウ セラム C", category: "スキンケア", price: 4800, art: "serum", tint: "linear-gradient(135deg,#FDEFE7,#FBE6EC)" },
    { id: "p-cream", brandId: "b-lum", name: "モイスト クリーム", category: "スキンケア", price: 3600, art: "jar", tint: "linear-gradient(135deg,#F4EFE6,#FBEFD9)" },
    { id: "p-lip", brandId: "b-blo", name: "ベルベット リップ 03", category: "メイクアップ", price: 2200, art: "lipstick", tint: "linear-gradient(135deg,#FBE6EC,#F6DCEA)" },
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

let seq = 100;
const uid = (p) => p + ++seq;
const brand = (id) => state.brands.find((b) => b.id === id);
const product = (id) => state.products.find((p) => p.id === id);
const campaign = (id) => state.campaigns.find((c) => c.id === id);
const influencer = (id) => state.influencers.find((i) => i.id === id);
const appsOf = (cid) => state.applications.filter((a) => a.campaignId === cid);
const myApps = () => state.applications.filter((a) => a.influencerId === state.me);
const isPosted = (a) => a.status === "SUBMITTED" || a.status === "COMPLETED";
const postedApps = (cid) => appsOf(cid).filter(isPosted);
const reachOf = (cid) => postedApps(cid).reduce((s, a) => s + a.postReach, 0);
const myFavs = () => state.favorites[state.me] || (state.favorites[state.me] = []);
function pushAudit(action) {
  const d = new Date();
  state.audit.unshift({ actor: "運営", action, when: `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}` });
}

// ---------- ルーター ----------
const root = document.getElementById("root");
const go = (hash) => { location.hash = hash; };
function render() {
  const h = location.hash || "#/";
  window.scrollTo(0, 0);
  if (h.startsWith("#/app")) return renderInfluencer(h);
  if (h.startsWith("#/admin")) return renderAdmin(h);
  return renderLanding();
}
window.addEventListener("hashchange", render);

// ============================================================
// ランディング（エディトリアル）
// ============================================================
function renderLanding() {
  root.innerHTML = `
  <main class="fade">
    <div class="relative overflow-hidden">
      <div class="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-sunrise opacity-20 blur-3xl"></div>
      <div class="pointer-events-none absolute -left-20 top-40 h-72 w-72 rounded-full bg-sunrise-soft opacity-70 blur-3xl"></div>
      <header class="relative mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <div class="flex items-center gap-2 text-ink">${sunMark("h-7 w-7")}<span class="display text-lg font-semibold">Sunnyway</span></div>
        <button class="text-sm font-medium text-ink/60 hover:text-ink" data-act="nav" data-href="#/admin">運営ログイン</button>
      </header>
      <section class="relative mx-auto max-w-5xl px-6 pb-16 pt-8 sm:pt-16">
        <p class="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-4 py-1.5 text-xs font-medium text-ink/70">${ic("spark", "h-4 w-4 text-sunny-500", true)} コスメ × インフルエンサー</p>
        <h1 class="display max-w-3xl text-4xl font-semibold leading-[1.3] text-ink sm:text-6xl sm:leading-[1.25]">掲載するほど、<br><span class="bg-sunrise bg-clip-text text-transparent">誰かの「好き」</span>に届く。</h1>
        <p class="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">ブランドの商品を、ぴったりのインフルエンサーへ。応募から投稿、成果レポート、報酬の振込まで、すべてをひとつに。</p>
        <div class="mt-9 flex flex-col gap-3 sm:flex-row">
          <button class="btn-primary px-7 py-3.5 text-base" data-act="nav" data-href="#/app">アプリを開く ${ic("chevron", "h-4 w-4")}</button>
          <button class="btn-ghost px-7 py-3.5 text-base" data-act="nav" data-href="#/admin">運営ダッシュボード</button>
        </div>
      </section>
    </div>

    <section class="mx-auto max-w-5xl px-6 py-12">
      <div class="grid gap-4 sm:grid-cols-3">
        ${roleCard("sun", "Sunnyway", "掲載を代理作成し、インフルを束ね、成果と報酬を管理。", "運営")}
        ${roleCard("store", "ブランド", "商品を預けるだけ。管理は運営が代行。", "顧客")}
        ${roleCard("spark", "インフルエンサー", "好きな案件に応募して投稿、報酬を受け取る。", "クリエイター")}
      </div>
    </section>

    <section class="mx-auto max-w-5xl px-6 pb-20">
      <div class="overflow-hidden rounded-3xl bg-ink p-8 text-center text-white sm:p-14">
        <p class="display text-2xl leading-relaxed sm:text-3xl">「ここに掲載すれば、<br class="sm:hidden">何人もが取り上げる」を、数字で。</p>
        <p class="mx-auto mt-4 max-w-md text-sm text-white/60">取り上げ人数・リーチ・報酬まで、運営ダッシュボードでひと目に。</p>
      </div>
    </section>
    <footer class="border-t border-line py-8 text-center text-xs text-muted">© ${new Date().getFullYear()} Sunnyway ・ デモ</footer>
  </main>`;
}
function sunMark(cls) {
  return `<span class="grid place-items-center rounded-full bg-sunrise text-white ${cls}" style="padding:4px">${ic("sun", "h-full w-full", false)}</span>`;
}
function roleCard(icon, title, desc, tag) {
  return `<div class="card p-6"><div class="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-sunny-50 text-sunny-600">${ic(icon, "h-6 w-6", icon === "spark")}</div>
    <div class="flex items-center gap-2"><h3 class="display text-lg font-semibold text-ink">${title}</h3><span class="badge bg-ink/5 text-ink/50">${tag}</span></div>
    <p class="mt-2 text-sm leading-relaxed text-muted">${desc}</p></div>`;
}

// ============================================================
// インフルアプリ（全画面）
// ============================================================
function appShell(active, header, body) {
  return `<div class="fade flex min-h-[100dvh] flex-col">
    ${header}
    <main class="flex-1 overflow-y-auto"><div class="mx-auto max-w-md">${body}</div></main>
    <nav class="sticky bottom-0 z-20 flex border-t border-line bg-surface/85 backdrop-blur-xl" style="padding-bottom:env(safe-area-inset-bottom)">
      ${navItem("#/app", "search", "さがす", active === "search")}
      ${navItem("#/app/manage", "bag", "案件管理", active === "manage")}
      ${navItem("#/app/inbox", "chat", "メッセージ", active === "inbox")}
      ${navItem("#/app/me", "user", "マイ", active === "me")}
    </nav></div>`;
}
function navItem(href, icon, label, active) {
  return `<button data-act="nav" data-href="${href}" class="flex flex-1 flex-col items-center gap-1 py-2.5 ${active ? "text-sunny-600" : "text-muted"}">${ic(icon, "h-6 w-6", false)}<span class="text-[10px] font-medium tracking-wide">${label}</span></button>`;
}
function appHeader(title, right) {
  return `<header class="sticky top-0 z-20 flex items-center justify-between bg-canvas/80 px-5 pb-3 backdrop-blur-xl" style="padding-top:max(0.9rem,env(safe-area-inset-top))"><h1 class="display text-xl font-semibold text-ink">${title}</h1><div class="flex items-center gap-1">${right || ""}</div></header>`;
}
function iconBtn(icon, act, attrs = "") {
  return `<button class="grid h-10 w-10 place-items-center rounded-full text-ink/65 hover:bg-ink/5" data-act="${act}" ${attrs}>${ic(icon, "h-5 w-5")}</button>`;
}

let mgTab = "todo";
function renderInfluencer(h) {
  if (h.startsWith("#/app/manage")) return void (root.innerHTML = appShell("manage", appHeader("案件管理", `<button class="rounded-full px-3 py-2 text-sm font-medium text-sunny-600 hover:bg-sunny-50" data-act="nav" data-href="#/app/history">応募履歴</button>`), viewManage()));
  if (h.startsWith("#/app/history")) return void (root.innerHTML = appShell("manage", subHeader("応募履歴", "#/app/manage"), viewHistory()));
  if (h.startsWith("#/app/inbox")) return void (root.innerHTML = appShell("inbox", appHeader("メッセージ"), viewInbox()));
  if (h.startsWith("#/app/me/")) return void (root.innerHTML = appShell("me", subHeader(meSubTitle(h), "#/app/me"), viewMeSub(h)));
  if (h.startsWith("#/app/me")) return void (root.innerHTML = appShell("me", appHeader("マイページ"), viewMe()));
  root.innerHTML = appShell("search", appHeader("さがす", iconBtn("bell", "nav", `data-href="#/app/inbox"`)), viewSearch());
}
function subHeader(title, back) {
  return `<header class="sticky top-0 z-20 flex items-center gap-2 bg-canvas/80 px-3 pb-3 backdrop-blur-xl" style="padding-top:max(0.9rem,env(safe-area-inset-top))">${iconBtn("back", "nav", `data-href="${back}"`)}<h1 class="display text-lg font-semibold text-ink">${title}</h1></header>`;
}

// ---- さがす ----
let searchFilter = "すべて";
function viewSearch() {
  const cats = ["すべて", "スキンケア", "メイクアップ", "顔出し不要", "報酬あり"];
  const open = state.campaigns.filter((c) => c.status === "OPEN");
  const match = (c) => searchFilter === "すべて" ? true : searchFilter === "顔出し不要" ? c.tags.includes("顔出し不要") : searchFilter === "報酬あり" ? (c.rewardType === "PAID" || c.rewardType === "BOTH") : product(c.productId).category === searchFilter;
  const list = open.filter(match);
  const medias = [...new Set(list.map((c) => c.media))];
  const groups = medias.map((m) => `
    <section class="mt-7">
      <div class="mb-3 flex items-baseline justify-between px-5"><h2 class="display text-base font-semibold text-ink">${m}</h2><span class="text-xs text-muted">${list.filter((c) => c.media === m).length}件</span></div>
      <div class="flex snap-x gap-4 overflow-x-auto px-5 pb-2">${list.filter((c) => c.media === m).map(searchCard).join("")}</div>
    </section>`).join("");
  return `
    <div class="px-5 pt-1">
      <div class="relative overflow-hidden rounded-3xl bg-sunrise p-6 text-white shadow-lift">
        <div class="absolute -right-6 -top-8 opacity-30">${ic("spark", "h-28 w-28", true)}</div>
        <p class="text-xs font-semibold uppercase tracking-widest text-white/80">Monthly Award</p>
        <p class="display mt-1 text-2xl font-semibold leading-snug">今月のベスト投稿に<br>最大 ¥50,000</p>
        <div class="mt-4 flex gap-1.5">${[0, 1, 2].map((i) => `<span class="h-1.5 rounded-full ${i === 0 ? "w-6 bg-white" : "w-1.5 bg-white/50"}"></span>`).join("")}</div>
      </div>
    </div>
    <div class="mt-4 flex gap-2 overflow-x-auto px-5 pb-1">
      ${cats.map((c) => `<button data-act="filter" data-cat="${c}" class="chip whitespace-nowrap ${searchFilter === c ? "bg-ink text-white" : "border border-line bg-surface text-ink/70"}">${c}</button>`).join("")}
    </div>
    ${list.length ? groups : `<p class="px-5 py-20 text-center text-sm text-muted">条件に合う案件がありません</p>`}
    <div class="h-6"></div>`;
}
function searchCard(c) {
  const p = product(c.productId), b = brand(c.brandId);
  const applied = c.applied + appsOf(c.id).length;
  const fav = myFavs().includes(c.id);
  const already = myApps().some((a) => a.campaignId === c.id);
  const rewardTxt = (c.rewardType === "PAID" || c.rewardType === "BOTH") && c.rewardYen > 0 ? yen(c.rewardYen) : c.rewardType === "OTHER" ? "特別報酬" : "ギフティング";
  return `<article class="w-[15.5rem] shrink-0 snap-start overflow-hidden rounded-3xl border border-line bg-surface shadow-soft transition hover:-translate-y-0.5 hover:shadow-card">
    <div class="relative">
      <button class="block w-full" data-act="open-campaign" data-id="${c.id}">${artTile(p, "h-44")}</button>
      ${c.tags[0] ? `<span class="absolute left-3 top-3 badge bg-white/90 text-ink/80 backdrop-blur">${c.tags[0]}</span>` : ""}
      <button class="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/85 backdrop-blur transition active:scale-90 ${fav ? "text-sunny-500" : "text-ink/40"}" data-act="fav" data-id="${c.id}">${ic("heart", "h-5 w-5", fav)}</button>
    </div>
    <div class="p-4">
      <p class="text-[11px] font-semibold uppercase tracking-wider text-muted">${b.name}</p>
      <h3 class="mt-1 line-clamp-2 text-[15px] font-semibold leading-snug text-ink">${c.title}</h3>
      <div class="mt-3 flex items-center gap-1.5 text-sunny-600">${ic("spark", "h-4 w-4", true)}<span class="text-sm font-bold">${rewardTxt}</span></div>
      <div class="mt-3 flex items-center justify-between border-t border-line pt-3 text-xs text-muted">
        <span>応募 <b class="text-ink">${applied}</b>/${c.target}名</span><span>〆 ${c.deadline}</span>
      </div>
      <button class="${already ? "btn-ghost pointer-events-none opacity-60" : "btn-primary"} mt-3 w-full py-2.5 text-sm" data-act="apply" data-id="${c.id}">${already ? "応募済み" : "応募する"}</button>
    </div></article>`;
}

// ---- 案件管理 ----
function viewManage() {
  const tabs = [["todo", "やること"], ["review", "チェック中"], ["done", "完了"]];
  const apps = myApps();
  const buckets = { todo: apps.filter((a) => a.status === "APPROVED"), review: apps.filter((a) => a.status === "SUBMITTED"), done: apps.filter((a) => a.status === "COMPLETED") };
  const cur = buckets[mgTab];
  const body = cur.length ? cur.map((a) => manageCard(a, mgTab)).join("") : emptyState(mgTab === "todo" ? "やることはありません" : mgTab === "review" ? "確認待ちの案件はありません" : "完了した案件はありません");
  return `
    <div class="px-5 pt-1"><div class="flex rounded-full bg-ink/5 p-1">
      ${tabs.map(([k, label]) => `<button data-act="mgtab" data-tab="${k}" class="flex-1 rounded-full py-2 text-sm font-semibold transition ${mgTab === k ? "bg-surface text-ink shadow-soft" : "text-ink/50"}">${label}${buckets[k].length ? ` ${buckets[k].length}` : ""}</button>`).join("")}
    </div></div>
    <div class="space-y-3 p-5">${body}</div>`;
}
function manageCard(a, tab) {
  const c = campaign(a.campaignId), p = product(c.productId), b = brand(c.brandId);
  let action = "";
  if (tab === "todo") action = `<div class="mt-4 space-y-2 border-t border-line pt-4"><p class="text-xs font-semibold text-muted">投稿 URL を提出</p>
      <input class="input" id="url-${a.id}" placeholder="https://www.instagram.com/p/…" value="${a.postUrl}">
      <input class="input" id="reach-${a.id}" type="number" min="0" placeholder="リーチ / 表示回数" value="${a.postReach || ""}">
      <button class="btn-primary w-full" data-act="submit" data-id="${a.id}">提出する</button></div>`;
  else if (tab === "review") action = `<div class="mt-4 flex items-center gap-2 border-t border-line pt-4 text-xs text-muted">${ic("check", "h-4 w-4 text-amber-500")}運営が確認中・リーチ ${fmt(a.postReach)}<button class="ml-auto font-semibold text-sunny-600" data-act="sim-confirm" data-id="${a.id}">確認を進める</button></div>`;
  else { const tx = state.transactions.find((t) => t.campaignId === a.campaignId && t.influencerId === a.influencerId); action = `<div class="mt-4 flex items-center gap-2 border-t border-line pt-4 text-xs text-ink/70">${ic("check", "h-4 w-4 text-sunny-500")}完了・リーチ ${fmt(a.postReach)}${tx ? ` ・ 報酬 ${yen(tx.amountYen)}` : c.rewardType === "GIFTING" ? " ・ 現物提供" : ""}</div>`; }
  return `<div class="card overflow-hidden p-4"><div class="flex gap-3">
      <div class="h-16 w-16 shrink-0 overflow-hidden rounded-2xl">${artTile(p, "h-16")}</div>
      <div class="min-w-0 flex-1"><div class="flex items-start justify-between gap-2"><p class="truncate font-semibold text-ink">${c.title}</p>${pill(ASTATUS[a.status], ASTYLE[a.status])}</div>
      <p class="mt-0.5 truncate text-xs text-muted">${b.name} ・ ${REWARD[c.rewardType]}</p></div>
    </div>${action}</div>`;
}
function emptyState(msg) {
  return `<div class="flex flex-col items-center justify-center gap-4 py-20 text-center"><div class="grid h-16 w-16 place-items-center rounded-full bg-sunny-50 text-sunny-300">${ic("bag", "h-8 w-8")}</div><p class="text-sm text-muted">${msg}</p><button class="btn-soft" data-act="nav" data-href="#/app">案件をさがす</button></div>`;
}
function viewHistory() {
  const apps = myApps();
  if (!apps.length) return emptyState("応募履歴はありません");
  return `<div class="space-y-2 p-5">${apps.map((a) => { const c = campaign(a.campaignId); return `<div class="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3"><div class="h-12 w-12 shrink-0 overflow-hidden rounded-xl">${artTile(product(c.productId), "h-12")}</div><div class="min-w-0 flex-1"><p class="truncate text-sm font-semibold text-ink">${c.title}</p><p class="truncate text-xs text-muted">${brand(c.brandId).name}</p></div>${pill(ASTATUS[a.status], ASTYLE[a.status])}</div>`; }).join("")}</div>`;
}

// ---- メッセージ ----
function viewInbox() {
  const msgs = state.inbox.map((m) => m.from === "me"
    ? `<div class="flex justify-end"><div class="max-w-[78%] rounded-2xl rounded-br-md bg-sunny-500 px-4 py-2.5 text-sm leading-relaxed text-white shadow-soft">${m.text}</div></div>`
    : `<div class="flex items-end gap-2">${sunMark("h-7 w-7")}<div class="max-w-[78%] rounded-2xl rounded-bl-md border border-line bg-surface px-4 py-2.5 text-sm leading-relaxed text-ink">${m.text}</div></div>`).join("");
  return `<div class="flex h-[calc(100dvh-7.5rem)] flex-col">
    <div class="flex items-center gap-2 border-b border-line px-5 py-2.5 text-sm font-semibold text-ink">${sunMark("h-6 w-6")} Sunnyway 公式</div>
    <div class="flex-1 space-y-4 overflow-y-auto px-5 py-5">${msgs}</div>
    <div class="flex items-center gap-2 border-t border-line bg-surface p-3" style="padding-bottom:max(0.75rem,env(safe-area-inset-bottom))">
      <input class="input flex-1 rounded-full" id="chat-input" placeholder="メッセージを入力…">
      <button class="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-sunny-500 text-white shadow-lift active:scale-95" data-act="send-msg">${ic("send", "h-5 w-5")}</button>
    </div></div>`;
}

// ---- マイページ ----
function viewMe() {
  const me = influencer(state.me);
  const items = [["profile", "edit", "プロフィール"], ["address", "pin", "住所"], ["sns", "link", "SNS連携"], ["bank", "card", "振込先"], ["transactions", "receipt", "取引履歴"], ["notify", "bellgear", "通知"]];
  return `
    <div class="relative mb-2 overflow-hidden px-5 pb-6 pt-2">
      <div class="flex items-center gap-4">
        <div class="grid h-16 w-16 place-items-center rounded-full bg-sunrise p-0.5"><div class="grid h-full w-full place-items-center rounded-full bg-canvas text-sunny-500">${ic("spark", "h-7 w-7", true)}</div></div>
        <div><div class="flex items-center gap-1.5"><p class="display text-xl font-semibold text-ink">${me.name}</p>${me.verified ? ic("check", "h-4 w-4 text-sunny-500") : ""}</div><p class="text-sm text-muted">@${me.handle} ・ ${fmt(me.followers)} フォロワー</p></div>
      </div>
    </div>
    <div class="grid grid-cols-3 gap-3 px-5">
      ${meStat("応募", myApps().length)}${meStat("取り上げ", myApps().filter(isPosted).length)}${meStat("報酬", yen(state.transactions.filter((t) => t.influencerId === state.me).reduce((s, t) => s + t.amountYen, 0)))}
    </div>
    <p class="px-5 pb-2 pt-7 text-xs font-semibold uppercase tracking-wider text-muted">アカウント</p>
    <div class="mx-5 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
      ${items.map(([k, icon, label]) => `<button data-act="nav" data-href="#/app/me/${k}" class="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-canvas"><span class="grid h-9 w-9 place-items-center rounded-xl bg-sunny-50 text-sunny-600">${ic(icon, "h-5 w-5", false)}</span><span class="flex-1 text-sm font-medium text-ink">${label}</span>${k === "notify" && !me.notify ? `<span class="text-xs text-sunny-600">ONにしよう</span>` : ""}<span class="text-ink/25">${ic("chevron", "h-4 w-4")}</span></button>`).join("")}
    </div>
    <p class="px-5 pb-2 pt-7 text-xs font-semibold uppercase tracking-wider text-muted">サポート</p>
    <div class="mx-5 overflow-hidden rounded-2xl border border-line bg-surface">
      <button data-act="nav" data-href="#/app/inbox" class="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-canvas"><span class="grid h-9 w-9 place-items-center rounded-xl bg-sunny-50 text-sunny-600">${ic("chat", "h-5 w-5")}</span><span class="flex-1 text-sm font-medium text-ink">お問い合わせ</span><span class="text-ink/25">${ic("chevron", "h-4 w-4")}</span></button>
    </div>
    <div class="mx-5 my-7 rounded-2xl border border-dashed border-sunny-200 bg-sunny-50/50 p-4">
      <p class="mb-2 flex items-center gap-1.5 text-xs font-semibold text-sunny-700">${ic("arrowswap", "h-4 w-4")} デモ：ビューを切替</p>
      <div class="flex items-center gap-2">
        <select class="input flex-1 py-2.5" data-act="switch-influencer">${state.influencers.map((i) => `<option value="${i.id}" ${i.id === state.me ? "selected" : ""}>@${i.handle} で見る</option>`).join("")}</select>
        <button class="btn-dark shrink-0 px-4 py-2.5 text-sm" data-act="nav" data-href="#/admin">運営画面</button>
      </div>
    </div><div class="h-4"></div>`;
}
function meStat(label, value) {
  return `<div class="rounded-2xl border border-line bg-surface p-3 text-center"><div class="display text-xl font-semibold text-ink">${value}</div><div class="mt-0.5 text-[11px] text-muted">${label}</div></div>`;
}
function meSubTitle(h) { return { profile: "プロフィール", address: "住所", sns: "SNS連携", bank: "振込先", transactions: "取引履歴", notify: "通知" }[h.split("/")[3]] || "設定"; }
function viewMeSub(h) {
  const me = influencer(state.me), key = h.split("/")[3];
  const wrap = (inner) => `<div class="space-y-4 p-5">${inner}</div>`;
  if (key === "profile") return wrap(`<div><label class="label">表示名</label><input class="input" id="f-name" value="${me.name}"></div><div><label class="label">フォロワー数</label><input class="input" type="number" id="f-followers" value="${me.followers}"></div><div><label class="label">自己紹介</label><textarea class="input" id="f-bio" rows="3">${me.bio}</textarea></div><button class="btn-primary w-full" data-act="save-profile">保存する</button>`);
  if (key === "address") return wrap(`<p class="rounded-2xl bg-sunny-50 px-4 py-3 text-xs text-sunny-800">ギフティング（現物提供）の発送先に使います。</p><div><label class="label">住所</label><textarea class="input" id="f-address" rows="3" placeholder="〒 都道府県 市区町村 番地…">${me.address}</textarea></div><button class="btn-primary w-full" data-act="save-address">保存する</button>`);
  if (key === "sns") return wrap(`${snsRow("instagram", "Instagram", me.igLinked)}${snsRow("tiktok", "TikTok", me.ttLinked)}<p class="text-xs leading-relaxed text-muted">連携するとフォロワー数やリーチを自動取得します（デモ）。</p>`);
  if (key === "bank") return wrap(`<p class="rounded-2xl bg-sunny-50 px-4 py-3 text-xs text-sunny-800">金銭報酬はここへ振り込まれます。</p><div><label class="label">振込先（銀行・支店・口座）</label><textarea class="input" id="f-bank" rows="2" placeholder="例）みずほ銀行 渋谷支店 普通 1234567">${me.bank}</textarea></div><button class="btn-primary w-full" data-act="save-bank">保存する</button>`);
  if (key === "transactions") { const tx = state.transactions.filter((t) => t.influencerId === state.me); return `<div class="p-5">${tx.length ? `<div class="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">${tx.map((t) => `<div class="flex items-center justify-between px-4 py-4"><div><p class="text-sm font-semibold text-ink">${campaign(t.campaignId) ? campaign(t.campaignId).title : "案件報酬"}</p><p class="text-xs text-muted">${t.date}</p></div><div class="text-right"><p class="display text-lg font-semibold text-ink">${yen(t.amountYen)}</p>${pill(t.status, t.status === "振込済み" ? "bg-emerald-50 text-emerald-700" : "bg-ink/5 text-ink/60")}</div></div>`).join("")}</div>` : emptyState("取引履歴はまだありません")}</div>`; }
  if (key === "notify") return wrap(`<div class="flex items-center justify-between rounded-2xl border border-line bg-surface px-4 py-4"><div><p class="text-sm font-semibold text-ink">プッシュ通知</p><p class="text-xs text-muted">採用・連絡・報酬振込をお知らせ</p></div>${toggle(me.notify, "toggle-notify")}</div>`);
  return wrap("設定");
}
function snsRow(key, label, linked) { return `<div class="flex items-center justify-between rounded-2xl border border-line bg-surface px-4 py-3.5"><span class="flex items-center gap-2 text-sm font-medium text-ink">${ic("link", "h-4 w-4 text-muted")}${label}</span><button data-act="toggle-sns" data-sns="${key}" class="rounded-full px-4 py-1.5 text-xs font-semibold ${linked ? "bg-emerald-50 text-emerald-700" : "bg-sunny-500 text-white"}">${linked ? "連携済み" : "連携する"}</button></div>`; }
function toggle(on, act) { return `<button data-act="${act}" class="relative h-7 w-12 rounded-full transition ${on ? "bg-sunny-500" : "bg-ink/15"}"><span class="absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${on ? "left-[1.375rem]" : "left-0.5"}"></span></button>`; }

// ============================================================
// 運営管理（Web）
// ============================================================
const ADMIN_NAV = [["#/admin", "grid", "ダッシュボード"], ["#/admin/campaigns", "bag", "掲載"], ["#/admin/brands", "store", "ブランド"], ["#/admin/influencers", "user", "インフルエンサー"]];
function adminShell(active, body) {
  return `<div class="fade min-h-[100dvh] bg-canvas lg:flex">
    <aside class="border-b border-line bg-surface lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
      <div class="flex items-center gap-2 px-6 py-5">${sunMark("h-8 w-8")}<div><p class="display font-semibold leading-none text-ink">Sunnyway</p><p class="mt-1 text-[11px] text-muted">運営コンソール</p></div></div>
      <nav class="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col">${ADMIN_NAV.map(([href, icon, label]) => `<button data-act="nav" data-href="${href}" class="flex items-center gap-2.5 whitespace-nowrap rounded-xl px-3 py-2.5 text-left text-sm font-medium ${active === href ? "bg-sunny-50 text-sunny-700" : "text-ink/60 hover:bg-canvas"}">${ic(icon, "h-5 w-5")}${label}</button>`).join("")}</nav>
      <div class="hidden p-3 lg:block"><button class="btn-ghost w-full" data-act="nav" data-href="#/">${ic("arrowswap", "h-4 w-4")} ビュー切替</button></div>
    </aside>
    <main class="flex-1 px-6 py-8 lg:px-12 lg:py-10">${body}</main></div>`;
}
function renderAdmin(h) {
  const m = h.match(/^#\/admin\/campaigns\/(.+)$/);
  if (m) { root.innerHTML = adminShell("#/admin/campaigns", adminReport(m[1])); return; }
  let body, active = h;
  if (h.startsWith("#/admin/campaigns")) { body = adminCampaigns(); active = "#/admin/campaigns"; }
  else if (h.startsWith("#/admin/brands")) { body = adminBrands(); active = "#/admin/brands"; }
  else if (h.startsWith("#/admin/influencers")) { body = adminInfluencers(); active = "#/admin/influencers"; }
  else { body = adminDashboard(); active = "#/admin"; }
  root.innerHTML = adminShell(active, body);
}
function aHead(t, d) { return `<div class="mb-7"><h1 class="display text-3xl font-semibold text-ink">${t}</h1>${d ? `<p class="mt-1.5 text-sm text-muted">${d}</p>` : ""}</div>`; }
function aStat(label, value, sub) { return `<div class="card p-6"><div class="text-xs font-medium uppercase tracking-wider text-muted">${label}</div><div class="display mt-2 text-3xl font-semibold text-ink">${value}</div>${sub ? `<div class="mt-1 text-xs text-muted">${sub}</div>` : ""}</div>`; }
function adminDashboard() {
  const openC = state.campaigns.filter((c) => c.status === "OPEN").length;
  const postedAll = state.applications.filter(isPosted);
  const totalReach = postedAll.reduce((s, a) => s + a.postReach, 0);
  const paidOut = state.transactions.filter((t) => t.status === "振込済み").reduce((s, t) => s + t.amountYen, 0);
  const recent = state.campaigns.slice().reverse().slice(0, 5);
  return aHead("ダッシュボード", "プラットフォーム全体のサマリー") + `
    <div class="grid grid-cols-2 gap-4 lg:grid-cols-3">${aStat("ブランド", state.brands.length)}${aStat("インフルエンサー", state.influencers.length)}${aStat("募集中の掲載", openC)}${aStat("取り上げ件数", postedAll.length)}${aStat("合計リーチ", fmt(totalReach))}${aStat("報酬支払額", yen(paidOut), "振込済みの総額")}</div>
    <div class="mt-8 grid gap-6 lg:grid-cols-2">
      <section class="card p-6"><div class="mb-4 flex items-center justify-between"><h2 class="display font-semibold text-ink">最近の掲載</h2><button class="text-sm font-medium text-sunny-600" data-act="nav" data-href="#/admin/campaigns">すべて</button></div><div class="space-y-1">${recent.map((c) => `<button class="flex w-full items-center gap-3 rounded-2xl p-2 text-left hover:bg-canvas" data-act="nav" data-href="#/admin/campaigns/${c.id}"><div class="h-12 w-12 shrink-0 overflow-hidden rounded-xl">${artTile(product(c.productId), "h-12")}</div><div class="min-w-0 flex-1"><p class="truncate text-sm font-semibold text-ink">${c.title}</p><p class="truncate text-xs text-muted">${brand(c.brandId).name}</p></div><span class="text-sm font-semibold text-sunny-600">${postedApps(c.id).length}/${c.target}</span></button>`).join("")}</div></section>
      <section class="card p-6"><h2 class="display mb-4 font-semibold text-ink">操作ログ（監査）</h2><ul class="space-y-3 text-sm">${state.audit.slice(0, 6).map((l) => `<li class="flex items-center justify-between gap-2"><span class="truncate text-ink/70"><span class="rounded bg-sunny-50 px-1.5 py-0.5 font-mono text-xs text-sunny-700">${l.action}</span> ${l.actor}</span><span class="shrink-0 text-xs text-muted">${l.when}</span></li>`).join("")}</ul></section>
    </div>`;
}
function adminCampaigns() {
  const rows = state.campaigns.slice().reverse().map((c) => { const pc = postedApps(c.id).length, pct = Math.min(100, Math.round((pc / Math.max(1, c.target)) * 100));
    return `<button class="card flex w-full items-center gap-4 p-4 text-left transition hover:shadow-card" data-act="nav" data-href="#/admin/campaigns/${c.id}"><div class="h-16 w-16 shrink-0 overflow-hidden rounded-2xl">${artTile(product(c.productId), "h-16")}</div><div class="min-w-0 flex-1"><div class="flex items-center gap-2"><h3 class="truncate font-semibold text-ink">${c.title}</h3>${pill(CSTATUS[c.status], CSTYLE[c.status])}</div><p class="mt-0.5 truncate text-sm text-muted">${brand(c.brandId).name} ・ ${REWARD[c.rewardType]}</p><div class="mt-2 flex items-center gap-3"><div class="h-1.5 w-32 overflow-hidden rounded-full bg-ink/5"><div class="h-full rounded-full bg-sunrise" style="width:${pct}%"></div></div><span class="text-xs font-medium text-ink/70">${pc}/${c.target}人 取り上げ</span></div></div>${ic("chevron", "h-5 w-5 text-ink/20")}</button>`; }).join("");
  return aHead("掲載（キャンペーン）", "運営がブランドの代理で作成。") + `<div class="space-y-3">${rows}</div>`;
}
function adminReport(id) {
  const c = campaign(id); if (!c) return aHead("見つかりません");
  const b = brand(c.brandId), p = product(c.productId), apps = appsOf(id), pc = postedApps(id), reach = reachOf(id);
  const approvedCnt = apps.filter((a) => a.status === "APPROVED").length + pc.length;
  const appliedCnt = apps.filter((a) => a.status === "APPLIED").length;
  const rows = [["報酬", REWARD[c.rewardType] + (c.rewardType === "OTHER" && c.rewardNote ? `（${c.rewardNote}）` : "")], c.rewardYen > 0 ? ["1人あたり", yen(c.rewardYen)] : null, ["収益モデル", c.billing.map((x) => BILLING[x]).join(" / ")], c.fee > 0 ? ["費用", yen(c.fee)] : null, c.commission > 0 ? ["手数料率", c.commission + "%"] : null].filter(Boolean).map(([k, v]) => `<div class="flex justify-between gap-3 py-1"><dt class="text-muted">${k}</dt><dd class="text-right font-medium text-ink">${v}</dd></div>`).join("");
  const appList = apps.length ? apps.map((a) => { const inf = influencer(a.influencerId); let actions = "";
    if (a.status === "APPLIED") actions = `<div class="flex shrink-0 gap-2"><button class="btn-primary px-4 py-2 text-xs" data-act="approve" data-id="${a.id}">採用</button><button class="btn-ghost px-4 py-2 text-xs" data-act="reject" data-id="${a.id}">見送り</button></div>`;
    else if (a.status === "SUBMITTED") actions = `<div class="flex shrink-0 gap-2"><button class="btn-primary px-4 py-2 text-xs" data-act="confirm" data-id="${a.id}">確認OK・完了</button><button class="btn-ghost px-4 py-2 text-xs" data-act="sendback" data-id="${a.id}">差し戻し</button></div>`;
    return `<li class="flex flex-wrap items-center justify-between gap-3 py-4"><div class="min-w-0"><div class="flex items-center gap-2"><span class="font-semibold text-ink">@${inf.handle}</span>${pill(ASTATUS[a.status], ASTYLE[a.status])}</div><p class="text-xs text-muted">${inf.name} ・ ${fmt(inf.followers)} フォロワー</p>${isPosted(a) ? `<a href="${a.postUrl}" target="_blank" rel="noreferrer" class="mt-1 inline-block text-xs text-sunny-600 underline">投稿を見る</a> <span class="text-xs text-muted">リーチ ${fmt(a.postReach)}</span>` : ""}</div>${actions}</li>`; }).join("") : `<p class="py-8 text-center text-sm text-muted">まだ応募はありません</p>`;
  return `<button class="mb-2 flex items-center gap-1 text-sm text-muted hover:text-ink" data-act="nav" data-href="#/admin/campaigns">${ic("back", "h-4 w-4")} 掲載一覧</button>
    <div class="mb-6 flex flex-wrap items-end justify-between gap-3"><div><h1 class="display text-3xl font-semibold text-ink">${c.title}</h1><p class="mt-1 text-sm text-muted">${b.name} / ${p.name}</p></div>${pill(CSTATUS[c.status], CSTYLE[c.status])}</div>
    <div class="card overflow-hidden"><div class="bg-sunrise-soft p-7"><p class="text-sm text-ink/60">この掲載の成果</p><p class="display mt-1 text-3xl font-semibold text-ink"><span class="bg-sunrise bg-clip-text text-transparent">${pc.length}人</span>が取り上げました</p><p class="mt-1 text-sm text-muted">目標 ${c.target}人 ・ 合計リーチ ${fmt(reach)}</p></div>
      <div class="grid grid-cols-2 divide-x divide-y divide-line sm:grid-cols-4 sm:divide-y-0">${[["応募", apps.length], ["採用", approvedCnt], ["取り上げ", pc.length], ["リーチ", fmt(reach)]].map(([l, v]) => `<div class="p-5 text-center"><div class="display text-2xl font-semibold text-ink">${v}</div><div class="text-xs text-muted">${l}</div></div>`).join("")}</div></div>
    <div class="mt-6 grid gap-6 lg:grid-cols-3">
      <section class="card p-6 lg:col-span-1"><h2 class="display mb-3 font-semibold text-ink">掲載・課金</h2><dl class="text-sm">${rows}</dl><h3 class="mb-1 mt-4 text-xs font-semibold uppercase tracking-wider text-muted">依頼内容</h3><p class="text-sm leading-relaxed text-ink/80">${c.brief}</p></section>
      <section class="card p-6 lg:col-span-2"><h2 class="display mb-3 font-semibold text-ink">応募・取り上げ実績</h2>${appliedCnt > 0 ? `<p class="mb-3 rounded-2xl bg-sunny-50 px-4 py-3 text-sm text-sunny-800">未対応の応募が ${appliedCnt} 件。採用で参加確定です。</p>` : ""}<ul class="divide-y divide-line">${appList}</ul></section>
    </div>`;
}
function adminBrands() {
  const rows = state.brands.map((b) => `<tr class="border-t border-line hover:bg-canvas"><td class="px-5 py-4"><div class="font-semibold text-ink">${b.name}</div><div class="text-xs text-muted">${b.notes}</div></td><td class="px-5 py-4 text-sm text-ink/70">${b.contactName || "—"}<div class="text-xs text-muted">${b.contactEmail}</div></td><td class="px-5 py-4 text-sm text-ink/70">${b.monthlyFeeYen > 0 ? yen(b.monthlyFeeYen) : "—"}</td><td class="px-5 py-4 text-center text-sm">${state.products.filter((p) => p.brandId === b.id).length}</td><td class="px-5 py-4 text-center text-sm">${state.campaigns.filter((c) => c.brandId === b.id).length}</td></tr>`).join("");
  return aHead("ブランド", "運営が管理（ブランド自身は管理画面に入れません）") + `<div class="card overflow-x-auto"><table class="w-full"><thead><tr class="text-left text-xs uppercase tracking-wider text-muted"><th class="px-5 py-3">ブランド</th><th class="px-5 py-3">担当者</th><th class="px-5 py-3">月額</th><th class="px-5 py-3 text-center">商品</th><th class="px-5 py-3 text-center">掲載</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}
function adminInfluencers() {
  const rows = state.influencers.map((inf) => { const mine = state.applications.filter((a) => a.influencerId === inf.id), pc = mine.filter(isPosted);
    return `<tr class="border-t border-line hover:bg-canvas"><td class="px-5 py-4"><div class="flex items-center gap-2 font-semibold text-ink">@${inf.handle}${inf.verified ? ic("check", "h-4 w-4 text-sunny-500") : ""}</div><div class="text-xs text-muted">${inf.name}</div></td><td class="px-5 py-4 text-sm text-ink/70">${PLATFORM[inf.platform]}</td><td class="px-5 py-4 text-right text-sm">${fmt(inf.followers)}</td><td class="px-5 py-4 text-center text-sm">${mine.length}</td><td class="px-5 py-4 text-center text-sm font-semibold text-sunny-600">${pc.length}</td><td class="px-5 py-4 text-right text-sm">${fmt(pc.reduce((s, a) => s + a.postReach, 0))}</td></tr>`; }).join("");
  return aHead("インフルエンサー", "登録者の一覧と実績") + `<div class="card overflow-x-auto"><table class="w-full"><thead><tr class="text-left text-xs uppercase tracking-wider text-muted"><th class="px-5 py-3">ハンドル</th><th class="px-5 py-3">媒体</th><th class="px-5 py-3 text-right">フォロワー</th><th class="px-5 py-3 text-center">応募</th><th class="px-5 py-3 text-center">取り上げ</th><th class="px-5 py-3 text-right">累計リーチ</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

// ============================================================
// イベント
// ============================================================
function toast(msg) {
  let el = document.getElementById("toast");
  if (!el) { el = document.createElement("div"); el.id = "toast"; el.className = "pointer-events-none fixed left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white opacity-0 shadow-card transition"; el.style.bottom = "92px"; document.body.appendChild(el); }
  el.textContent = msg; el.style.opacity = "1"; clearTimeout(el._t); el._t = setTimeout(() => (el.style.opacity = "0"), 1900);
}
function completeApp(a) {
  a.status = "COMPLETED"; const c = campaign(a.campaignId);
  if ((c.rewardType === "PAID" || c.rewardType === "BOTH") && c.rewardYen > 0 && !state.transactions.some((t) => t.campaignId === a.campaignId && t.influencerId === a.influencerId)) {
    const d = new Date(); state.transactions.unshift({ id: uid("t"), influencerId: a.influencerId, campaignId: a.campaignId, amountYen: c.rewardYen, date: `${d.getMonth() + 1}/${d.getDate()}`, status: "振込済み" }); pushAudit("payout.complete");
  } else pushAudit("application.complete");
}
function val(id, d) { const el = document.getElementById(id); return el ? el.value : d; }

document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-act]"); if (!t) return;
  const act = t.dataset.act, id = t.dataset.id;
  if (act === "nav") return go(t.dataset.href);
  if (act === "filter") { searchFilter = t.dataset.cat; render(); return; }
  if (act === "fav") { const f = myFavs(), i = f.indexOf(id); i < 0 ? f.push(id) : f.splice(i, 1); render(); return; }
  if (act === "open-campaign") return go("#/app");
  if (act === "apply") { if (myApps().some((a) => a.campaignId === id)) return; state.applications.push({ id: uid("a"), campaignId: id, influencerId: state.me, status: "APPLIED", message: "", postUrl: "", postReach: 0 }); toast("応募しました ✦ 案件管理で確認できます"); render(); return; }
  if (act === "mgtab") { mgTab = t.dataset.tab; render(); return; }
  if (act === "sim-confirm") { completeApp(state.applications.find((x) => x.id === id)); toast("運営の確認が完了しました"); render(); return; }
  if (act === "submit") { const url = val("url-" + id, ""), reach = parseInt(val("reach-" + id, "0"), 10); if (!url.trim()) return toast("投稿 URL を入力してください"); const a = state.applications.find((x) => x.id === id); a.status = "SUBMITTED"; a.postUrl = url.trim(); a.postReach = reach || 0; mgTab = "review"; toast("提出しました。確認をお待ちください"); render(); return; }
  if (act === "approve" || act === "reject") { const a = state.applications.find((x) => x.id === id); a.status = act === "approve" ? "APPROVED" : "REJECTED"; pushAudit("application.decide"); toast(act === "approve" ? "採用しました" : "見送りにしました"); render(); return; }
  if (act === "confirm") { completeApp(state.applications.find((x) => x.id === id)); toast("完了にしました（報酬を振込）"); render(); return; }
  if (act === "sendback") { state.applications.find((x) => x.id === id).status = "APPROVED"; toast("差し戻しました"); render(); return; }
  if (act === "send-msg") { const inp = document.getElementById("chat-input"), txt = (inp.value || "").trim(); if (!txt) return; const n = new Date(), tm = `${n.getMonth() + 1}/${n.getDate()} ${String(n.getHours()).padStart(2, "0")}:${String(n.getMinutes()).padStart(2, "0")}`; state.inbox.push({ from: "me", text: txt, time: tm }); render(); setTimeout(() => { state.inbox.push({ from: "staff", text: "ありがとうございます。担当より追ってご連絡します。", time: tm }); render(); }, 700); return; }
  if (act === "save-profile") { const me = influencer(state.me); me.name = val("f-name", me.name); me.followers = parseInt(val("f-followers", me.followers), 10) || 0; me.bio = val("f-bio", me.bio); toast("保存しました"); go("#/app/me"); return; }
  if (act === "save-address") { influencer(state.me).address = val("f-address", ""); toast("住所を保存しました"); go("#/app/me"); return; }
  if (act === "save-bank") { influencer(state.me).bank = val("f-bank", ""); toast("振込先を保存しました"); go("#/app/me"); return; }
  if (act === "toggle-sns") { const me = influencer(state.me); if (t.dataset.sns === "instagram") me.igLinked = !me.igLinked; else me.ttLinked = !me.ttLinked; render(); return; }
  if (act === "toggle-notify") { const me = influencer(state.me); me.notify = !me.notify; toast(me.notify ? "通知をONにしました" : "通知をOFFにしました"); render(); return; }
});
document.addEventListener("change", (e) => { const t = e.target.closest("[data-act='switch-influencer']"); if (!t) return; state.me = t.value; render(); });

render();
if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
