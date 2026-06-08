/* ============================================================
   Sunnyway インフルエンサーアプリ
   スプラッシュ → チュートリアル → ログイン → 本編（4タブ）
   ============================================================ */
const ME = "inf-aoi";
const root = document.getElementById("root");
const go = (h) => { location.hash = h; };
const seen = () => localStorage.getItem("sw_onboarded") === "1";
const authed = () => localStorage.getItem("sw_authed") === "1";

let phase = !seen() ? "onboard" : !authed() ? "auth" : "app";
let slide = 0;
let mgTab = "todo";
let searchFilter = "すべて";

function render() {
  window.scrollTo(0, 0);
  if (phase === "onboard") return renderOnboarding();
  if (phase === "auth") return renderAuth();
  renderApp(location.hash || "#/");
}
window.addEventListener("hashchange", () => { if (phase === "app") render(); });

// ============================================================
// オンボーディング（チュートリアル）
// ============================================================
const SLIDES = [
  { brand: true, title: "Sunnyway", sub: "好きなコスメで、つながる。" },
  { art: "serum", title: "好きなコスメに、出会う。", sub: "あなたに合った案件が、毎日届く。" },
  { art: "lipstick", title: "応募して、投稿するだけ。", sub: "面倒な手続きはなし。スマホひとつで完結。" },
  { art: "jar", title: "報酬は、まっすぐ届く。", sub: "ギフティングも金銭報酬も、振込まで一元管理。" },
];
function renderOnboarding() {
  const s = SLIDES[slide];
  const last = slide === SLIDES.length - 1;
  if (s.brand) {
    root.innerHTML = `<main class="fade flex min-h-[100dvh] flex-col items-center justify-center bg-sunrise px-8 text-center text-white">
      <div class="pop">${sunMark("h-24 w-24 shadow-lift")}</div>
      <h1 class="display mt-7 text-4xl font-semibold tracking-wide">Sunnyway</h1>
      <p class="mt-3 text-white/85">${s.sub}</p>
      <div class="mt-12 flex gap-2">${dots()}</div>
      <button class="mt-8 w-full max-w-xs rounded-full bg-white py-3.5 text-base font-semibold text-sunny-600 active:scale-[.98]" data-act="ob-next">はじめる</button>
    </main>`;
    return;
  }
  root.innerHTML = `<main class="fade flex min-h-[100dvh] flex-col bg-canvas px-7" style="padding-top:max(1rem,env(safe-area-inset-top))">
    <div class="flex justify-end py-2"><button class="rounded-full px-3 py-2 text-sm font-medium text-muted" data-act="ob-skip">スキップ</button></div>
    <div class="flex flex-1 flex-col items-center justify-center text-center">
      <div class="relative grid h-64 w-64 place-items-center rounded-[2.5rem] shadow-card" style="background:${product(slide === 1 ? "p-serum" : slide === 2 ? "p-lip" : "p-cream").tint}">
        <div class="text-ink/55"><svg class="h-32 w-32" viewBox="0 0 64 80" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ART[s.art]}</svg></div>
        <span class="absolute -right-3 -top-3 grid h-12 w-12 place-items-center rounded-2xl bg-surface text-sunny-500 shadow-soft">${ic(slide === 1 ? "heart" : slide === 2 ? "send" : "receipt", "h-6 w-6")}</span>
      </div>
      <h2 class="display mt-10 text-2xl font-semibold leading-snug text-ink">${s.title}</h2>
      <p class="mt-3 max-w-xs text-[15px] leading-relaxed text-muted">${s.sub}</p>
    </div>
    <div class="flex items-center justify-between pb-10" style="padding-bottom:max(2.5rem,env(safe-area-inset-bottom))">
      <div class="flex gap-2">${dots()}</div>
      <button class="btn-primary px-7" data-act="ob-next">${last ? "はじめる" : "次へ"} ${ic("chevron", "h-4 w-4")}</button>
    </div></main>`;
}
function dots() {
  return SLIDES.map((_, i) => `<span class="h-2 rounded-full transition-all ${i === slide ? "w-6 bg-sunny-500" : "w-2 bg-ink/15"}"></span>`).join("");
}

