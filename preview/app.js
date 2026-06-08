/* ============================================================
   Sunnyway 統合デモ（静的・デモデータ）
   - ランディング / 運営管理Web / インフルエンサーアプリ を 1 つに統合
   - 運営⇄インフルの操作が共有 state を通じて相互に反映される
   - 端末モック無しの全画面表示（PWA としてホーム画面追加で単独起動）
   ============================================================ */

// ---------- ラベル・整形 ----------
const fmt = (n) => (n ?? 0).toLocaleString("ja-JP");
const yen = (n) => "¥" + fmt(n);
const REWARD = { GIFTING: "ギフティング（現物提供）", PAID: "金銭報酬", BOTH: "現物＋金銭", OTHER: "その他（カスタム）" };
const CSTATUS = { DRAFT: "下書き", OPEN: "募集中", CLOSED: "募集締切", COMPLETED: "完了" };
const ASTATUS = { APPLIED: "応募済み", APPROVED: "承認（参加確定）", REJECTED: "却下", POSTED: "投稿提出済み" };
const BILLING = { MONTHLY: "月額・掲載料", PER_CAMPAIGN: "キャンペーン課金", PERFORMANCE: "成果連動", SALES_COMMISSION: "販売手数料" };
const PLATFORM = { INSTAGRAM: "Instagram", TIKTOK: "TikTok", YOUTUBE: "YouTube", X: "X (Twitter)" };

function badgeClass(s) {
  return {
    OPEN: "bg-green-100 text-green-800", APPROVED: "bg-green-100 text-green-800",
    DRAFT: "bg-gray-100 text-gray-700", APPLIED: "bg-gray-100 text-gray-700",
    CLOSED: "bg-red-100 text-red-700", REJECTED: "bg-red-100 text-red-700",
    COMPLETED: "bg-sunny-100 text-sunny-800", POSTED: "bg-sunny-100 text-sunny-800",
  }[s] || "bg-gray-100 text-gray-700";
}

