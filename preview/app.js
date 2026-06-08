/* ============================================================
   Sunnyway 統合デモ（静的・デモデータ）— bibico の上位互換
   - インフルアプリ: 案件を探す / 案件管理(やること・チェック中・終了案件) /
     お問い合わせ / マイページ(プロフィール・住所・SNS連携・振込先・取引履歴・通知)
   - 運営管理Web: ダッシュボード / 掲載 / レポート(◯人取り上げ) / ブランド / インフル
   - 応募→採用→投稿→運営チェック→完了→振込→取引履歴 まで相互反映
   - 端末枠なしの全画面表示・PWA
   ============================================================ */

// ---------- ラベル・整形 ----------
const fmt = (n) => (n ?? 0).toLocaleString("ja-JP");
const yen = (n) => "¥" + fmt(n);
const REWARD = { GIFTING: "ギフティング（現物提供）", PAID: "金銭報酬", BOTH: "現物＋金銭", OTHER: "その他（カスタム）" };
const CSTATUS = { DRAFT: "下書き", OPEN: "募集中", CLOSED: "募集締切", COMPLETED: "完了" };
// 応募ステータス（bibico の やること/チェック中/終了 に対応）
const ASTATUS = { APPLIED: "応募済み", APPROVED: "採用（やること）", SUBMITTED: "チェック中", COMPLETED: "終了", REJECTED: "不採用" };
const BILLING = { MONTHLY: "月額・掲載料", PER_CAMPAIGN: "キャンペーン課金", PERFORMANCE: "成果連動", SALES_COMMISSION: "販売手数料" };
const PLATFORM = { INSTAGRAM: "Instagram", TIKTOK: "TikTok", YOUTUBE: "YouTube", X: "X (Twitter)" };

function badgeClass(s) {
  return {
    OPEN: "bg-green-100 text-green-800", APPROVED: "bg-green-100 text-green-800",
    DRAFT: "bg-gray-100 text-gray-700", APPLIED: "bg-gray-100 text-gray-700",
    CLOSED: "bg-red-100 text-red-700", REJECTED: "bg-red-100 text-red-700",
    SUBMITTED: "bg-blue-100 text-blue-700",
    COMPLETED: "bg-sunny-100 text-sunny-800",
  }[s] || "bg-gray-100 text-gray-700";
}