// ============================================================
// ログイン / 新規登録
// ============================================================
function renderAuth() {
  root.innerHTML = `<main class="fade flex min-h-[100dvh] flex-col bg-canvas px-7">
    <div class="flex flex-1 flex-col justify-center">
      <div class="mb-9 text-center">${sunMark("mx-auto h-16 w-16")}<h1 class="display mt-5 text-3xl font-semibold text-ink">はじめよう</h1><p class="mt-2 text-sm text-muted">数秒で登録。好きな案件にすぐ応募できます。</p></div>
      <div class="space-y-3">
        <button class="flex w-full items-center justify-center gap-2.5 rounded-full bg-ink py-3.5 text-base font-semibold text-white active:scale-[.99]" data-act="auth">${ic("insta", "h-5 w-5")} Instagram で続ける</button>
        <button class="flex w-full items-center justify-center gap-2.5 rounded-full border border-line bg-surface py-3.5 text-base font-semibold text-ink active:scale-[.99]" data-act="auth">${ic("mail", "h-5 w-5")} メールアドレスで続ける</button>
      </div>
      <div class="my-6 flex items-center gap-3 text-xs text-muted"><span class="h-px flex-1 bg-line"></span>すでにアカウントをお持ちの方<span class="h-px flex-1 bg-line"></span></div>
      <button class="w-full rounded-full bg-sunny-50 py-3.5 text-base font-semibold text-sunny-700 active:scale-[.99]" data-act="auth">ログイン</button>
    </div>
    <p class="pb-8 text-center text-[11px] leading-relaxed text-muted" style="padding-bottom:max(2rem,env(safe-area-inset-bottom))">続行することで <span class="underline">利用規約</span> と <span class="underline">プライバシーポリシー</span> に同意したものとみなされます。</p>
  </main>`;
}

// ============================================================
// 本編（4タブ）
// ============================================================
function appShell(active, header, body) {
  return `<div class="fade flex min-h-[100dvh] flex-col">${header}
    <main class="flex-1 overflow-y-auto"><div class="mx-auto max-w-md">${body}</div></main>
    <nav class="sticky bottom-0 z-20 flex border-t border-line bg-surface/85 backdrop-blur-xl" style="padding-bottom:env(safe-area-inset-bottom)">
      ${navItem("#/", "search", "さがす", active === "search")}${navItem("#/manage", "bag", "案件管理", active === "manage")}${navItem("#/inbox", "chat", "メッセージ", active === "inbox")}${navItem("#/me", "user", "マイ", active === "me")}
    </nav></div>`;
}
const navItem = (href, icon, label, on) => `<button data-act="nav" data-href="${href}" class="flex flex-1 flex-col items-center gap-1 py-2.5 ${on ? "text-sunny-600" : "text-muted"}">${ic(icon, "h-6 w-6")}<span class="text-[10px] font-medium tracking-wide">${label}</span></button>`;
const appHeader = (title, right) => `<header class="sticky top-0 z-20 flex items-center justify-between bg-canvas/80 px-5 pb-3 backdrop-blur-xl" style="padding-top:max(0.9rem,env(safe-area-inset-top))"><h1 class="display text-xl font-semibold text-ink">${title}</h1><div class="flex items-center gap-1">${right || ""}</div></header>`;
const subHeader = (title, back) => `<header class="sticky top-0 z-20 flex items-center gap-2 bg-canvas/80 px-3 pb-3 backdrop-blur-xl" style="padding-top:max(0.9rem,env(safe-area-inset-top))">${iconBtn("back", "nav", `data-href="${back}"`)}<h1 class="display text-lg font-semibold text-ink">${title}</h1></header>`;
const iconBtn = (icon, act, attrs = "") => `<button class="grid h-10 w-10 place-items-center rounded-full text-ink/65 hover:bg-ink/5" data-act="${act}" ${attrs}>${ic(icon, "h-5 w-5")}</button>`;

function renderApp(h) {
  if (h.startsWith("#/manage")) return void (root.innerHTML = appShell("manage", appHeader("案件管理", `<button class="rounded-full px-3 py-2 text-sm font-medium text-sunny-600 hover:bg-sunny-50" data-act="nav" data-href="#/history">応募履歴</button>`), viewManage()));
  if (h.startsWith("#/history")) return void (root.innerHTML = appShell("manage", subHeader("応募履歴", "#/manage"), viewHistory()));
  if (h.startsWith("#/inbox")) return void (root.innerHTML = appShell("inbox", appHeader("メッセージ"), viewInbox()));
  if (h.startsWith("#/me/")) return void (root.innerHTML = appShell("me", subHeader(meSubTitle(h), "#/me"), viewMeSub(h)));
  if (h.startsWith("#/me")) return void (root.innerHTML = appShell("me", appHeader("マイページ"), viewMe()));
  root.innerHTML = appShell("search", appHeader("さがす", iconBtn("bell", "nav", `data-href="#/inbox"`)), viewSearch());
}