// ---------- デモ状態（Prisma シードを移植）----------
const state = {
  me: "inf-aoi", // インフルアプリで操作中のインフルエンサー
  brands: [
    { id: "b-lum", name: "Lumière Cosmetics", contactName: "佐藤 美咲", contactEmail: "miyabi@lumiere.test", monthlyFeeYen: 50000, notes: "新規スキンケアライン展開中" },
    { id: "b-blo", name: "Blossom Tokyo", contactName: "田中 玲奈", contactEmail: "rena@blossom.test", monthlyFeeYen: 0, notes: "メイクアップ中心。キャンペーン課金希望。" },
  ],
  products: [
    { id: "p-serum", brandId: "b-lum", name: "グロウセラム C", category: "スキンケア", price: 4800, emoji: "💧" },
    { id: "p-cream", brandId: "b-lum", name: "モイストクリーム", category: "スキンケア", price: 3600, emoji: "🧴" },
    { id: "p-lip", brandId: "b-blo", name: "ベルベットリップ 03", category: "メイクアップ", price: 2200, emoji: "💄" },
  ],
  campaigns: [
    { id: "c1", brandId: "b-lum", productId: "p-serum", title: "【ギフティング】グロウセラムCを使ってみて！", brief: "2週間使用して、使用感・テクスチャーを率直にレビュー。ストーリーズ1回＋フィード1投稿。", status: "OPEN", target: 15, rewardType: "GIFTING", rewardYen: 0, billing: ["MONTHLY", "PERFORMANCE"], fee: 0, commission: 0 },
    { id: "c2", brandId: "b-blo", productId: "p-lip", title: "新色リップ 03 PRキャンペーン", brief: "リップスウォッチ＋着用カットを投稿してください。", status: "OPEN", target: 8, rewardType: "BOTH", rewardYen: 5000, billing: ["PER_CAMPAIGN", "SALES_COMMISSION"], fee: 120000, commission: 10 },
    { id: "c3", brandId: "b-lum", productId: "p-cream", title: "モイストクリーム 保湿チャレンジ", brief: "夜のスキンケアに2週間使い、翌朝の肌の様子を投稿。", status: "OPEN", target: 10, rewardType: "GIFTING", rewardYen: 0, billing: ["MONTHLY"], fee: 0, commission: 0 },
    { id: "c4", brandId: "b-blo", productId: "p-lip", title: "リップ発売イベント 招待＋商品", brief: "発売イベントへご招待。来場レポート投稿をお願いします。", status: "OPEN", target: 5, rewardType: "OTHER", rewardYen: 0, billing: ["PER_CAMPAIGN"], fee: 80000, commission: 0, rewardNote: "イベント招待＋商品一式" },
  ],
  influencers: [
    { id: "inf-aoi", name: "Aoi", handle: "aoi_beauty", platform: "INSTAGRAM", followers: 28000, verified: true, bio: "コスメと美容が大好き💄", shipping: "" },
    { id: "inf-mei", name: "Mei", handle: "mei_cosme", platform: "TIKTOK", followers: 51000, verified: false, bio: "", shipping: "" },
    { id: "inf-rina", name: "Rina", handle: "rina_skin", platform: "INSTAGRAM", followers: 9800, verified: false, bio: "敏感肌レビュー", shipping: "" },
  ],
  applications: [
    { id: "a1", campaignId: "c1", influencerId: "inf-aoi", status: "POSTED", message: "ビタミンC系大好きです！", postUrl: "https://www.instagram.com/p/demo-aoi", postReach: 18400 },
    { id: "a2", campaignId: "c1", influencerId: "inf-mei", status: "APPROVED", message: "ショート動画で紹介したいです", postUrl: "", postReach: 0 },
    { id: "a3", campaignId: "c1", influencerId: "inf-rina", status: "APPLIED", message: "敏感肌レビュー得意です", postUrl: "", postReach: 0 },
    { id: "a4", campaignId: "c2", influencerId: "inf-aoi", status: "APPROVED", message: "", postUrl: "", postReach: 0 },
    { id: "a5", campaignId: "c2", influencerId: "inf-rina", status: "POSTED", message: "", postUrl: "https://www.instagram.com/p/demo-rina", postReach: 7200 },
  ],
  audit: [
    { actor: "Sunnyway 運営", action: "brand.create", when: "06/08 10:12" },
    { actor: "Sunnyway 運営", action: "campaign.create", when: "06/08 10:20" },
    { actor: "Sunnyway 運営", action: "application.decide", when: "06/08 11:05" },
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
const posted = (cid) => appsOf(cid).filter((a) => a.status === "POSTED");
const reachOf = (cid) => posted(cid).reduce((s, a) => s + a.postReach, 0);

function logAudit(action) {
  const d = new Date();
  const when = `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  state.audit.unshift({ actor: "Sunnyway 運営", action, when });
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
// ランディング
// ============================================================
function renderLanding() {
  root.innerHTML = `
  <main class="fade min-h-[100dvh]">
    <section class="bg-gradient-to-b from-sunny-50 to-white">
      <div class="mx-auto max-w-5xl px-6 py-16 text-center sm:py-24">
        <div class="mb-4 inline-flex items-center gap-2 rounded-full bg-sunny-100 px-4 py-1.5 text-sm font-medium text-sunny-700">☀️ Sunnyway Platform ・ デモ</div>
        <h1 class="text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl">
          ここに掲載すれば、<br><span class="text-sunny-500">何人ものインフルエンサー</span>が<br>あなたのコスメを取り上げる。
        </h1>
        <p class="mx-auto mt-6 max-w-2xl text-base text-gray-600 sm:text-lg">
          Sunnyway は、コスメブランドとインフルエンサーをつなぐマッチングプラットフォーム。
          掲載から投稿・成果レポートまでを一気通貫で。
        </p>
        <div class="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button class="btn-primary px-6 py-3 text-base" data-act="nav" data-href="#/app">✨ インフルエンサーとして使う</button>
          <button class="btn-ghost px-6 py-3 text-base" data-act="nav" data-href="#/admin">☀️ 運営（Sunnyway）管理を見る</button>
        </div>
        <p class="mt-3 text-xs text-gray-400">※ どちらの視点も自由に行き来できます（操作は相互に反映されます）</p>
      </div>
    </section>

    <section class="mx-auto max-w-5xl px-6 py-14">
      <h2 class="text-center text-2xl font-bold text-gray-900">仕組み（3者）</h2>
      <div class="mt-8 grid gap-6 md:grid-cols-3">
        ${roleCard("☀️", "Sunnyway（運営）", "プラットフォームを所有・運営。ブランドの掲載を代理で作成し、インフルを束ね、成果をレポート。", "管理Web・セキュア")}
        ${roleCard("💄", "コスメブランド", "商品を掲載してもらう顧客。管理権限は持たず、Sunnyway 経由で掲載・成果を受け取る。", "運営が代理（管理画面なし）")}
        ${roleCard("✨", "インフルエンサー", "募集中の商品に応募し、現物提供や報酬を受けて投稿。取り上げ実績がレポートに反映。", "スマホアプリ")}
      </div>
    </section>

    <section class="mx-auto max-w-5xl px-6 pb-16">
      <div class="grid gap-4 sm:grid-cols-2">
        <div class="card p-5">
          <h3 class="font-semibold text-gray-900">報酬モデル（インフルへ）</h3>
          <p class="mt-2 text-sm text-gray-600">ギフティング（現物提供）／金銭報酬／その他（カスタム）に対応。案件ごとに設定。</p>
        </div>
        <div class="card p-5">
          <h3 class="font-semibold text-gray-900">収益モデル（ブランドへ課金）</h3>
          <p class="mt-2 text-sm text-gray-600">月額・掲載料／キャンペーン課金／成果連動／販売手数料の4モデルを併用可能。</p>
        </div>
      </div>
    </section>

    <footer class="border-t border-gray-200 py-8 text-center text-sm text-gray-500">© ${new Date().getFullYear()} Sunnyway ・ これはデモです（データは保存されません）</footer>
  </main>`;
}
function roleCard(emoji, title, desc, tag) {
  return `<div class="card p-6"><div class="text-3xl">${emoji}</div>
    <h3 class="mt-3 text-lg font-semibold text-gray-900">${title}</h3>
    <p class="mt-2 text-sm text-gray-600">${desc}</p>
    <span class="badge mt-4 bg-sunny-100 text-sunny-700">${tag}</span></div>`;
}

// ============================================================
// インフルエンサーアプリ（全画面・スマホUI）
// ============================================================
function renderInfluencer(h) {
  const me = influencer(state.me);
  const tab = h.startsWith("#/app/mine") ? "mine" : "feed";
  root.innerHTML = `
  <div class="flex min-h-[100dvh] flex-col bg-gray-50">
    <header class="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3" style="padding-top:max(0.75rem,env(safe-area-inset-top))">
      <button class="flex items-center gap-1.5" data-act="nav" data-href="#/">
        <span class="text-lg">☀️</span><span class="font-bold text-gray-900">Sunnyway</span>
      </button>
      <div class="flex items-center gap-3">
        <select class="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-600" data-act="switch-influencer">
          ${state.influencers.map((i) => `<option value="${i.id}" ${i.id === state.me ? "selected" : ""}>@${i.handle}</option>`).join("")}
        </select>
        <button class="text-xs text-gray-400 hover:text-gray-600" data-act="nav" data-href="#/">視点切替</button>
      </div>
    </header>

    <main class="flex-1 overflow-y-auto">
      <div class="mx-auto max-w-md px-4 py-5">${tab === "feed" ? influencerFeed() : influencerMine()}</div>
    </main>

    <nav class="sticky bottom-0 z-20 grid grid-cols-2 border-t border-gray-200 bg-white/95 backdrop-blur" style="padding-bottom:env(safe-area-inset-bottom)">
      ${tabBtn("#/app", "🔍", "さがす", tab === "feed")}
      ${tabBtn("#/app/mine", "✨", "マイ", tab === "mine")}
    </nav>
  </div>`;
}
function tabBtn(href, icon, label, active) {
  return `<button data-act="nav" data-href="${href}" class="flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium ${active ? "text-sunny-600" : "text-gray-400"}"><span class="text-lg">${icon}</span>${label}</button>`;
}

function influencerFeed() {
  const open = state.campaigns.filter((c) => c.status === "OPEN" && !state.applications.some((a) => a.campaignId === c.id && a.influencerId === state.me));
  const cards = open.map((c) => {
    const p = product(c.productId), b = brand(c.brandId);
    const chips = [];
    if ((c.rewardType === "PAID" || c.rewardType === "BOTH") && c.rewardYen > 0) chips.push(`💰 報酬 <b>${yen(c.rewardYen)}</b>`);
    if (c.rewardType === "GIFTING" || c.rewardType === "BOTH") chips.push("🎁 現物提供");
    if (c.rewardType === "OTHER") chips.push("🎟 " + (c.rewardNote || "その他"));
    chips.push(`<span class="text-gray-400">募集 ${c.target}人</span>`);
    return `<article class="card overflow-hidden">
      <div class="flex h-40 items-center justify-center bg-sunny-50 text-6xl">${p.emoji}</div>
      <div class="p-4">
        <div class="flex flex-wrap items-center gap-2">
          <span class="badge bg-sunny-100 text-sunny-700">${REWARD[c.rewardType]}</span>
          <span class="badge bg-gray-100 text-gray-600">${p.category}</span>
        </div>
        <h2 class="mt-2 font-bold text-gray-900">${c.title}</h2>
        <p class="text-sm text-gray-500">${b.name} / ${p.name}</p>
        <p class="mt-2 text-sm text-gray-600">${c.brief}</p>
        <div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">${chips.join(" ")}</div>
        <button class="btn-primary mt-4 w-full" data-act="apply" data-id="${c.id}">この案件に応募する</button>
      </div></article>`;
  }).join("");
  return `<h1 class="text-xl font-bold text-gray-900">募集中の案件</h1>
    <p class="mt-0.5 text-sm text-gray-500">気になるコスメに応募して、投稿しよう</p>
    <div class="mt-4 space-y-4">${open.length ? cards : `<div class="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-400">応募できる案件は今はありません。<br>また見にきてね ☀️</div>`}</div>`;
}

function influencerMine() {
  const apps = myApps();
  const me = influencer(state.me);
  const postedCount = apps.filter((a) => a.status === "POSTED").length;
  const totalReach = apps.reduce((s, a) => s + a.postReach, 0);
  const cards = apps.map((a) => {
    const c = campaign(a.campaignId), p = product(c.productId), b = brand(c.brandId);
    const canSubmit = a.status === "APPROVED" || a.status === "POSTED";
    return `<div class="card p-4">
      <div class="flex items-start justify-between gap-2">
        <div class="min-w-0"><p class="truncate font-semibold text-gray-900">${c.title}</p>
          <p class="truncate text-xs text-gray-500">${b.name} / ${p.name} ・ ${REWARD[c.rewardType]}</p></div>
        <span class="badge ${badgeClass(a.status)}">${ASTATUS[a.status]}</span>
      </div>
      ${a.status === "APPLIED" ? `<p class="mt-3 border-t border-gray-100 pt-3 text-xs text-gray-500">運営の承認待ちです。<button class="ml-1 font-semibold text-sunny-600 underline" data-act="sim-approve" data-id="${a.id}">［デモ：承認をシミュレート］</button></p>` : ""}
      ${canSubmit ? `<div class="mt-3 space-y-2 border-t border-gray-100 pt-3">
        <p class="text-xs font-medium text-gray-500">${a.status === "POSTED" ? "提出済み（更新も可能）" : "投稿したら URL を提出してください"}</p>
        <input class="input" id="url-${a.id}" placeholder="https://www.instagram.com/p/…" value="${a.postUrl}">
        <input class="input" id="reach-${a.id}" type="number" min="0" placeholder="リーチ / 表示回数" value="${a.postReach || ""}">
        <button class="btn-primary w-full" data-act="submit" data-id="${a.id}">投稿を提出する</button></div>` : ""}
      ${a.status === "REJECTED" ? `<p class="mt-2 text-xs text-gray-400">今回は見送りとなりました。</p>` : ""}
    </div>`;
  }).join("");
  return `<section class="card p-4">
      <div class="flex items-center gap-3">
        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-sunny-100 text-2xl">✨</div>
        <div><p class="font-bold text-gray-900">@${me.handle}</p>
          <p class="text-xs text-gray-500">${PLATFORM[me.platform]} ・ フォロワー ${fmt(me.followers)}</p></div>
      </div>
      <div class="mt-4 grid grid-cols-3 gap-2 text-center">
        ${mini("応募", apps.length)}${mini("取り上げ", postedCount)}${mini("累計リーチ", fmt(totalReach))}
      </div></section>
    <h2 class="mb-2 mt-6 font-bold text-gray-900">応募・参加状況</h2>
    ${apps.length ? `<div class="space-y-3">${cards}</div>` : `<p class="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-400">まだ応募がありません。「さがす」から応募してみよう。</p>`}
    <section class="card mt-6 p-4">
      <h2 class="mb-3 font-bold text-gray-900">プロフィール設定</h2>
      <div class="space-y-3">
        <div><label class="label">フォロワー数</label><input class="input" type="number" id="pf-followers" value="${me.followers}"></div>
        <div><label class="label">自己紹介</label><textarea class="input" id="pf-bio" rows="2">${me.bio}</textarea></div>
        <div><label class="label">発送先住所（ギフティング用）</label><textarea class="input" id="pf-ship" rows="2" placeholder="現物提供の案件で使用します">${me.shipping}</textarea></div>
        <button class="btn-primary w-full" data-act="save-profile">保存する</button>
      </div></section>`;
}
function mini(label, value) {
  return `<div class="rounded-lg bg-gray-50 py-2"><div class="text-lg font-bold text-gray-900">${value}</div><div class="text-xs text-gray-500">${label}</div></div>`;
}

// ============================================================
// 運営管理（Web）
// ============================================================
const ADMIN_NAV = [
  ["#/admin", "ダッシュボード"],
  ["#/admin/campaigns", "掲載（キャンペーン）"],
  ["#/admin/brands", "ブランド"],
  ["#/admin/influencers", "インフルエンサー"],
];
function adminShell(active, body) {
  return `<div class="min-h-[100dvh] lg:flex">
    <aside class="border-b border-gray-200 bg-white lg:w-60 lg:shrink-0 lg:border-b-0 lg:border-r">
      <div class="px-5 py-4">
        <button class="flex items-center gap-2" data-act="nav" data-href="#/"><span class="text-xl">☀️</span><span class="font-bold text-gray-900">Sunnyway 管理</span></button>
        <span class="badge mt-2 inline-flex bg-sunny-100 text-sunny-700">運営者でログイン中</span>
      </div>
      <nav class="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col">
        ${ADMIN_NAV.map(([href, label]) => `<button data-act="nav" data-href="${href}" class="whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm font-medium ${active === href ? "bg-sunny-50 text-sunny-700" : "text-gray-600 hover:bg-sunny-50 hover:text-sunny-700"}">${label}</button>`).join("")}
      </nav>
      <div class="hidden border-t border-gray-200 p-3 lg:block">
        <button class="btn-ghost w-full text-sm" data-act="nav" data-href="#/">← 視点を切り替え</button>
      </div>
    </aside>
    <main class="flex-1 px-5 py-6 lg:px-10 lg:py-8">${body}</main>
  </div>`;
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

function pageHeader(title, desc) {
  return `<div class="mb-6"><h1 class="text-2xl font-bold text-gray-900">${title}</h1>${desc ? `<p class="mt-1 text-sm text-gray-500">${desc}</p>` : ""}</div>`;
}
function stat(label, value, sub) {
  return `<div class="card p-5"><div class="text-sm text-gray-500">${label}</div><div class="mt-1 text-3xl font-bold text-gray-900">${value}</div>${sub ? `<div class="mt-1 text-xs text-gray-400">${sub}</div>` : ""}</div>`;
}

function adminDashboard() {
  const openC = state.campaigns.filter((c) => c.status === "OPEN").length;
  const postedAll = state.applications.filter((a) => a.status === "POSTED");
  const totalReach = postedAll.reduce((s, a) => s + a.postReach, 0);
  const recent = state.campaigns.slice().reverse().slice(0, 5);
  return pageHeader("ダッシュボード", "Sunnyway プラットフォーム全体のサマリー") + `
    <div class="grid grid-cols-2 gap-4 lg:grid-cols-3">
      ${stat("登録ブランド", state.brands.length)}${stat("登録商品", state.products.length)}${stat("インフルエンサー", state.influencers.length)}
      ${stat("募集中の掲載", openC)}${stat("取り上げ件数（投稿）", postedAll.length, "POSTED の応募数")}${stat("合計リーチ", fmt(totalReach), "投稿リーチの総和")}
    </div>
    <div class="mt-8 grid gap-6 lg:grid-cols-2">
      <section class="card p-5">
        <div class="mb-3 flex items-center justify-between"><h2 class="font-semibold text-gray-900">最近の掲載</h2>
          <button class="text-sm font-medium text-sunny-600 hover:text-sunny-700" data-act="nav" data-href="#/admin/campaigns">すべて見る →</button></div>
        <ul class="divide-y divide-gray-100">
        ${recent.map((c) => `<li class="py-3"><button class="flex w-full items-center justify-between gap-3 text-left hover:opacity-80" data-act="nav" data-href="#/admin/campaigns/${c.id}">
          <div class="min-w-0"><p class="truncate font-medium text-gray-900">${c.title}</p><p class="truncate text-xs text-gray-500">${brand(c.brandId).name} ・ ${REWARD[c.rewardType]}</p></div>
          <div class="flex shrink-0 items-center gap-2"><span class="text-sm font-semibold text-sunny-600">${posted(c.id).length}/${c.target}人</span><span class="badge ${badgeClass(c.status)}">${CSTATUS[c.status]}</span></div>
        </button></li>`).join("")}
        </ul>
      </section>
      <section class="card p-5">
        <h2 class="mb-3 font-semibold text-gray-900">操作ログ（監査）</h2>
        <ul class="space-y-2 text-sm">
        ${state.audit.slice(0, 6).map((l) => `<li class="flex items-center justify-between gap-2"><span class="truncate text-gray-700"><span class="font-mono text-xs text-sunny-700">${l.action}</span> by ${l.actor}</span><span class="shrink-0 text-xs text-gray-400">${l.when}</span></li>`).join("")}
        </ul>
      </section>
    </div>`;
}

function adminCampaigns() {
  const rows = state.campaigns.slice().reverse().map((c) => {
    const pc = posted(c.id).length, pct = Math.min(100, Math.round((pc / Math.max(1, c.target)) * 100));
    return `<button class="card flex w-full flex-col gap-3 p-5 text-left transition hover:border-sunny-300 sm:flex-row sm:items-center sm:justify-between" data-act="nav" data-href="#/admin/campaigns/${c.id}">
      <div class="min-w-0"><div class="flex items-center gap-2"><h3 class="truncate font-semibold text-gray-900">${c.title}</h3><span class="badge ${badgeClass(c.status)}">${CSTATUS[c.status]}</span></div>
        <p class="mt-0.5 truncate text-sm text-gray-500">${brand(c.brandId).name} / ${product(c.productId).name} ・ ${REWARD[c.rewardType]}</p></div>
      <div class="sm:w-64"><div class="flex items-center justify-between text-sm"><span class="text-gray-500">取り上げ</span><span class="font-semibold text-gray-900">${pc}/${c.target}人</span></div>
        <div class="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-100"><div class="h-full rounded-full bg-sunny-500" style="width:${pct}%"></div></div>
        <p class="mt-1 text-right text-xs text-gray-400">応募 ${appsOf(c.id).length}件</p></div>
    </button>`;
  }).join("");
  return pageHeader("掲載（キャンペーン）", "「ここに掲載すれば◯人が取り上げます」の単位。運営がブランドの代理で作成します。") + `<div class="space-y-3">${rows}</div>`;
}

function adminReport(id) {
  const c = campaign(id);
  if (!c) return pageHeader("見つかりません") + `<button class="btn-ghost" data-act="nav" data-href="#/admin/campaigns">← 戻る</button>`;
  const b = brand(c.brandId), p = product(c.productId);
  const apps = appsOf(id);
  const pc = posted(id), reach = reachOf(id);
  const approvedCnt = apps.filter((a) => a.status === "APPROVED").length + pc.length;
  const appliedCnt = apps.filter((a) => a.status === "APPLIED").length;
  const billingTxt = c.billing.map((x) => BILLING[x]).join(" / ");
  const rows = [
    ["報酬タイプ", REWARD[c.rewardType] + (c.rewardType === "OTHER" && c.rewardNote ? `（${c.rewardNote}）` : "")],
    c.rewardYen > 0 ? ["1人あたり報酬", yen(c.rewardYen)] : null,
    ["収益モデル", billingTxt],
    c.fee > 0 ? ["キャンペーン費用", yen(c.fee)] : null,
    c.commission > 0 ? ["販売手数料率", c.commission + "%"] : null,
  ].filter(Boolean).map(([k, v]) => `<div class="flex justify-between gap-3"><dt class="text-gray-500">${k}</dt><dd class="text-right font-medium text-gray-800">${v}</dd></div>`).join("");

  const appList = apps.length ? apps.map((a) => {
    const inf = influencer(a.influencerId);
    return `<li class="py-3"><div class="flex flex-wrap items-center justify-between gap-2">
      <div class="min-w-0"><div class="flex items-center gap-2"><span class="font-medium text-gray-900">@${inf.handle}</span><span class="badge ${badgeClass(a.status)}">${ASTATUS[a.status]}</span></div>
        <p class="text-xs text-gray-500">${inf.name} ・ フォロワー ${fmt(inf.followers)}</p>
        ${a.message ? `<p class="mt-1 text-sm text-gray-600">「${a.message}」</p>` : ""}
        ${a.status === "POSTED" ? `<p class="mt-1 text-sm"><a href="${a.postUrl}" target="_blank" rel="noreferrer" class="text-sunny-600 underline">投稿を見る</a> <span class="text-gray-500">・ リーチ ${fmt(a.postReach)}</span></p>` : ""}</div>
      ${a.status === "APPLIED" ? `<div class="flex shrink-0 gap-2"><button class="btn-primary text-xs" data-act="approve" data-id="${a.id}">承認</button><button class="btn-ghost text-xs" data-act="reject" data-id="${a.id}">却下</button></div>` : ""}
    </div></li>`;
  }).join("") : `<p class="py-6 text-center text-sm text-gray-400">まだ応募はありません。</p>`;

  return `<button class="text-sm text-gray-500 hover:text-gray-700" data-act="nav" data-href="#/admin/campaigns">← 掲載一覧へ</button>
    <div class="mb-6 mt-2 flex flex-wrap items-end justify-between gap-3"><div><h1 class="text-2xl font-bold text-gray-900">${c.title}</h1><p class="mt-1 text-sm text-gray-500">${b.name} / ${p.name}</p></div><span class="badge ${badgeClass(c.status)}">${CSTATUS[c.status]}</span></div>
    <div class="card mb-6 bg-gradient-to-r from-sunny-50 to-white p-6">
      <p class="text-sm text-gray-600">この掲載の成果</p>
      <p class="mt-1 text-3xl font-bold text-gray-900"><span class="text-sunny-600">${pc.length}人</span>のインフルエンサーが取り上げました</p>
      <p class="mt-1 text-sm text-gray-500">目標 ${c.target}人 ・ 合計リーチ ${fmt(reach)}</p>
    </div>
    <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
      ${stat("応募", apps.length)}${stat("承認（参加確定）", approvedCnt)}${stat("取り上げ（投稿）", pc.length)}${stat("合計リーチ", fmt(reach))}
    </div>
    <div class="mt-6 grid gap-6 lg:grid-cols-3">
      <section class="card p-5 lg:col-span-1">
        <h2 class="mb-3 font-semibold text-gray-900">掲載・課金情報</h2>
        <dl class="space-y-2 text-sm">${rows}</dl>
        <h3 class="mb-1 mt-4 text-sm font-medium text-gray-700">依頼内容</h3><p class="whitespace-pre-wrap text-sm text-gray-600">${c.brief}</p>
        <h3 class="mb-2 mt-4 text-sm font-medium text-gray-700">ステータス変更</h3>
        <div class="flex flex-wrap gap-2">
          ${["OPEN", "CLOSED", "COMPLETED"].map((s) => `<button class="btn-ghost text-xs" ${c.status === s ? "disabled" : ""} data-act="cstatus" data-id="${c.id}" data-status="${s}">${CSTATUS[s]}にする</button>`).join("")}
        </div>
      </section>
      <section class="card p-5 lg:col-span-2">
        <h2 class="mb-3 font-semibold text-gray-900">応募・取り上げ実績</h2>
        ${appliedCnt > 0 ? `<p class="mb-3 rounded-lg bg-sunny-50 px-3 py-2 text-sm text-sunny-800">未対応の応募が ${appliedCnt} 件あります。承認すると参加確定です。</p>` : ""}
        <ul class="divide-y divide-gray-100">${appList}</ul>
      </section>
    </div>`;
}

function adminBrands() {
  const rows = state.brands.map((b) => {
    const pc = state.products.filter((p) => p.brandId === b.id).length;
    const cc = state.campaigns.filter((c) => c.brandId === b.id).length;
    return `<tr class="hover:bg-gray-50">
      <td class="px-4 py-3"><div class="font-medium text-gray-900">${b.name}</div><div class="text-xs text-gray-400">${b.notes}</div></td>
      <td class="px-4 py-3 text-gray-600">${b.contactName || "—"}<div class="text-xs text-gray-400">${b.contactEmail}</div></td>
      <td class="px-4 py-3 text-gray-600">${b.monthlyFeeYen > 0 ? yen(b.monthlyFeeYen) : "—"}</td>
      <td class="px-4 py-3 text-center">${pc}</td><td class="px-4 py-3 text-center">${cc}</td></tr>`;
  }).join("");
  return pageHeader("ブランド", "コスメブランドは運営が管理します（ブランド自身は管理画面に入れません）") + `
    <div class="card overflow-x-auto"><table class="w-full text-sm">
      <thead class="bg-gray-50 text-left text-xs uppercase text-gray-500"><tr><th class="px-4 py-3">ブランド</th><th class="px-4 py-3">担当者</th><th class="px-4 py-3">月額</th><th class="px-4 py-3 text-center">商品</th><th class="px-4 py-3 text-center">掲載</th></tr></thead>
      <tbody class="divide-y divide-gray-100">${rows}</tbody></table></div>`;
}

function adminInfluencers() {
  const rows = state.influencers.map((inf) => {
    const mine = state.applications.filter((a) => a.influencerId === inf.id);
    const pc = mine.filter((a) => a.status === "POSTED");
    const reach = pc.reduce((s, a) => s + a.postReach, 0);
    return `<tr class="hover:bg-gray-50">
      <td class="px-4 py-3"><div class="flex items-center gap-2 font-medium text-gray-900">@${inf.handle}${inf.verified ? `<span class="badge bg-sunny-100 text-sunny-700">認証済</span>` : ""}</div><div class="text-xs text-gray-400">${inf.name}</div></td>
      <td class="px-4 py-3 text-gray-600">${PLATFORM[inf.platform]}</td>
      <td class="px-4 py-3 text-right text-gray-600">${fmt(inf.followers)}</td>
      <td class="px-4 py-3 text-center text-gray-600">${mine.length}</td>
      <td class="px-4 py-3 text-center font-semibold text-sunny-600">${pc.length}</td>
      <td class="px-4 py-3 text-right text-gray-600">${fmt(reach)}</td></tr>`;
  }).join("");
  return pageHeader("インフルエンサー", "アプリから登録したインフルエンサーの一覧と実績") + `
    <div class="card overflow-x-auto"><table class="w-full text-sm">
      <thead class="bg-gray-50 text-left text-xs uppercase text-gray-500"><tr><th class="px-4 py-3">ハンドル</th><th class="px-4 py-3">媒体</th><th class="px-4 py-3 text-right">フォロワー</th><th class="px-4 py-3 text-center">応募</th><th class="px-4 py-3 text-center">取り上げ</th><th class="px-4 py-3 text-right">累計リーチ</th></tr></thead>
      <tbody class="divide-y divide-gray-100">${rows}</tbody></table></div>`;
}

// ============================================================
// イベント（委譲）
// ============================================================
function toast(msg) {
  let el = document.getElementById("toast");
  if (!el) { el = document.createElement("div"); el.id = "toast"; el.className = "fixed left-1/2 z-50 -translate-x-1/2 rounded-full bg-gray-900/90 px-4 py-2 text-sm text-white opacity-0 transition"; el.style.bottom = "84px"; document.body.appendChild(el); }
  el.textContent = msg; el.style.opacity = "1";
  clearTimeout(el._t); el._t = setTimeout(() => (el.style.opacity = "0"), 1800);
}

document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-act]");
  if (!t) return;
  const act = t.dataset.act, id = t.dataset.id;
  if (act === "nav") return go(t.dataset.href);
  if (act === "apply") {
    state.applications.push({ id: uid("a"), campaignId: id, influencerId: state.me, status: "APPLIED", message: "", postUrl: "", postReach: 0 });
    toast("応募しました！マイページで確認できます ✨"); go("#/app/mine"); return;
  }
  if (act === "sim-approve") { const a = state.applications.find((x) => x.id === id); a.status = "APPROVED"; logAudit("application.decide"); toast("運営が承認しました（デモ）"); render(); return; }
  if (act === "submit") {
    const url = (document.getElementById("url-" + id) || {}).value || "";
    const reach = parseInt((document.getElementById("reach-" + id) || {}).value || "0", 10);
    if (!url.trim()) return toast("投稿 URL を入力してください");
    const a = state.applications.find((x) => x.id === id); a.status = "POSTED"; a.postUrl = url.trim(); a.postReach = reach || 0;
    toast("投稿を提出しました。ありがとうございます！"); render(); return;
  }
  if (act === "save-profile") {
    const me = influencer(state.me);
    me.followers = parseInt(document.getElementById("pf-followers").value || "0", 10);
    me.bio = document.getElementById("pf-bio").value; me.shipping = document.getElementById("pf-ship").value;
    toast("プロフィールを保存しました"); render(); return;
  }
  if (act === "approve" || act === "reject") {
    const a = state.applications.find((x) => x.id === id); a.status = act === "approve" ? "APPROVED" : "REJECTED";
    logAudit("application.decide"); toast(act === "approve" ? "承認しました" : "却下しました"); render(); return;
  }
  if (act === "cstatus") { campaign(id).status = t.dataset.status; logAudit("campaign.status"); toast("ステータスを変更しました"); render(); return; }
});

document.addEventListener("change", (e) => {
  const t = e.target.closest("[data-act='switch-influencer']");
  if (!t) return;
  state.me = t.value; render();
});

// ============================================================
// 初期化 + PWA Service Worker
// ============================================================
render();
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}