// ---------- デモ状態 ----------
const state = {
  me: "inf-aoi",
  brands: [
    { id: "b-lum", name: "Lumière Cosmetics", contactName: "佐藤 美咲", contactEmail: "miyabi@lumiere.test", monthlyFeeYen: 50000, notes: "新規スキンケアライン展開中" },
    { id: "b-blo", name: "Blossom Tokyo", contactName: "田中 玲奈", contactEmail: "rena@blossom.test", monthlyFeeYen: 0, notes: "メイクアップ中心。" },
  ],
  products: [
    { id: "p-serum", brandId: "b-lum", name: "グロウセラム C", category: "スキンケア", price: 4800, emoji: "💧" },
    { id: "p-cream", brandId: "b-lum", name: "モイストクリーム", category: "スキンケア", price: 3600, emoji: "🧴" },
    { id: "p-lip", brandId: "b-blo", name: "ベルベットリップ 03", category: "メイクアップ", price: 2200, emoji: "💄" },
  ],
  campaigns: [
    { id: "c1", brandId: "b-lum", productId: "p-serum", title: "【6月案件】グロウセラムCを使ってレビュー", brief: "2週間使用して使用感を率直に。ストーリーズ1回＋フィード1投稿。", status: "OPEN", target: 30, applied: 42, deadline: "2026/06/30", media: "Instagram Feed", tags: ["顔出し不要", "現物提供"], rewardType: "GIFTING", rewardYen: 0, billing: ["MONTHLY", "PERFORMANCE"], fee: 0, commission: 0 },
    { id: "c2", brandId: "b-blo", productId: "p-lip", title: "新色リップ 03 リール投稿キャンペーン", brief: "リップスウォッチ＋着用カットをリールで。", status: "OPEN", target: 15, applied: 20, deadline: "2026/06/20", media: "Instagram Reels", tags: ["顔出しあり", "報酬あり"], rewardType: "BOTH", rewardYen: 5000, billing: ["PER_CAMPAIGN", "SALES_COMMISSION"], fee: 120000, commission: 10 },
    { id: "c3", brandId: "b-lum", productId: "p-cream", title: "モイストクリーム 保湿チャレンジ", brief: "夜のスキンケアに2週間。翌朝の肌を投稿。", status: "OPEN", target: 20, applied: 33, deadline: "2026/07/10", media: "Instagram Feed", tags: ["顔出し不要"], rewardType: "GIFTING", rewardYen: 0, billing: ["MONTHLY"], fee: 0, commission: 0 },
    { id: "c4", brandId: "b-blo", productId: "p-lip", title: "リップ発売イベント 招待＋商品", brief: "発売イベントへご招待。来場レポート投稿。", status: "OPEN", target: 8, applied: 11, deadline: "2026/06/15", media: "TikTok", tags: ["来場必須", "その他報酬"], rewardType: "OTHER", rewardYen: 0, billing: ["PER_CAMPAIGN"], fee: 80000, commission: 0, rewardNote: "イベント招待＋商品一式" },
  ],
  influencers: [
    { id: "inf-aoi", name: "あゆむ", handle: "aoi_beauty", platform: "INSTAGRAM", followers: 28000, verified: true, bio: "コスメと美容が大好き💄", address: "東京都渋谷区…", bank: "みずほ銀行 渋谷支店 普通 1234567", igLinked: true, ttLinked: false, notify: false },
    { id: "inf-mei", name: "Mei", handle: "mei_cosme", platform: "TIKTOK", followers: 51000, verified: false, bio: "", address: "", bank: "", igLinked: false, ttLinked: true, notify: true },
    { id: "inf-rina", name: "Rina", handle: "rina_skin", platform: "INSTAGRAM", followers: 9800, verified: false, bio: "敏感肌レビュー", address: "", bank: "", igLinked: true, ttLinked: false, notify: false },
  ],
  applications: [
    { id: "a1", campaignId: "c1", influencerId: "inf-aoi", status: "COMPLETED", message: "ビタミンC系大好きです！", postUrl: "https://www.instagram.com/p/demo-aoi", postReach: 18400 },
    { id: "a2", campaignId: "c1", influencerId: "inf-mei", status: "APPROVED", message: "ショート動画で紹介したいです", postUrl: "", postReach: 0 },
    { id: "a3", campaignId: "c1", influencerId: "inf-rina", status: "APPLIED", message: "敏感肌レビュー得意です", postUrl: "", postReach: 0 },
    { id: "a4", campaignId: "c2", influencerId: "inf-aoi", status: "APPROVED", message: "", postUrl: "", postReach: 0 },
    { id: "a5", campaignId: "c2", influencerId: "inf-rina", status: "SUBMITTED", message: "", postUrl: "https://www.instagram.com/p/demo-rina", postReach: 7200 },
  ],
  favorites: { "inf-aoi": ["c2"] },
  transactions: [
    { id: "t1", influencerId: "inf-aoi", campaignId: "c2", amountYen: 5000, date: "2026/05/20", status: "振込済み" },
  ],
  inbox: [
    { from: "staff", text: "Sunnyway をご利用いただきありがとうございます！ご不明な点はお気軽にどうぞ☀️", time: "06/01 10:00" },
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

function logAudit() {} // （運営監査）デモでは省略のためダッシュボードの固定ログを使用
state.audit = [
  { actor: "Sunnyway 運営", action: "campaign.create", when: "06/08 10:20" },
  { actor: "Sunnyway 運営", action: "application.decide", when: "06/08 11:05" },
  { actor: "Sunnyway 運営", action: "payout.complete", when: "06/08 12:30" },
];
function pushAudit(action) {
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
        <h1 class="text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl">ここに掲載すれば、<br><span class="text-sunny-500">何人ものインフルエンサー</span>が<br>あなたのコスメを取り上げる。</h1>
        <p class="mx-auto mt-6 max-w-2xl text-base text-gray-600 sm:text-lg">コスメブランドとインフルエンサーをつなぐマッチングプラットフォーム。掲載から投稿・成果レポート・報酬の振込までを一気通貫で。</p>
        <div class="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button class="btn-primary px-6 py-3 text-base" data-act="nav" data-href="#/app">✨ インフルエンサーとして使う</button>
          <button class="btn-ghost px-6 py-3 text-base" data-act="nav" data-href="#/admin">☀️ 運営（Sunnyway）管理を見る</button>
        </div>
        <p class="mt-3 text-xs text-gray-400">※ 2つの視点を自由に行き来できます（操作は相互に反映）</p>
      </div>
    </section>
    <section class="mx-auto max-w-5xl px-6 py-14">
      <h2 class="text-center text-2xl font-bold text-gray-900">仕組み（3者）</h2>
      <div class="mt-8 grid gap-6 md:grid-cols-3">
        ${roleCard("☀️", "Sunnyway（運営）", "掲載を代理作成し、インフルを束ね、成果をレポート、報酬を振込。", "管理Web・セキュア")}
        ${roleCard("💄", "コスメブランド", "掲載してもらう顧客。管理権限は持たず運営が代理。", "管理画面なし")}
        ${roleCard("✨", "インフルエンサー", "案件に応募→採用→投稿→報酬。実績がレポートに反映。", "スマホアプリ")}
      </div>
    </section>
    <footer class="border-t border-gray-200 py-8 text-center text-sm text-gray-500">© ${new Date().getFullYear()} Sunnyway ・ デモ（データは保存されません）</footer>
  </main>`;
}
function roleCard(emoji, title, desc, tag) {
  return `<div class="card p-6"><div class="text-3xl">${emoji}</div><h3 class="mt-3 text-lg font-semibold text-gray-900">${title}</h3><p class="mt-2 text-sm text-gray-600">${desc}</p><span class="badge mt-4 bg-sunny-100 text-sunny-700">${tag}</span></div>`;
}

// ============================================================
// インフルエンサーアプリ（全画面・bibico 上位互換）
// ============================================================
function appShell(active, header, body) {
  return `<div class="flex min-h-[100dvh] flex-col bg-gray-50">
    ${header}
    <main class="flex-1 overflow-y-auto"><div class="mx-auto max-w-md">${body}</div></main>
    <nav class="sticky bottom-0 z-20 grid grid-cols-4 border-t border-gray-200 bg-white/95 backdrop-blur" style="padding-bottom:env(safe-area-inset-bottom)">
      ${navItem("#/app", "🔍", "案件を探す", active === "search")}
      ${navItem("#/app/manage", "🗂", "案件管理", active === "manage")}
      ${navItem("#/app/inbox", "💬", "お問い合わせ", active === "inbox")}
      ${navItem("#/app/me", "👤", "マイページ", active === "me")}
    </nav>
  </div>`;
}
function navItem(href, icon, label, active) {
  return `<button data-act="nav" data-href="${href}" class="flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium ${active ? "text-sunny-600" : "text-gray-400"}"><span class="text-lg">${icon}</span>${label}</button>`;
}
function appHeader(title, right) {
  return `<header class="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3" style="padding-top:max(0.75rem,env(safe-area-inset-top))"><h1 class="text-lg font-bold text-gray-900">${title}</h1>${right || ""}</header>`;
}

let mgTab = "todo"; // 案件管理のサブタブ

function renderInfluencer(h) {
  if (h.startsWith("#/app/manage")) return void (root.innerHTML = appShell("manage", appHeader("案件管理", `<button class="text-sm font-medium text-sunny-600" data-act="nav" data-href="#/app/history">📄 応募履歴</button>`), viewManage()));
  if (h.startsWith("#/app/history")) return void (root.innerHTML = appShell("manage", appHeader("応募履歴", `<button class="text-sm text-gray-400" data-act="nav" data-href="#/app/manage">← 戻る</button>`), viewHistory()));
  if (h.startsWith("#/app/inbox")) return void (root.innerHTML = appShell("inbox", appHeader("お問い合わせ"), viewInbox()));
  if (h.startsWith("#/app/me/")) return void (root.innerHTML = appShell("me", appHeader(meSubTitle(h), `<button class="text-sm text-gray-400" data-act="nav" data-href="#/app/me">← 戻る</button>`), viewMeSub(h)));
  if (h.startsWith("#/app/me")) return void (root.innerHTML = appShell("me", appHeader("マイページ"), viewMe()));
  // 既定: 案件を探す
  const right = `<button class="text-xl" data-act="nav" data-href="#/app/inbox" title="通知">🔔</button>`;
  root.innerHTML = appShell("search", appHeader("案件を探す", right), viewSearch());
}

// ---- 案件を探す ----
let searchFilter = "すべて";
function viewSearch() {
  const cats = ["すべて", "スキンケア", "メイクアップ", "顔出し不要", "報酬あり"];
  const open = state.campaigns.filter((c) => c.status === "OPEN");
  const match = (c) => {
    if (searchFilter === "すべて") return true;
    if (searchFilter === "顔出し不要") return c.tags.includes("顔出し不要");
    if (searchFilter === "報酬あり") return c.rewardType === "PAID" || c.rewardType === "BOTH";
    return product(c.productId).category === searchFilter;
  };
  const list = open.filter(match);
  const medias = [...new Set(list.map((c) => c.media))];
  const groups = medias.map((m) => `
    <section class="mt-5">
      <h2 class="mb-2 flex items-center gap-2 px-4 text-sm font-bold text-gray-800"><span class="text-base">📸</span>${m}</h2>
      <div class="flex gap-3 overflow-x-auto px-4 pb-1">${list.filter((c) => c.media === m).map(searchCard).join("")}</div>
    </section>`).join("");
  return `
    <div class="px-4 pt-3">
      <div class="rounded-2xl bg-gradient-to-r from-sunny-400 to-sunny-600 p-4 text-white">
        <p class="text-xs font-semibold opacity-90">毎月開催 ☀️</p>
        <p class="mt-0.5 text-lg font-bold leading-snug">Sunnyway Monthly<br>ベスト投稿アワード</p>
        <p class="mt-1 text-xs opacity-90">最優秀に最大 ¥50,000</p>
      </div>
    </div>
    <div class="mt-3 flex gap-2 overflow-x-auto px-4 pb-1">
      ${cats.map((c) => `<button data-act="filter" data-cat="${c}" class="badge whitespace-nowrap border ${searchFilter === c ? "border-sunny-500 bg-sunny-50 text-sunny-700" : "border-gray-200 bg-white text-gray-600"}">${c}</button>`).join("")}
    </div>
    ${list.length ? groups : `<p class="px-4 py-16 text-center text-sm text-gray-400">条件に合う案件がありません</p>`}
    <div class="h-4"></div>`;
}
function searchCard(c) {
  const p = product(c.productId), b = brand(c.brandId);
  const applied = c.applied + appsOf(c.id).length;
  const fav = myFavs().includes(c.id);
  const already = myApps().some((a) => a.campaignId === c.id);
  const rewardTxt = (c.rewardType === "PAID" || c.rewardType === "BOTH") && c.rewardYen > 0 ? `報酬: <b>${yen(c.rewardYen)}</b>` : c.rewardType === "OTHER" ? "報酬: その他" : "報酬: ¥0（現物提供）";
  return `<article class="relative w-60 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-white">
    <button class="block w-full" data-act="open-campaign" data-id="${c.id}"><div class="flex h-36 items-center justify-center bg-sunny-50 text-6xl">${p.emoji}</div></button>
    ${c.tags[0] ? `<span class="badge absolute left-2 top-2 bg-rose-500 text-white">${c.tags[0]}</span>` : ""}
    <button class="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-sm shadow" data-act="fav" data-id="${c.id}">${fav ? "❤️" : "🤍"}</button>
    <div class="p-3 text-left">
      <p class="text-xs text-gray-500">${b.name}</p>
      <h3 class="mt-0.5 line-clamp-2 text-sm font-semibold text-gray-900">${c.title}</h3>
      <p class="mt-1 text-sm font-bold text-sunny-600">${rewardTxt}</p>
      <div class="mt-2 rounded-lg bg-gray-50 p-2 text-xs text-gray-600">
        <div class="flex justify-between"><span>募集: ${c.target}名</span><span class="font-medium text-sky-600">応募: ${applied}名</span></div>
        <div class="mt-0.5">募集終了日: ${c.deadline}</div>
      </div>
      <button class="btn-primary mt-2 w-full text-xs ${already ? "pointer-events-none opacity-50" : ""}" data-act="apply" data-id="${c.id}">${already ? "応募済み" : "応募する"}</button>
    </div>
  </article>`;
}

// ---- 案件管理 ----
function viewManage() {
  const tabs = [["todo", "やること"], ["review", "チェック中"], ["done", "終了案件"]];
  const apps = myApps();
  const buckets = {
    todo: apps.filter((a) => a.status === "APPROVED"),
    review: apps.filter((a) => a.status === "SUBMITTED"),
    done: apps.filter((a) => a.status === "COMPLETED"),
  };
  const cur = buckets[mgTab];
  const body = cur.length ? cur.map((a) => manageCard(a, mgTab)).join("") : emptyState(mgTab === "todo" ? "「やること」はありません" : mgTab === "review" ? "チェック中の案件はありません" : "終了した案件はありません");
  return `
    <div class="sticky top-0 z-10 grid grid-cols-3 border-b border-gray-200 bg-white">
      ${tabs.map(([k, label]) => `<button data-act="mgtab" data-tab="${k}" class="border-b-2 py-3 text-sm font-medium ${mgTab === k ? "border-sunny-500 text-sunny-600" : "border-transparent text-gray-400"}">${label}${buckets[k].length ? ` <span class="ml-0.5 rounded-full bg-gray-100 px-1.5 text-xs">${buckets[k].length}</span>` : ""}</button>`).join("")}
    </div>
    <div class="space-y-3 p-4">${body}</div>`;
}
function manageCard(a, tab) {
  const c = campaign(a.campaignId), p = product(c.productId), b = brand(c.brandId);
  let action = "";
  if (tab === "todo") {
    action = `<div class="mt-3 space-y-2 border-t border-gray-100 pt-3">
      <p class="text-xs font-medium text-gray-500">投稿したら URL を提出してください</p>
      <input class="input" id="url-${a.id}" placeholder="https://www.instagram.com/p/…" value="${a.postUrl}">
      <input class="input" id="reach-${a.id}" type="number" min="0" placeholder="リーチ / 表示回数" value="${a.postReach || ""}">
      <button class="btn-primary w-full" data-act="submit" data-id="${a.id}">投稿を提出する</button></div>`;
  } else if (tab === "review") {
    action = `<p class="mt-3 border-t border-gray-100 pt-3 text-xs text-gray-500">運営が確認中です。<a href="${a.postUrl}" target="_blank" rel="noreferrer" class="text-sunny-600 underline">提出した投稿</a> ・ リーチ ${fmt(a.postReach)}<button class="ml-1 font-semibold text-sunny-600 underline" data-act="sim-confirm" data-id="${a.id}">［デモ：運営の確認を進める］</button></p>`;
  } else {
    const tx = state.transactions.find((t) => t.campaignId === a.campaignId && t.influencerId === a.influencerId);
    action = `<p class="mt-3 border-t border-gray-100 pt-3 text-xs text-gray-600">✅ 完了 ・ リーチ ${fmt(a.postReach)}${tx ? ` ・ 報酬 ${yen(tx.amountYen)}（${tx.status}）` : c.rewardType === "GIFTING" ? " ・ 現物提供" : ""}</p>`;
  }
  return `<div class="card p-4"><div class="flex items-start justify-between gap-2">
      <div class="min-w-0"><p class="truncate font-semibold text-gray-900">${c.title}</p><p class="truncate text-xs text-gray-500">${b.name} / ${p.name} ・ ${REWARD[c.rewardType]}</p></div>
      <span class="badge ${badgeClass(a.status)}">${ASTATUS[a.status]}</span></div>${action}</div>`;
}
function emptyState(msg) {
  return `<div class="flex flex-col items-center justify-center gap-3 py-16 text-center"><div class="text-5xl opacity-80">☀️</div><p class="text-sm text-gray-400">${msg}</p></div>`;
}

// ---- 応募履歴 ----
function viewHistory() {
  const apps = myApps();
  if (!apps.length) return emptyState("応募履歴はありません");
  return `<ul class="divide-y divide-gray-100">${apps.map((a) => {
    const c = campaign(a.campaignId);
    return `<li class="flex items-center justify-between gap-2 px-4 py-3"><div class="min-w-0"><p class="truncate text-sm font-medium text-gray-900">${c.title}</p><p class="truncate text-xs text-gray-500">${brand(c.brandId).name}</p></div><span class="badge ${badgeClass(a.status)}">${ASTATUS[a.status]}</span></li>`;
  }).join("")}</ul>`;
}

// ---- お問い合わせ ----
function viewInbox() {
  const msgs = state.inbox.map((m) => m.from === "me"
    ? `<div class="flex justify-end"><div class="max-w-[80%] rounded-2xl rounded-br-sm bg-sunny-500 px-3 py-2 text-sm text-white">${m.text}</div></div>`
    : `<div class="flex items-start gap-2"><div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sunny-100 text-sm">☀️</div><div class="max-w-[80%] rounded-2xl rounded-bl-sm bg-white px-3 py-2 text-sm text-gray-800 shadow-sm">${m.text}</div></div>`).join("");
  return `<div class="flex h-[calc(100dvh-7.5rem)] flex-col">
    <div class="border-b border-gray-100 bg-white px-4 py-2 text-sm font-medium text-gray-700">[運営] Sunnyway 公式</div>
    <div class="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-4">${msgs}</div>
    <div class="flex items-center gap-2 border-t border-gray-200 bg-white p-3">
      <input class="input flex-1" id="chat-input" placeholder="メッセージを入力…">
      <button class="btn-primary" data-act="send-msg">送信</button>
    </div></div>`;
}

// ---- マイページ ----
function viewMe() {
  const me = influencer(state.me);
  const items = [
    ["profile", "プロフィールを編集する"],
    ["address", "住所を編集する"],
    ["sns", "SNSアカウントを連携する"],
    ["bank", "振込先の編集をする"],
    ["transactions", "取引履歴"],
    ["notify", "通知の設定"],
  ];
  return `
    <div class="flex flex-col items-center py-7">
      <div class="flex h-20 w-20 items-center justify-center rounded-full bg-sunny-100 text-4xl">✨</div>
      <p class="mt-3 font-bold text-gray-900">${me.name}</p>
      <p class="text-xs text-gray-500">@${me.handle} ・ フォロワー ${fmt(me.followers)}</p>
    </div>
    <h2 class="px-4 pb-2 text-sm font-bold text-gray-700">アカウントの設定</h2>
    <div class="mx-4 overflow-hidden rounded-xl border border-gray-200 bg-white">
      ${items.map(([k, label], i) => `<button data-act="nav" data-href="#/app/me/${k}" class="flex w-full items-center justify-between px-4 py-3.5 text-left text-sm text-gray-800 ${i ? "border-t border-gray-100" : ""}">${label}${k === "notify" ? `<span class="text-xs ${me.notify ? "text-green-600" : "text-rose-500"}">${me.notify ? "ON" : "プッシュ通知をONにしよう"} ›</span>` : `<span class="text-gray-300">›</span>`}</button>`).join("")}
    </div>
    <h2 class="px-4 pb-2 pt-6 text-sm font-bold text-gray-700">サポート</h2>
    <div class="mx-4 overflow-hidden rounded-xl border border-gray-200 bg-white">
      <button data-act="nav" data-href="#/app/inbox" class="flex w-full items-center justify-between px-4 py-3.5 text-left text-sm text-gray-800">お問い合わせ<span class="text-gray-300">›</span></button>
    </div>
    <div class="mx-4 mt-6 rounded-xl border border-dashed border-sunny-300 bg-sunny-50 p-4">
      <p class="text-xs font-semibold text-sunny-700">デモ操作</p>
      <div class="mt-2 flex items-center gap-2">
        <select class="input flex-1" data-act="switch-influencer">${state.influencers.map((i) => `<option value="${i.id}" ${i.id === state.me ? "selected" : ""}>@${i.handle} で見る</option>`).join("")}</select>
        <button class="btn-ghost shrink-0 text-sm" data-act="nav" data-href="#/admin">運営画面へ</button>
      </div>
    </div>
    <div class="h-6"></div>`;
}
function meSubTitle(h) {
  return { profile: "プロフィール編集", address: "住所の編集", sns: "SNS連携", bank: "振込先の編集", transactions: "取引履歴", notify: "通知の設定" }[h.split("/")[3]] || "設定";
}
function viewMeSub(h) {
  const me = influencer(state.me);
  const key = h.split("/")[3];
  if (key === "profile") return `<div class="space-y-3 p-4">
      <div><label class="label">表示名</label><input class="input" id="f-name" value="${me.name}"></div>
      <div><label class="label">フォロワー数</label><input class="input" type="number" id="f-followers" value="${me.followers}"></div>
      <div><label class="label">自己紹介</label><textarea class="input" id="f-bio" rows="3">${me.bio}</textarea></div>
      <button class="btn-primary w-full" data-act="save-profile">保存する</button></div>`;
  if (key === "address") return `<div class="space-y-3 p-4">
      <p class="rounded-lg bg-sunny-50 px-3 py-2 text-xs text-sunny-800">ギフティング（現物提供）の発送先に使用します。</p>
      <div><label class="label">住所</label><textarea class="input" id="f-address" rows="3" placeholder="〒 都道府県 市区町村 番地…">${me.address}</textarea></div>
      <button class="btn-primary w-full" data-act="save-address">保存する</button></div>`;
  if (key === "sns") return `<div class="space-y-3 p-4">
      ${snsRow("instagram", "Instagram", me.igLinked)}${snsRow("tiktok", "TikTok", me.ttLinked)}
      <p class="text-xs text-gray-400">連携するとフォロワー数やリーチを自動取得します（デモ）。</p></div>`;
  if (key === "bank") return `<div class="space-y-3 p-4">
      <p class="rounded-lg bg-sunny-50 px-3 py-2 text-xs text-sunny-800">金銭報酬の振込先です。完了案件の報酬がここに振り込まれます。</p>
      <div><label class="label">振込先（銀行・支店・口座）</label><textarea class="input" id="f-bank" rows="2" placeholder="例）みずほ銀行 渋谷支店 普通 1234567">${me.bank}</textarea></div>
      <button class="btn-primary w-full" data-act="save-bank">保存する</button></div>`;
  if (key === "transactions") {
    const tx = state.transactions.filter((t) => t.influencerId === state.me);
    return `<div class="p-4">${tx.length ? `<ul class="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 bg-white">${tx.map((t) => `<li class="flex items-center justify-between px-4 py-3"><div><p class="text-sm font-medium text-gray-900">${campaign(t.campaignId) ? campaign(t.campaignId).title : "案件報酬"}</p><p class="text-xs text-gray-400">${t.date}</p></div><div class="text-right"><p class="font-bold text-gray-900">${yen(t.amountYen)}</p><span class="badge ${t.status === "振込済み" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}">${t.status}</span></div></li>`).join("")}</ul>` : emptyState("取引履歴はまだありません")}</div>`;
  }
  if (key === "notify") return `<div class="space-y-3 p-4">
      <div class="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3"><div><p class="text-sm font-medium text-gray-900">プッシュ通知</p><p class="text-xs text-gray-400">採用・運営からの連絡・報酬振込をお知らせ</p></div>
      <button data-act="toggle-notify" class="rounded-full px-3 py-1 text-xs font-semibold ${me.notify ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}">${me.notify ? "ON" : "OFF"}</button></div></div>`;
  return `<div class="p-4 text-sm text-gray-500">設定</div>`;
}
function snsRow(key, label, linked) {
  return `<div class="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3"><span class="text-sm font-medium text-gray-900">${label}</span><button data-act="toggle-sns" data-sns="${key}" class="rounded-full px-3 py-1 text-xs font-semibold ${linked ? "bg-green-100 text-green-700" : "bg-sunny-500 text-white"}">${linked ? "連携済み" : "連携する"}</button></div>`;
}

// ============================================================
// 運営管理（Web）
// ============================================================
const ADMIN_NAV = [["#/admin", "ダッシュボード"], ["#/admin/campaigns", "掲載（キャンペーン）"], ["#/admin/brands", "ブランド"], ["#/admin/influencers", "インフルエンサー"]];
function adminShell(active, body) {
  return `<div class="min-h-[100dvh] lg:flex">
    <aside class="border-b border-gray-200 bg-white lg:w-60 lg:shrink-0 lg:border-b-0 lg:border-r">
      <div class="px-5 py-4"><button class="flex items-center gap-2" data-act="nav" data-href="#/"><span class="text-xl">☀️</span><span class="font-bold text-gray-900">Sunnyway 管理</span></button><span class="badge mt-2 inline-flex bg-sunny-100 text-sunny-700">運営者でログイン中</span></div>
      <nav class="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col">${ADMIN_NAV.map(([href, label]) => `<button data-act="nav" data-href="${href}" class="whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm font-medium ${active === href ? "bg-sunny-50 text-sunny-700" : "text-gray-600 hover:bg-sunny-50 hover:text-sunny-700"}">${label}</button>`).join("")}</nav>
      <div class="hidden border-t border-gray-200 p-3 lg:block"><button class="btn-ghost w-full text-sm" data-act="nav" data-href="#/">← 視点を切り替え</button></div>
    </aside>
    <main class="flex-1 px-5 py-6 lg:px-10 lg:py-8">${body}</main></div>`;
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
function pageHeader(t, d) { return `<div class="mb-6"><h1 class="text-2xl font-bold text-gray-900">${t}</h1>${d ? `<p class="mt-1 text-sm text-gray-500">${d}</p>` : ""}</div>`; }
function stat(label, value, sub) { return `<div class="card p-5"><div class="text-sm text-gray-500">${label}</div><div class="mt-1 text-3xl font-bold text-gray-900">${value}</div>${sub ? `<div class="mt-1 text-xs text-gray-400">${sub}</div>` : ""}</div>`; }

function adminDashboard() {
  const openC = state.campaigns.filter((c) => c.status === "OPEN").length;
  const postedAll = state.applications.filter(isPosted);
  const totalReach = postedAll.reduce((s, a) => s + a.postReach, 0);
  const paidOut = state.transactions.filter((t) => t.status === "振込済み").reduce((s, t) => s + t.amountYen, 0);
  const recent = state.campaigns.slice().reverse().slice(0, 5);
  return pageHeader("ダッシュボード", "Sunnyway プラットフォーム全体のサマリー") + `
    <div class="grid grid-cols-2 gap-4 lg:grid-cols-3">
      ${stat("登録ブランド", state.brands.length)}${stat("インフルエンサー", state.influencers.length)}${stat("募集中の掲載", openC)}
      ${stat("取り上げ件数（投稿）", postedAll.length)}${stat("合計リーチ", fmt(totalReach))}${stat("報酬支払額", yen(paidOut), "振込済みの総額")}
    </div>
    <div class="mt-8 grid gap-6 lg:grid-cols-2">
      <section class="card p-5"><div class="mb-3 flex items-center justify-between"><h2 class="font-semibold text-gray-900">最近の掲載</h2><button class="text-sm font-medium text-sunny-600" data-act="nav" data-href="#/admin/campaigns">すべて見る →</button></div>
        <ul class="divide-y divide-gray-100">${recent.map((c) => `<li class="py-3"><button class="flex w-full items-center justify-between gap-3 text-left hover:opacity-80" data-act="nav" data-href="#/admin/campaigns/${c.id}"><div class="min-w-0"><p class="truncate font-medium text-gray-900">${c.title}</p><p class="truncate text-xs text-gray-500">${brand(c.brandId).name} ・ ${REWARD[c.rewardType]}</p></div><div class="flex shrink-0 items-center gap-2"><span class="text-sm font-semibold text-sunny-600">${postedApps(c.id).length}/${c.target}人</span><span class="badge ${badgeClass(c.status)}">${CSTATUS[c.status]}</span></div></button></li>`).join("")}</ul></section>
      <section class="card p-5"><h2 class="mb-3 font-semibold text-gray-900">操作ログ（監査）</h2><ul class="space-y-2 text-sm">${state.audit.slice(0, 6).map((l) => `<li class="flex items-center justify-between gap-2"><span class="truncate text-gray-700"><span class="font-mono text-xs text-sunny-700">${l.action}</span> by ${l.actor}</span><span class="shrink-0 text-xs text-gray-400">${l.when}</span></li>`).join("")}</ul></section>
    </div>`;
}
function adminCampaigns() {
  const rows = state.campaigns.slice().reverse().map((c) => {
    const pc = postedApps(c.id).length, pct = Math.min(100, Math.round((pc / Math.max(1, c.target)) * 100));
    return `<button class="card flex w-full flex-col gap-3 p-5 text-left transition hover:border-sunny-300 sm:flex-row sm:items-center sm:justify-between" data-act="nav" data-href="#/admin/campaigns/${c.id}"><div class="min-w-0"><div class="flex items-center gap-2"><h3 class="truncate font-semibold text-gray-900">${c.title}</h3><span class="badge ${badgeClass(c.status)}">${CSTATUS[c.status]}</span></div><p class="mt-0.5 truncate text-sm text-gray-500">${brand(c.brandId).name} / ${product(c.productId).name} ・ ${REWARD[c.rewardType]}</p></div><div class="sm:w-64"><div class="flex items-center justify-between text-sm"><span class="text-gray-500">取り上げ</span><span class="font-semibold text-gray-900">${pc}/${c.target}人</span></div><div class="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-100"><div class="h-full rounded-full bg-sunny-500" style="width:${pct}%"></div></div><p class="mt-1 text-right text-xs text-gray-400">応募 ${appsOf(c.id).length}件</p></div></button>`;
  }).join("");
  return pageHeader("掲載（キャンペーン）", "「ここに掲載すれば◯人が取り上げます」の単位。運営が代理で作成。") + `<div class="space-y-3">${rows}</div>`;
}
function adminReport(id) {
  const c = campaign(id);
  if (!c) return pageHeader("見つかりません") + `<button class="btn-ghost" data-act="nav" data-href="#/admin/campaigns">← 戻る</button>`;
  const b = brand(c.brandId), p = product(c.productId), apps = appsOf(id);
  const pc = postedApps(id), reach = reachOf(id);
  const approvedCnt = apps.filter((a) => a.status === "APPROVED").length + pc.length;
  const appliedCnt = apps.filter((a) => a.status === "APPLIED").length;
  const rows = [["報酬タイプ", REWARD[c.rewardType] + (c.rewardType === "OTHER" && c.rewardNote ? `（${c.rewardNote}）` : "")], c.rewardYen > 0 ? ["1人あたり報酬", yen(c.rewardYen)] : null, ["収益モデル", c.billing.map((x) => BILLING[x]).join(" / ")], c.fee > 0 ? ["キャンペーン費用", yen(c.fee)] : null, c.commission > 0 ? ["販売手数料率", c.commission + "%"] : null].filter(Boolean).map(([k, v]) => `<div class="flex justify-between gap-3"><dt class="text-gray-500">${k}</dt><dd class="text-right font-medium text-gray-800">${v}</dd></div>`).join("");
  const appList = apps.length ? apps.map((a) => {
    const inf = influencer(a.influencerId);
    let actions = "";
    if (a.status === "APPLIED") actions = `<div class="flex shrink-0 gap-2"><button class="btn-primary text-xs" data-act="approve" data-id="${a.id}">採用</button><button class="btn-ghost text-xs" data-act="reject" data-id="${a.id}">不採用</button></div>`;
    else if (a.status === "SUBMITTED") actions = `<div class="flex shrink-0 gap-2"><button class="btn-primary text-xs" data-act="confirm" data-id="${a.id}">確認OK・完了</button><button class="btn-ghost text-xs" data-act="sendback" data-id="${a.id}">差し戻し</button></div>`;
    return `<li class="py-3"><div class="flex flex-wrap items-center justify-between gap-2"><div class="min-w-0"><div class="flex items-center gap-2"><span class="font-medium text-gray-900">@${inf.handle}</span><span class="badge ${badgeClass(a.status)}">${ASTATUS[a.status]}</span></div><p class="text-xs text-gray-500">${inf.name} ・ フォロワー ${fmt(inf.followers)}</p>${a.message ? `<p class="mt-1 text-sm text-gray-600">「${a.message}」</p>` : ""}${isPosted(a) ? `<p class="mt-1 text-sm"><a href="${a.postUrl}" target="_blank" rel="noreferrer" class="text-sunny-600 underline">投稿を見る</a> <span class="text-gray-500">・ リーチ ${fmt(a.postReach)}</span></p>` : ""}</div>${actions}</div></li>`;
  }).join("") : `<p class="py-6 text-center text-sm text-gray-400">まだ応募はありません。</p>`;
  return `<button class="text-sm text-gray-500 hover:text-gray-700" data-act="nav" data-href="#/admin/campaigns">← 掲載一覧へ</button>
    <div class="mb-6 mt-2 flex flex-wrap items-end justify-between gap-3"><div><h1 class="text-2xl font-bold text-gray-900">${c.title}</h1><p class="mt-1 text-sm text-gray-500">${b.name} / ${p.name}</p></div><span class="badge ${badgeClass(c.status)}">${CSTATUS[c.status]}</span></div>
    <div class="card mb-6 bg-gradient-to-r from-sunny-50 to-white p-6"><p class="text-sm text-gray-600">この掲載の成果</p><p class="mt-1 text-3xl font-bold text-gray-900"><span class="text-sunny-600">${pc.length}人</span>のインフルエンサーが取り上げました</p><p class="mt-1 text-sm text-gray-500">目標 ${c.target}人 ・ 合計リーチ ${fmt(reach)}</p></div>
    <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">${stat("応募", apps.length)}${stat("採用", approvedCnt)}${stat("取り上げ", pc.length)}${stat("合計リーチ", fmt(reach))}</div>
    <div class="mt-6 grid gap-6 lg:grid-cols-3">
      <section class="card p-5 lg:col-span-1"><h2 class="mb-3 font-semibold text-gray-900">掲載・課金情報</h2><dl class="space-y-2 text-sm">${rows}</dl><h3 class="mb-1 mt-4 text-sm font-medium text-gray-700">依頼内容</h3><p class="text-sm text-gray-600">${c.brief}</p></section>
      <section class="card p-5 lg:col-span-2"><h2 class="mb-3 font-semibold text-gray-900">応募・取り上げ実績</h2>${appliedCnt > 0 ? `<p class="mb-3 rounded-lg bg-sunny-50 px-3 py-2 text-sm text-sunny-800">未対応の応募が ${appliedCnt} 件。採用すると参加確定です。</p>` : ""}<ul class="divide-y divide-gray-100">${appList}</ul></section>
    </div>`;
}
function adminBrands() {
  const rows = state.brands.map((b) => `<tr class="hover:bg-gray-50"><td class="px-4 py-3"><div class="font-medium text-gray-900">${b.name}</div><div class="text-xs text-gray-400">${b.notes}</div></td><td class="px-4 py-3 text-gray-600">${b.contactName || "—"}<div class="text-xs text-gray-400">${b.contactEmail}</div></td><td class="px-4 py-3 text-gray-600">${b.monthlyFeeYen > 0 ? yen(b.monthlyFeeYen) : "—"}</td><td class="px-4 py-3 text-center">${state.products.filter((p) => p.brandId === b.id).length}</td><td class="px-4 py-3 text-center">${state.campaigns.filter((c) => c.brandId === b.id).length}</td></tr>`).join("");
  return pageHeader("ブランド", "ブランドは運営が管理（ブランド自身は管理画面に入れません）") + `<div class="card overflow-x-auto"><table class="w-full text-sm"><thead class="bg-gray-50 text-left text-xs uppercase text-gray-500"><tr><th class="px-4 py-3">ブランド</th><th class="px-4 py-3">担当者</th><th class="px-4 py-3">月額</th><th class="px-4 py-3 text-center">商品</th><th class="px-4 py-3 text-center">掲載</th></tr></thead><tbody class="divide-y divide-gray-100">${rows}</tbody></table></div>`;
}
function adminInfluencers() {
  const rows = state.influencers.map((inf) => {
    const mine = state.applications.filter((a) => a.influencerId === inf.id), pc = mine.filter(isPosted);
    return `<tr class="hover:bg-gray-50"><td class="px-4 py-3"><div class="flex items-center gap-2 font-medium text-gray-900">@${inf.handle}${inf.verified ? `<span class="badge bg-sunny-100 text-sunny-700">認証済</span>` : ""}</div><div class="text-xs text-gray-400">${inf.name}</div></td><td class="px-4 py-3 text-gray-600">${PLATFORM[inf.platform]}</td><td class="px-4 py-3 text-right text-gray-600">${fmt(inf.followers)}</td><td class="px-4 py-3 text-center text-gray-600">${mine.length}</td><td class="px-4 py-3 text-center font-semibold text-sunny-600">${pc.length}</td><td class="px-4 py-3 text-right text-gray-600">${fmt(pc.reduce((s, a) => s + a.postReach, 0))}</td></tr>`;
  }).join("");
  return pageHeader("インフルエンサー", "アプリから登録したインフルエンサーの一覧と実績") + `<div class="card overflow-x-auto"><table class="w-full text-sm"><thead class="bg-gray-50 text-left text-xs uppercase text-gray-500"><tr><th class="px-4 py-3">ハンドル</th><th class="px-4 py-3">媒体</th><th class="px-4 py-3 text-right">フォロワー</th><th class="px-4 py-3 text-center">応募</th><th class="px-4 py-3 text-center">取り上げ</th><th class="px-4 py-3 text-right">累計リーチ</th></tr></thead><tbody class="divide-y divide-gray-100">${rows}</tbody></table></div>`;
}

// ============================================================
// イベント
// ============================================================
function toast(msg) {
  let el = document.getElementById("toast");
  if (!el) { el = document.createElement("div"); el.id = "toast"; el.className = "fixed left-1/2 z-50 -translate-x-1/2 rounded-full bg-gray-900/90 px-4 py-2 text-sm text-white opacity-0 transition"; el.style.bottom = "88px"; document.body.appendChild(el); }
  el.textContent = msg; el.style.opacity = "1"; clearTimeout(el._t); el._t = setTimeout(() => (el.style.opacity = "0"), 1800);
}
function completeApp(a) { // SUBMITTED -> COMPLETED（必要なら振込）
  a.status = "COMPLETED";
  const c = campaign(a.campaignId);
  if ((c.rewardType === "PAID" || c.rewardType === "BOTH") && c.rewardYen > 0 && !state.transactions.some((t) => t.campaignId === a.campaignId && t.influencerId === a.influencerId)) {
    const d = new Date();
    state.transactions.unshift({ id: uid("t"), influencerId: a.influencerId, campaignId: a.campaignId, amountYen: c.rewardYen, date: `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`, status: "振込済み" });
    pushAudit("payout.complete");
  } else pushAudit("application.complete");
}

document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-act]"); if (!t) return;
  const act = t.dataset.act, id = t.dataset.id;
  if (act === "nav") return go(t.dataset.href);
  if (act === "filter") { searchFilter = t.dataset.cat; render(); return; }
  if (act === "fav") { const f = myFavs(); const i = f.indexOf(id); i < 0 ? f.push(id) : f.splice(i, 1); render(); return; }
  if (act === "open-campaign") { return go("#/app"); } // デモ: カード画像タップは一覧維持
  if (act === "apply") {
    if (myApps().some((a) => a.campaignId === id)) return;
    state.applications.push({ id: uid("a"), campaignId: id, influencerId: state.me, status: "APPLIED", message: "", postUrl: "", postReach: 0 });
    toast("応募しました！「案件管理 → 応募履歴」で確認できます ✨"); render(); return;
  }
  if (act === "mgtab") { mgTab = t.dataset.tab; render(); return; }
  if (act === "sim-confirm") { const a = state.applications.find((x) => x.id === id); completeApp(a); toast("運営の確認が完了しました（デモ）"); render(); return; }
  if (act === "submit") {
    const url = (document.getElementById("url-" + id) || {}).value || "";
    const reach = parseInt((document.getElementById("reach-" + id) || {}).value || "0", 10);
    if (!url.trim()) return toast("投稿 URL を入力してください");
    const a = state.applications.find((x) => x.id === id); a.status = "SUBMITTED"; a.postUrl = url.trim(); a.postReach = reach || 0;
    mgTab = "review"; toast("投稿を提出しました。運営の確認をお待ちください"); render(); return;
  }
  if (act === "approve" || act === "reject") { const a = state.applications.find((x) => x.id === id); a.status = act === "approve" ? "APPROVED" : "REJECTED"; pushAudit("application.decide"); toast(act === "approve" ? "採用しました" : "不採用にしました"); render(); return; }
  if (act === "confirm") { const a = state.applications.find((x) => x.id === id); completeApp(a); toast("確認OK・完了にしました（報酬を振込）"); render(); return; }
  if (act === "sendback") { const a = state.applications.find((x) => x.id === id); a.status = "APPROVED"; toast("差し戻しました"); render(); return; }
  if (act === "send-msg") {
    const inp = document.getElementById("chat-input"); const txt = (inp.value || "").trim(); if (!txt) return;
    const now = new Date(); const tm = `${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    state.inbox.push({ from: "me", text: txt, time: tm });
    setTimeout(() => { state.inbox.push({ from: "staff", text: "お問い合わせありがとうございます！担当より追ってご連絡します☀️", time: tm }); render(); }, 600);
    render(); return;
  }
  if (act === "save-profile") { const me = influencer(state.me); me.name = val("f-name", me.name); me.followers = parseInt(val("f-followers", me.followers), 10) || 0; me.bio = val("f-bio", me.bio); toast("保存しました"); go("#/app/me"); return; }
  if (act === "save-address") { influencer(state.me).address = val("f-address", ""); toast("住所を保存しました"); go("#/app/me"); return; }
  if (act === "save-bank") { influencer(state.me).bank = val("f-bank", ""); toast("振込先を保存しました"); go("#/app/me"); return; }
  if (act === "toggle-sns") { const me = influencer(state.me); if (t.dataset.sns === "instagram") me.igLinked = !me.igLinked; else me.ttLinked = !me.ttLinked; render(); return; }
  if (act === "toggle-notify") { const me = influencer(state.me); me.notify = !me.notify; toast(me.notify ? "通知をONにしました" : "通知をOFFにしました"); render(); return; }
});
function val(id, d) { const el = document.getElementById(id); return el ? el.value : d; }

document.addEventListener("change", (e) => { const t = e.target.closest("[data-act='switch-influencer']"); if (!t) return; state.me = t.value; render(); });

// ---------- 初期化 + PWA ----------
render();
if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