// ---- さがす ----
function viewSearch() {
  const cats = ["すべて", "スキンケア", "メイクアップ", "顔出し不要", "報酬あり"];
  const open = S.campaigns.filter((c) => c.status === "OPEN");
  const match = (c) => searchFilter === "すべて" ? true : searchFilter === "顔出し不要" ? c.tags.includes("顔出し不要") : searchFilter === "報酬あり" ? (c.rewardType === "PAID" || c.rewardType === "BOTH") : product(c.productId).category === searchFilter;
  const list = open.filter(match);
  const medias = [...new Set(list.map((c) => c.media))];
  const groups = medias.map((m) => `<section class="mt-7"><div class="mb-3 flex items-baseline justify-between px-5"><h2 class="display text-base font-semibold text-ink">${m}</h2><span class="text-xs text-muted">${list.filter((c) => c.media === m).length}件</span></div><div class="flex snap-x gap-4 overflow-x-auto px-5 pb-2">${list.filter((c) => c.media === m).map(searchCard).join("")}</div></section>`).join("");
  return `<div class="px-5 pt-1"><div class="relative overflow-hidden rounded-3xl bg-sunrise p-6 text-white shadow-lift"><div class="absolute -right-6 -top-8 opacity-30">${ic("spark", "h-28 w-28", true)}</div><p class="text-xs font-semibold uppercase tracking-widest text-white/80">Monthly Award</p><p class="display mt-1 text-2xl font-semibold leading-snug">今月のベスト投稿に<br>最大 ¥50,000</p><div class="mt-4 flex gap-1.5">${[0, 1, 2].map((i) => `<span class="h-1.5 rounded-full ${i === 0 ? "w-6 bg-white" : "w-1.5 bg-white/50"}"></span>`).join("")}</div></div></div>
    <div class="mt-4 flex gap-2 overflow-x-auto px-5 pb-1">${cats.map((c) => `<button data-act="filter" data-cat="${c}" class="chip whitespace-nowrap ${searchFilter === c ? "bg-ink text-white" : "border border-line bg-surface text-ink/70"}">${c}</button>`).join("")}</div>
    ${list.length ? groups : `<p class="px-5 py-20 text-center text-sm text-muted">条件に合う案件がありません</p>`}<div class="h-6"></div>`;
}
function searchCard(c) {
  const p = product(c.productId), b = brand(c.brandId);
  const applied = c.applied + appsOf(c.id).length;
  const fav = favsOf(ME).includes(c.id);
  const already = appsByInf(ME).some((a) => a.campaignId === c.id);
  const rewardTxt = (c.rewardType === "PAID" || c.rewardType === "BOTH") && c.rewardYen > 0 ? yen(c.rewardYen) : c.rewardType === "OTHER" ? "特別報酬" : "ギフティング";
  return `<article class="w-[15.5rem] shrink-0 snap-start overflow-hidden rounded-3xl border border-line bg-surface shadow-soft transition hover:-translate-y-0.5 hover:shadow-card">
    <div class="relative"><button class="block w-full" data-act="open" data-id="${c.id}">${artTile(p, "h-44")}</button>${c.tags[0] ? `<span class="absolute left-3 top-3 badge bg-white/90 text-ink/80 backdrop-blur">${c.tags[0]}</span>` : ""}<button class="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/85 backdrop-blur transition active:scale-90 ${fav ? "text-sunny-500" : "text-ink/40"}" data-act="fav" data-id="${c.id}">${ic("heart", "h-5 w-5", fav)}</button></div>
    <div class="p-4"><p class="text-[11px] font-semibold uppercase tracking-wider text-muted">${b.name}</p><h3 class="mt-1 line-clamp-2 text-[15px] font-semibold leading-snug text-ink">${c.title}</h3>
      <div class="mt-3 flex items-center gap-1.5 text-sunny-600">${ic("spark", "h-4 w-4", true)}<span class="text-sm font-bold">${rewardTxt}</span></div>
      <div class="mt-3 flex items-center justify-between border-t border-line pt-3 text-xs text-muted"><span>応募 <b class="text-ink">${applied}</b>/${c.target}名</span><span>〆 ${c.deadline}</span></div>
      <button class="${already ? "btn-ghost pointer-events-none opacity-60" : "btn-primary"} mt-3 w-full py-2.5 text-sm" data-act="apply" data-id="${c.id}">${already ? "応募済み" : "応募する"}</button></div></article>`;
}

