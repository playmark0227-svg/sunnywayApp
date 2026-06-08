/* ============================================================
   Sunnyway 運営コンソール（別URL・関係者専用）
   ログイン → ダッシュボード / 掲載 / レポート / ブランド / インフル
   ============================================================ */
const root = document.getElementById("root");
const go = (h) => { location.hash = h; };
const authed = () => sessionStorage.getItem("sw_admin") === "1";

function render() {
  window.scrollTo(0, 0);
  if (!authed()) return renderLogin();
  const h = location.hash || "#/";
  const m = h.match(/^#\/campaign\/(.+)$/);
  if (m) return shell("campaigns", report(m[1]));
  if (h.startsWith("#/campaigns")) return shell("campaigns", campaigns());
  if (h.startsWith("#/brands")) return shell("brands", brands());
  if (h.startsWith("#/influencers")) return shell("influencers", influencers());
  return shell("dashboard", dashboard());
}
window.addEventListener("hashchange", () => { if (authed()) render(); });

// ---------- ログイン ----------
function renderLogin() {
  root.innerHTML = `<main class="fade grid min-h-[100dvh] place-items-center bg-canvas px-6">
    <div class="w-full max-w-sm">
      <div class="mb-8 text-center">${sunMark("mx-auto h-14 w-14")}<h1 class="display mt-4 text-2xl font-semibold text-ink">運営コンソール</h1><p class="mt-1.5 flex items-center justify-center gap-1.5 text-xs text-muted">${ic("shield", "h-4 w-4")} 関係者専用 ・ Sunnyway 運営</p></div>
      <div class="card p-6">
        <div class="space-y-3">
          <div><label class="label">メールアドレス</label><input class="input" id="adm-email" value="admin@sunnyway.io"></div>
          <div><label class="label">パスワード</label><input class="input" id="adm-pw" type="password" value="demo1234"></div>
          <button class="btn-primary w-full" data-act="login">ログイン</button>
        </div>
      </div>
      <p class="mt-5 text-center text-xs text-muted">ブランドはこの画面にアクセスできません。掲載は運営が代理で行います。</p>
      <p class="mt-3 text-center text-xs"><a href="./" class="text-sunny-600 underline">← Sunnyway アプリへ</a></p>
    </div></main>`;
}

// ---------- シェル ----------
const NAV = [["#/", "grid", "ダッシュボード"], ["#/campaigns", "bag", "掲載"], ["#/brands", "store", "ブランド"], ["#/influencers", "user", "インフルエンサー"]];
function shell(active, body) {
  root.innerHTML = `<div class="fade min-h-[100dvh] bg-canvas lg:flex">
    <aside class="border-b border-line bg-surface lg:flex lg:w-64 lg:shrink-0 lg:flex-col lg:border-b-0 lg:border-r">
      <div class="flex items-center gap-2 px-6 py-5">${sunMark("h-8 w-8")}<div><p class="display font-semibold leading-none text-ink">Sunnyway</p><p class="mt-1 text-[11px] text-muted">運営コンソール</p></div></div>
      <nav class="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col">${NAV.map(([href, icon, label]) => `<button data-act="nav" data-href="${href}" class="flex items-center gap-2.5 whitespace-nowrap rounded-xl px-3 py-2.5 text-left text-sm font-medium ${href === (active === "dashboard" ? "#/" : "#/" + active) ? "bg-sunny-50 text-sunny-700" : "text-ink/60 hover:bg-canvas"}">${ic(icon, "h-5 w-5")}${label}</button>`).join("")}</nav>
      <div class="mt-auto hidden p-3 lg:block"><div class="flex items-center gap-2 rounded-xl bg-canvas px-3 py-2"><div class="grid h-8 w-8 place-items-center rounded-full bg-sunny-100 text-sunny-700 text-xs font-bold">運</div><div class="min-w-0 flex-1 text-xs"><p class="truncate font-semibold text-ink">運営担当</p><p class="truncate text-muted">admin@sunnyway.io</p></div><button class="text-muted hover:text-ink" data-act="logout" title="ログアウト">${ic("logout", "h-5 w-5")}</button></div></div>
    </aside>
    <main class="flex-1 px-6 py-8 lg:px-12 lg:py-10">${body}</main></div>`;
}
const head = (t, d) => `<div class="mb-7"><h1 class="display text-3xl font-semibold text-ink">${t}</h1>${d ? `<p class="mt-1.5 text-sm text-muted">${d}</p>` : ""}</div>`;
const stat = (label, value, sub) => `<div class="card p-6"><div class="text-xs font-medium uppercase tracking-wider text-muted">${label}</div><div class="display mt-2 text-3xl font-semibold text-ink">${value}</div>${sub ? `<div class="mt-1 text-xs text-muted">${sub}</div>` : ""}</div>`;

function dashboard() {
  const openC = S.campaigns.filter((c) => c.status === "OPEN").length;
  const postedAll = S.applications.filter(isPosted);
  const reach = postedAll.reduce((s, a) => s + a.postReach, 0);
  const paid = S.transactions.filter((t) => t.status === "振込済み").reduce((s, t) => s + t.amountYen, 0);
  const recent = S.campaigns.slice().reverse().slice(0, 5);
  return head("ダッシュボード", "プラットフォーム全体のサマリー") + `<div class="grid grid-cols-2 gap-4 lg:grid-cols-3">${stat("ブランド", S.brands.length)}${stat("インフルエンサー", S.influencers.length)}${stat("募集中の掲載", openC)}${stat("取り上げ件数", postedAll.length)}${stat("合計リーチ", fmt(reach))}${stat("報酬支払額", yen(paid), "振込済みの総額")}</div>
    <div class="mt-8 grid gap-6 lg:grid-cols-2">
      <section class="card p-6"><div class="mb-4 flex items-center justify-between"><h2 class="display font-semibold text-ink">最近の掲載</h2><button class="text-sm font-medium text-sunny-600" data-act="nav" data-href="#/campaigns">すべて</button></div><div class="space-y-1">${recent.map((c) => `<button class="flex w-full items-center gap-3 rounded-2xl p-2 text-left hover:bg-canvas" data-act="nav" data-href="#/campaign/${c.id}"><div class="h-12 w-12 shrink-0 overflow-hidden rounded-xl">${artTile(product(c.productId), "h-12")}</div><div class="min-w-0 flex-1"><p class="truncate text-sm font-semibold text-ink">${c.title}</p><p class="truncate text-xs text-muted">${brand(c.brandId).name}</p></div><span class="text-sm font-semibold text-sunny-600">${postedApps(c.id).length}/${c.target}</span></button>`).join("")}</div></section>
      <section class="card p-6"><h2 class="display mb-4 font-semibold text-ink">操作ログ（監査）</h2><ul class="space-y-3 text-sm">${S.audit.slice(0, 6).map((l) => `<li class="flex items-center justify-between gap-2"><span class="truncate text-ink/70"><span class="rounded bg-sunny-50 px-1.5 py-0.5 font-mono text-xs text-sunny-700">${l.action}</span> ${l.actor}</span><span class="shrink-0 text-xs text-muted">${l.when}</span></li>`).join("")}</ul></section>
    </div>`;
}
function campaigns() {
  const rows = S.campaigns.slice().reverse().map((c) => { const pc = postedApps(c.id).length, pct = Math.min(100, Math.round((pc / Math.max(1, c.target)) * 100));
    return `<button class="card flex w-full items-center gap-4 p-4 text-left transition hover:shadow-card" data-act="nav" data-href="#/campaign/${c.id}"><div class="h-16 w-16 shrink-0 overflow-hidden rounded-2xl">${artTile(product(c.productId), "h-16")}</div><div class="min-w-0 flex-1"><div class="flex items-center gap-2"><h3 class="truncate font-semibold text-ink">${c.title}</h3>${pill(CSTATUS[c.status], CSTYLE[c.status])}</div><p class="mt-0.5 truncate text-sm text-muted">${brand(c.brandId).name} ・ ${REWARD[c.rewardType]}</p><div class="mt-2 flex items-center gap-3"><div class="h-1.5 w-32 overflow-hidden rounded-full bg-ink/5"><div class="h-full rounded-full bg-sunrise" style="width:${pct}%"></div></div><span class="text-xs font-medium text-ink/70">${pc}/${c.target}人 取り上げ</span></div></div>${ic("chevron", "h-5 w-5 text-ink/20")}</button>`; }).join("");
  return head("掲載（キャンペーン）", "運営がブランドの代理で作成。") + `<div class="space-y-3">${rows}</div>`;
}
function report(id) {
  const c = campaign(id); if (!c) return head("見つかりません");
  const b = brand(c.brandId), p = product(c.productId), apps = appsOf(id), pc = postedApps(id), reach = reachOf(id);
  const approvedCnt = apps.filter((a) => a.status === "APPROVED").length + pc.length;
  const appliedCnt = apps.filter((a) => a.status === "APPLIED").length;
  const rows = [["報酬", REWARD[c.rewardType] + (c.rewardType === "OTHER" && c.rewardNote ? `（${c.rewardNote}）` : "")], c.rewardYen > 0 ? ["1人あたり", yen(c.rewardYen)] : null, ["収益モデル", c.billing.map((x) => BILLING[x]).join(" / ")], c.fee > 0 ? ["費用", yen(c.fee)] : null, c.commission > 0 ? ["手数料率", c.commission + "%"] : null].filter(Boolean).map(([k, v]) => `<div class="flex justify-between gap-3 py-1"><dt class="text-muted">${k}</dt><dd class="text-right font-medium text-ink">${v}</dd></div>`).join("");
  const list = apps.length ? apps.map((a) => { const inf = influencer(a.influencerId); let act = "";
    if (a.status === "APPLIED") act = `<div class="flex shrink-0 gap-2"><button class="btn-primary px-4 py-2 text-xs" data-act="approve" data-id="${a.id}">採用</button><button class="btn-ghost px-4 py-2 text-xs" data-act="reject" data-id="${a.id}">見送り</button></div>`;
    else if (a.status === "SUBMITTED") act = `<div class="flex shrink-0 gap-2"><button class="btn-primary px-4 py-2 text-xs" data-act="confirm" data-id="${a.id}">確認OK・完了</button><button class="btn-ghost px-4 py-2 text-xs" data-act="sendback" data-id="${a.id}">差し戻し</button></div>`;
    return `<li class="flex flex-wrap items-center justify-between gap-3 py-4"><div class="min-w-0"><div class="flex items-center gap-2"><span class="font-semibold text-ink">@${inf.handle}</span>${pill(ASTATUS[a.status], ASTYLE[a.status])}</div><p class="text-xs text-muted">${inf.name} ・ ${fmt(inf.followers)} フォロワー</p>${isPosted(a) ? `<a href="${a.postUrl}" target="_blank" rel="noreferrer" class="mt-1 inline-block text-xs text-sunny-600 underline">投稿を見る</a> <span class="text-xs text-muted">リーチ ${fmt(a.postReach)}</span>` : ""}</div>${act}</li>`; }).join("") : `<p class="py-8 text-center text-sm text-muted">まだ応募はありません</p>`;
  return `<button class="mb-2 flex items-center gap-1 text-sm text-muted hover:text-ink" data-act="nav" data-href="#/campaigns">${ic("back", "h-4 w-4")} 掲載一覧</button>
    <div class="mb-6 flex flex-wrap items-end justify-between gap-3"><div><h1 class="display text-3xl font-semibold text-ink">${c.title}</h1><p class="mt-1 text-sm text-muted">${b.name} / ${p.name}</p></div>${pill(CSTATUS[c.status], CSTYLE[c.status])}</div>
    <div class="card overflow-hidden"><div class="bg-sunrise-soft p-7"><p class="text-sm text-ink/60">この掲載の成果</p><p class="display mt-1 text-3xl font-semibold text-ink"><span class="bg-sunrise bg-clip-text text-transparent">${pc.length}人</span>が取り上げました</p><p class="mt-1 text-sm text-muted">目標 ${c.target}人 ・ 合計リーチ ${fmt(reach)}</p></div>
      <div class="grid grid-cols-2 divide-x divide-y divide-line sm:grid-cols-4 sm:divide-y-0">${[["応募", apps.length], ["採用", approvedCnt], ["取り上げ", pc.length], ["リーチ", fmt(reach)]].map(([l, v]) => `<div class="p-5 text-center"><div class="display text-2xl font-semibold text-ink">${v}</div><div class="text-xs text-muted">${l}</div></div>`).join("")}</div></div>
    <div class="mt-6 grid gap-6 lg:grid-cols-3">
      <section class="card p-6 lg:col-span-1"><h2 class="display mb-3 font-semibold text-ink">掲載・課金</h2><dl class="text-sm">${rows}</dl><h3 class="mb-1 mt-4 text-xs font-semibold uppercase tracking-wider text-muted">依頼内容</h3><p class="text-sm leading-relaxed text-ink/80">${c.brief}</p></section>
      <section class="card p-6 lg:col-span-2"><h2 class="display mb-3 font-semibold text-ink">応募・取り上げ実績</h2>${appliedCnt > 0 ? `<p class="mb-3 rounded-2xl bg-sunny-50 px-4 py-3 text-sm text-sunny-800">未対応の応募が ${appliedCnt} 件。採用で参加確定です。</p>` : ""}<ul class="divide-y divide-line">${list}</ul></section>
    </div>`;
}
function brands() {
  const rows = S.brands.map((b) => `<tr class="border-t border-line hover:bg-canvas"><td class="px-5 py-4"><div class="font-semibold text-ink">${b.name}</div><div class="text-xs text-muted">${b.notes}</div></td><td class="px-5 py-4 text-sm text-ink/70">${b.contactName}<div class="text-xs text-muted">${b.contactEmail}</div></td><td class="px-5 py-4 text-sm text-ink/70">${b.monthlyFeeYen > 0 ? yen(b.monthlyFeeYen) : "—"}</td><td class="px-5 py-4 text-center text-sm">${S.products.filter((p) => p.brandId === b.id).length}</td><td class="px-5 py-4 text-center text-sm">${S.campaigns.filter((c) => c.brandId === b.id).length}</td></tr>`).join("");
  return head("ブランド", "運営が管理（ブランド自身は管理画面に入れません）") + `<div class="card overflow-x-auto"><table class="w-full"><thead><tr class="text-left text-xs uppercase tracking-wider text-muted"><th class="px-5 py-3">ブランド</th><th class="px-5 py-3">担当者</th><th class="px-5 py-3">月額</th><th class="px-5 py-3 text-center">商品</th><th class="px-5 py-3 text-center">掲載</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}
function influencers() {
  const rows = S.influencers.map((inf) => { const mine = appsByInf(inf.id), pc = mine.filter(isPosted);
    return `<tr class="border-t border-line hover:bg-canvas"><td class="px-5 py-4"><div class="flex items-center gap-2 font-semibold text-ink">@${inf.handle}${inf.verified ? ic("check", "h-4 w-4 text-sunny-500") : ""}</div><div class="text-xs text-muted">${inf.name}</div></td><td class="px-5 py-4 text-sm text-ink/70">${PLATFORM[inf.platform]}</td><td class="px-5 py-4 text-right text-sm">${fmt(inf.followers)}</td><td class="px-5 py-4 text-center text-sm">${mine.length}</td><td class="px-5 py-4 text-center text-sm font-semibold text-sunny-600">${pc.length}</td><td class="px-5 py-4 text-right text-sm">${fmt(pc.reduce((s, a) => s + a.postReach, 0))}</td></tr>`; }).join("");
  return head("インフルエンサー", "登録者の一覧と実績") + `<div class="card overflow-x-auto"><table class="w-full"><thead><tr class="text-left text-xs uppercase tracking-wider text-muted"><th class="px-5 py-3">ハンドル</th><th class="px-5 py-3">媒体</th><th class="px-5 py-3 text-right">フォロワー</th><th class="px-5 py-3 text-center">応募</th><th class="px-5 py-3 text-center">取り上げ</th><th class="px-5 py-3 text-right">累計リーチ</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

// ---------- イベント ----------
document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-act]"); if (!t) return;
  const act = t.dataset.act, id = t.dataset.id;
  if (act === "login") { sessionStorage.setItem("sw_admin", "1"); location.hash = "#/"; render(); return; }
  if (act === "logout") { sessionStorage.removeItem("sw_admin"); render(); return; }
  if (act === "nav") return go(t.dataset.href);
  if (act === "approve" || act === "reject") { const a = S.applications.find((x) => x.id === id); a.status = act === "approve" ? "APPROVED" : "REJECTED"; pushAudit("application.decide"); toast(act === "approve" ? "採用しました" : "見送りにしました"); render(); return; }
  if (act === "confirm") { completeApp(S.applications.find((x) => x.id === id)); toast("完了にしました（報酬を振込）"); render(); return; }
  if (act === "sendback") { S.applications.find((x) => x.id === id).status = "APPROVED"; toast("差し戻しました"); render(); return; }
});
render();