// ---- 案件管理 ----
function viewManage() {
  const tabs = [["todo", "やること"], ["review", "チェック中"], ["done", "完了"]];
  const apps = appsByInf(ME);
  const buckets = { todo: apps.filter((a) => a.status === "APPROVED"), review: apps.filter((a) => a.status === "SUBMITTED"), done: apps.filter((a) => a.status === "COMPLETED") };
  const cur = buckets[mgTab];
  const body = cur.length ? cur.map((a) => manageCard(a, mgTab)).join("") : emptyState(mgTab === "todo" ? "やることはありません" : mgTab === "review" ? "確認待ちの案件はありません" : "完了した案件はありません");
  return `<div class="px-5 pt-1"><div class="flex rounded-full bg-ink/5 p-1">${tabs.map(([k, label]) => `<button data-act="mgtab" data-tab="${k}" class="flex-1 rounded-full py-2 text-sm font-semibold transition ${mgTab === k ? "bg-surface text-ink shadow-soft" : "text-ink/50"}">${label}${buckets[k].length ? ` ${buckets[k].length}` : ""}</button>`).join("")}</div></div><div class="space-y-3 p-5">${body}</div>`;
}
function manageCard(a, tab) {
  const c = campaign(a.campaignId), p = product(c.productId), b = brand(c.brandId);
  let action = "";
  if (tab === "todo") action = `<div class="mt-4 space-y-2 border-t border-line pt-4"><p class="text-xs font-semibold text-muted">投稿 URL を提出</p><input class="input" id="url-${a.id}" placeholder="https://www.instagram.com/p/…" value="${a.postUrl}"><input class="input" id="reach-${a.id}" type="number" min="0" placeholder="リーチ / 表示回数" value="${a.postReach || ""}"><button class="btn-primary w-full" data-act="submit" data-id="${a.id}">提出する</button></div>`;
  else if (tab === "review") action = `<div class="mt-4 flex items-center gap-2 border-t border-line pt-4 text-xs text-muted">${ic("check", "h-4 w-4 text-amber-500")}運営が確認中・リーチ ${fmt(a.postReach)}</div>`;
  else { const tx = S.transactions.find((t) => t.campaignId === a.campaignId && t.influencerId === a.influencerId); action = `<div class="mt-4 flex items-center gap-2 border-t border-line pt-4 text-xs text-ink/70">${ic("check", "h-4 w-4 text-sunny-500")}完了・リーチ ${fmt(a.postReach)}${tx ? ` ・ 報酬 ${yen(tx.amountYen)}` : c.rewardType === "GIFTING" ? " ・ 現物提供" : ""}</div>`; }
  return `<div class="card overflow-hidden p-4"><div class="flex gap-3"><div class="h-16 w-16 shrink-0 overflow-hidden rounded-2xl">${artTile(p, "h-16")}</div><div class="min-w-0 flex-1"><div class="flex items-start justify-between gap-2"><p class="truncate font-semibold text-ink">${c.title}</p>${pill(ASTATUS[a.status], ASTYLE[a.status])}</div><p class="mt-0.5 truncate text-xs text-muted">${b.name} ・ ${REWARD[c.rewardType]}</p></div></div>${action}</div>`;
}
function emptyState(msg) {
  return `<div class="flex flex-col items-center justify-center gap-4 py-20 text-center"><div class="grid h-16 w-16 place-items-center rounded-full bg-sunny-50 text-sunny-300">${ic("bag", "h-8 w-8")}</div><p class="text-sm text-muted">${msg}</p><button class="btn-soft" data-act="nav" data-href="#/">案件をさがす</button></div>`;
}
function viewHistory() {
  const apps = appsByInf(ME);
  if (!apps.length) return emptyState("応募履歴はありません");
  return `<div class="space-y-2 p-5">${apps.map((a) => { const c = campaign(a.campaignId); return `<div class="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3"><div class="h-12 w-12 shrink-0 overflow-hidden rounded-xl">${artTile(product(c.productId), "h-12")}</div><div class="min-w-0 flex-1"><p class="truncate text-sm font-semibold text-ink">${c.title}</p><p class="truncate text-xs text-muted">${brand(c.brandId).name}</p></div>${pill(ASTATUS[a.status], ASTYLE[a.status])}</div>`; }).join("")}</div>`;
}

// ---- メッセージ ----
function viewInbox() {
  const msgs = S.inbox.map((m) => m.from === "me"
    ? `<div class="flex justify-end"><div class="max-w-[78%] rounded-2xl rounded-br-md bg-sunny-500 px-4 py-2.5 text-sm leading-relaxed text-white shadow-soft">${m.text}</div></div>`
    : `<div class="flex items-end gap-2">${sunMark("h-7 w-7")}<div class="max-w-[78%] rounded-2xl rounded-bl-md border border-line bg-surface px-4 py-2.5 text-sm leading-relaxed text-ink">${m.text}</div></div>`).join("");
  return `<div class="flex h-[calc(100dvh-7.5rem)] flex-col"><div class="flex items-center gap-2 border-b border-line px-5 py-2.5 text-sm font-semibold text-ink">${sunMark("h-6 w-6")} Sunnyway 公式</div>
    <div class="flex-1 space-y-4 overflow-y-auto px-5 py-5">${msgs}</div>
    <div class="flex items-center gap-2 border-t border-line bg-surface p-3" style="padding-bottom:max(0.75rem,env(safe-area-inset-bottom))"><input class="input flex-1 rounded-full" id="chat-input" placeholder="メッセージを入力…"><button class="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-sunny-500 text-white shadow-lift active:scale-95" data-act="send">${ic("send", "h-5 w-5")}</button></div></div>`;
}

// ---- マイページ ----
function viewMe() {
  const me = influencer(ME);
  const items = [["profile", "edit", "プロフィール"], ["address", "pin", "住所"], ["sns", "link", "SNS連携"], ["bank", "card", "振込先"], ["transactions", "receipt", "取引履歴"], ["notify", "bellgear", "通知"]];
  return `<div class="px-5 pb-6 pt-2"><div class="flex items-center gap-4"><div class="grid h-16 w-16 place-items-center rounded-full bg-sunrise p-0.5"><div class="grid h-full w-full place-items-center rounded-full bg-canvas text-sunny-500">${ic("spark", "h-7 w-7", true)}</div></div><div><div class="flex items-center gap-1.5"><p class="display text-xl font-semibold text-ink">${me.name}</p>${me.verified ? ic("check", "h-4 w-4 text-sunny-500") : ""}</div><p class="text-sm text-muted">@${me.handle} ・ ${fmt(me.followers)} フォロワー</p></div></div></div>
    <div class="grid grid-cols-3 gap-3 px-5">${meStat("応募", appsByInf(ME).length)}${meStat("取り上げ", appsByInf(ME).filter(isPosted).length)}${meStat("報酬", yen(S.transactions.filter((t) => t.influencerId === ME).reduce((s, t) => s + t.amountYen, 0)))}</div>
    <p class="px-5 pb-2 pt-7 text-xs font-semibold uppercase tracking-wider text-muted">アカウント</p>
    <div class="mx-5 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">${items.map(([k, icon, label]) => `<button data-act="nav" data-href="#/me/${k}" class="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-canvas"><span class="grid h-9 w-9 place-items-center rounded-xl bg-sunny-50 text-sunny-600">${ic(icon, "h-5 w-5")}</span><span class="flex-1 text-sm font-medium text-ink">${label}</span>${k === "notify" && !me.notify ? `<span class="text-xs text-sunny-600">ONにしよう</span>` : ""}<span class="text-ink/25">${ic("chevron", "h-4 w-4")}</span></button>`).join("")}</div>
    <p class="px-5 pb-2 pt-7 text-xs font-semibold uppercase tracking-wider text-muted">サポート</p>
    <div class="mx-5 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
      <button data-act="nav" data-href="#/inbox" class="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-canvas"><span class="grid h-9 w-9 place-items-center rounded-xl bg-sunny-50 text-sunny-600">${ic("chat", "h-5 w-5")}</span><span class="flex-1 text-sm font-medium text-ink">お問い合わせ</span><span class="text-ink/25">${ic("chevron", "h-4 w-4")}</span></button>
      <button data-act="tutorial" class="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-canvas"><span class="grid h-9 w-9 place-items-center rounded-xl bg-sunny-50 text-sunny-600">${ic("spark", "h-5 w-5", true)}</span><span class="flex-1 text-sm font-medium text-ink">使い方をもう一度見る</span><span class="text-ink/25">${ic("chevron", "h-4 w-4")}</span></button>
      <button data-act="logout" class="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-canvas"><span class="grid h-9 w-9 place-items-center rounded-xl bg-ink/5 text-ink/50">${ic("logout", "h-5 w-5")}</span><span class="flex-1 text-sm font-medium text-ink">ログアウト</span></button>
    </div><div class="h-8"></div>`;
}
const meStat = (label, value) => `<div class="rounded-2xl border border-line bg-surface p-3 text-center"><div class="display text-xl font-semibold text-ink">${value}</div><div class="mt-0.5 text-[11px] text-muted">${label}</div></div>`;
const meSubTitle = (h) => ({ profile: "プロフィール", address: "住所", sns: "SNS連携", bank: "振込先", transactions: "取引履歴", notify: "通知" }[h.split("/")[2]] || "設定");
function viewMeSub(h) {
  const me = influencer(ME), key = h.split("/")[2];
  const wrap = (inner) => `<div class="space-y-4 p-5">${inner}</div>`;
  if (key === "profile") return wrap(`<div><label class="label">表示名</label><input class="input" id="f-name" value="${me.name}"></div><div><label class="label">フォロワー数</label><input class="input" type="number" id="f-followers" value="${me.followers}"></div><div><label class="label">自己紹介</label><textarea class="input" id="f-bio" rows="3">${me.bio}</textarea></div><button class="btn-primary w-full" data-act="save-profile">保存する</button>`);
  if (key === "address") return wrap(`<p class="rounded-2xl bg-sunny-50 px-4 py-3 text-xs text-sunny-800">ギフティング（現物提供）の発送先に使います。</p><div><label class="label">住所</label><textarea class="input" id="f-address" rows="3" placeholder="〒 都道府県 市区町村 番地…">${me.address}</textarea></div><button class="btn-primary w-full" data-act="save-address">保存する</button>`);
  if (key === "sns") return wrap(`${snsRow("instagram", "Instagram", me.igLinked)}${snsRow("tiktok", "TikTok", me.ttLinked)}<p class="text-xs leading-relaxed text-muted">連携するとフォロワー数やリーチを自動取得します。</p>`);
  if (key === "bank") return wrap(`<p class="rounded-2xl bg-sunny-50 px-4 py-3 text-xs text-sunny-800">金銭報酬はここへ振り込まれます。</p><div><label class="label">振込先（銀行・支店・口座）</label><textarea class="input" id="f-bank" rows="2" placeholder="例）みずほ銀行 渋谷支店 普通 1234567">${me.bank}</textarea></div><button class="btn-primary w-full" data-act="save-bank">保存する</button>`);
  if (key === "transactions") { const tx = S.transactions.filter((t) => t.influencerId === ME); return `<div class="p-5">${tx.length ? `<div class="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">${tx.map((t) => `<div class="flex items-center justify-between px-4 py-4"><div><p class="text-sm font-semibold text-ink">${campaign(t.campaignId) ? campaign(t.campaignId).title : "案件報酬"}</p><p class="text-xs text-muted">${t.date}</p></div><div class="text-right"><p class="display text-lg font-semibold text-ink">${yen(t.amountYen)}</p>${pill(t.status, "bg-emerald-50 text-emerald-700")}</div></div>`).join("")}</div>` : emptyState("取引履歴はまだありません")}</div>`; }
  if (key === "notify") return wrap(`<div class="flex items-center justify-between rounded-2xl border border-line bg-surface px-4 py-4"><div><p class="text-sm font-semibold text-ink">プッシュ通知</p><p class="text-xs text-muted">採用・連絡・報酬振込をお知らせ</p></div>${toggle(me.notify, "toggle-notify")}</div>`);
  return wrap("設定");
}
const snsRow = (key, label, linked) => `<div class="flex items-center justify-between rounded-2xl border border-line bg-surface px-4 py-3.5"><span class="flex items-center gap-2 text-sm font-medium text-ink">${ic("link", "h-4 w-4 text-muted")}${label}</span><button data-act="toggle-sns" data-sns="${key}" class="rounded-full px-4 py-1.5 text-xs font-semibold ${linked ? "bg-emerald-50 text-emerald-700" : "bg-sunny-500 text-white"}">${linked ? "連携済み" : "連携する"}</button></div>`;
const toggle = (on, act) => `<button data-act="${act}" class="relative h-7 w-12 rounded-full transition ${on ? "bg-sunny-500" : "bg-ink/15"}"><span class="absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${on ? "left-[1.375rem]" : "left-0.5"}"></span></button>`;

// ============================================================
// イベント
// ============================================================
document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-act]"); if (!t) return;
  const act = t.dataset.act, id = t.dataset.id;
  // オンボーディング
  if (act === "ob-next") { if (slide < SLIDES.length - 1) { slide++; render(); } else { localStorage.setItem("sw_onboarded", "1"); phase = "auth"; render(); } return; }
  if (act === "ob-skip") { localStorage.setItem("sw_onboarded", "1"); phase = "auth"; render(); return; }
  if (act === "auth") { localStorage.setItem("sw_authed", "1"); phase = "app"; location.hash = "#/"; render(); return; }
  if (act === "logout") { localStorage.removeItem("sw_authed"); phase = "auth"; render(); return; }
  if (act === "tutorial") { slide = 0; phase = "onboard"; render(); return; }
  // 本編
  if (act === "nav") return go(t.dataset.href);
  if (act === "filter") { searchFilter = t.dataset.cat; render(); return; }
  if (act === "fav") { const f = favsOf(ME), i = f.indexOf(id); i < 0 ? f.push(id) : f.splice(i, 1); render(); return; }
  if (act === "open") return go("#/");
  if (act === "apply") { if (appsByInf(ME).some((a) => a.campaignId === id)) return; S.applications.push({ id: uid("a"), campaignId: id, influencerId: ME, status: "APPLIED", message: "", postUrl: "", postReach: 0 }); toast("応募しました ✦ 案件管理で確認できます"); render(); return; }
  if (act === "mgtab") { mgTab = t.dataset.tab; render(); return; }
  if (act === "submit") { const url = val("url-" + id, ""), reach = parseInt(val("reach-" + id, "0"), 10); if (!url.trim()) return toast("投稿 URL を入力してください"); const a = S.applications.find((x) => x.id === id); a.status = "SUBMITTED"; a.postUrl = url.trim(); a.postReach = reach || 0; mgTab = "review"; toast("提出しました。確認をお待ちください"); render(); return; }
  if (act === "send") { const inp = document.getElementById("chat-input"), txt = (inp.value || "").trim(); if (!txt) return; const n = new Date(), tm = `${n.getMonth() + 1}/${n.getDate()} ${String(n.getHours()).padStart(2, "0")}:${String(n.getMinutes()).padStart(2, "0")}`; S.inbox.push({ from: "me", text: txt, time: tm }); render(); setTimeout(() => { S.inbox.push({ from: "staff", text: "ありがとうございます。担当より追ってご連絡します。", time: tm }); render(); }, 700); return; }
  if (act === "save-profile") { const me = influencer(ME); me.name = val("f-name", me.name); me.followers = parseInt(val("f-followers", me.followers), 10) || 0; me.bio = val("f-bio", me.bio); toast("保存しました"); go("#/me"); return; }
  if (act === "save-address") { influencer(ME).address = val("f-address", ""); toast("住所を保存しました"); go("#/me"); return; }
  if (act === "save-bank") { influencer(ME).bank = val("f-bank", ""); toast("振込先を保存しました"); go("#/me"); return; }
  if (act === "toggle-sns") { const me = influencer(ME); if (t.dataset.sns === "instagram") me.igLinked = !me.igLinked; else me.ttLinked = !me.ttLinked; render(); return; }
  if (act === "toggle-notify") { const me = influencer(ME); me.notify = !me.notify; toast(me.notify ? "通知をONにしました" : "通知をOFFにしました"); render(); return; }
});

render();
if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
