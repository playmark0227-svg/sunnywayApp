"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { SubmitButton } from "@/components/SubmitButton";
import { createBrandAction, createProductAction, createCampaignAction, updateBrandAction, updateProductAction, updateCampaignAction, sendMailAction } from "@/lib/actions/admin";
import type { FormState } from "@/lib/actions/auth";
import { billingModelLabel } from "@/lib/labels";
import { Icon } from "@/components/Icon";

function Collapsible({ openLabel, children }: { openLabel: string; children: (close: () => void) => React.ReactNode }) {
  const [open, setOpen] = useState(false);
  if (!open) return <button onClick={() => setOpen(true)} className="btn-primary"><Icon name="plus" className="h-4 w-4" /> {openLabel}</button>;
  return (
    <div className="card w-full p-5 lg:w-[34rem]">
      <div className="mb-4 flex items-center justify-between"><h3 className="display font-semibold text-ink">{openLabel}</h3><button onClick={() => setOpen(false)} className="text-sm text-muted hover:text-ink">閉じる</button></div>
      {children(() => setOpen(false))}
    </div>
  );
}
function ErrBox({ s }: { s: FormState }) {
  if (!s?.error) return null;
  return <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-600">{s.error}</p>;
}
function useResetOnOk(s: FormState, ref: React.RefObject<HTMLFormElement | null>) {
  useEffect(() => { if (s?.ok) ref.current?.reset(); }, [s, ref]);
}

function ImageUpload({ defaultUrl = "" }: { defaultUrl?: string }) {
  const [url, setUrl] = useState(defaultUrl);
  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const max = 640;
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale), h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
        setUrl(canvas.toDataURL("image/jpeg", 0.78));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };
  return (
    <div>
      <label className="label">商品画像</label>
      <input type="hidden" name="imageUrl" value={url} />
      <div className="flex items-center gap-3">
        <label className="grid h-20 w-20 shrink-0 cursor-pointer place-items-center overflow-hidden rounded-2xl border border-dashed border-line bg-canvas text-muted">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" className="h-full w-full object-cover" />
          ) : <Icon name="plus" className="h-6 w-6" />}
          <input type="file" accept="image/*" className="hidden" onChange={onPick} />
        </label>
        <p className="text-xs text-muted">タップして写真を選択<br />（自動で軽量化されます）</p>
        {url && <button type="button" onClick={() => setUrl("")} className="ml-auto text-xs text-rose-500">削除</button>}
      </div>
    </div>
  );
}

export function BrandForm() {
  const ref = useRef<HTMLFormElement>(null);
  const [state, action] = useActionState<FormState, FormData>(createBrandAction, undefined);
  useResetOnOk(state, ref);
  return (
    <Collapsible openLabel="ブランドを追加">{() => (
      <form ref={ref} action={action} className="space-y-3">
        <ErrBox s={state} />
        <div><label className="label">ブランド名 *</label><input name="name" className="input" required /></div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div><label className="label">担当者名</label><input name="contactName" className="input" /></div>
          <div><label className="label">担当者メール</label><input name="contactEmail" type="email" className="input" /></div>
        </div>
        <div><label className="label">月額・掲載料（円）</label><input name="monthlyFeeYen" type="number" min={0} defaultValue={0} className="input" /></div>
        <div><label className="label">メモ</label><input name="notes" className="input" /></div>
        <SubmitButton className="btn-primary w-full">登録する</SubmitButton>
      </form>
    )}</Collapsible>
  );
}

export function ProductForm({ brands }: { brands: { id: string; name: string }[] }) {
  const ref = useRef<HTMLFormElement>(null);
  const [state, action] = useActionState<FormState, FormData>(createProductAction, undefined);
  useResetOnOk(state, ref);
  return (
    <Collapsible openLabel="商品を追加">{() => (
      <form ref={ref} action={action} className="space-y-3">
        <ErrBox s={state} />
        <div className="grid gap-3 sm:grid-cols-2">
          <div><label className="label">ブランド *</label><select name="brandId" className="input" required defaultValue=""><option value="" disabled>選択</option>{brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</select></div>
          <div><label className="label">カテゴリ</label><select name="category" className="input" defaultValue="スキンケア"><option>スキンケア</option><option>メイクアップ</option><option>ヘアケア</option><option>その他</option></select></div>
        </div>
        <div><label className="label">商品名 *</label><input name="name" className="input" required /></div>
        <ImageUpload />
        <div><label className="label">説明</label><input name="description" className="input" /></div>
        <div><label className="label">小売価格（円）</label><input name="retailPriceYen" type="number" min={0} defaultValue={0} className="input" /></div>
        <SubmitButton className="btn-primary w-full">登録する</SubmitButton>
      </form>
    )}</Collapsible>
  );
}

// ============================================================
// 編集（モーダル）
// ============================================================

function EditModal({ title, label, children }: { title: string; label?: string; children: (close: () => void) => React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-ghost px-3 py-2 text-xs"><Icon name="edit" className="h-3.5 w-3.5" /> {label ?? "編集"}</button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="screen-in card relative max-h-[85vh] w-full max-w-xl overflow-y-auto p-6">
            <div className="mb-4 flex items-center justify-between"><h3 className="display font-semibold text-ink">{title}</h3><button onClick={() => setOpen(false)} className="text-sm text-muted hover:text-ink">閉じる</button></div>
            {children(() => setOpen(false))}
          </div>
        </div>
      )}
    </>
  );
}
function useCloseOnOk(s: FormState, close: () => void) {
  useEffect(() => { if (s?.ok) close(); }, [s, close]);
}

// ============================================================
// 削除（確認ダイアログ付き）
// ============================================================

/** 危険操作用の削除ボタン。クリックで確認ダイアログを開き、実行するとサーバーアクションへ。 */
export function DeleteButton({
  action, idName, id, title, message, buttonLabel = "削除", confirmLabel = "削除する",
}: {
  action: (formData: FormData) => Promise<void>;
  idName: string;
  id: string;
  title: string;
  message: string;
  buttonLabel?: string;
  confirmLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="btn-ghost px-3 py-2 text-xs text-rose-600 hover:bg-rose-50">
        <Icon name="trash" className="h-3.5 w-3.5" /> {buttonLabel}
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="screen-in card relative w-full max-w-md p-6">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-rose-50 text-rose-600"><Icon name="trash" className="h-5 w-5" /></span>
              <div className="min-w-0">
                <h3 className="display font-semibold text-ink">{title}</h3>
                <p className="mt-1 text-sm text-muted">{message}</p>
                <p className="mt-1 text-xs text-rose-500">この操作は取り消せません。</p>
              </div>
            </div>
            <form action={action} className="mt-5 flex justify-end gap-2">
              <input type="hidden" name={idName} value={id} />
              <button type="button" onClick={() => setOpen(false)} className="btn-ghost px-4 py-2 text-sm">キャンセル</button>
              <SubmitButton className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700" pendingText="削除中…">{confirmLabel}</SubmitButton>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export type BrandLite = { id: string; name: string; contactName: string; contactEmail: string; monthlyFeeYen: number; notes: string; active: boolean };

export function BrandEditButton({ brand }: { brand: BrandLite }) {
  return <EditModal title="ブランドを編集">{(close) => <BrandEditFields brand={brand} close={close} />}</EditModal>;
}
function BrandEditFields({ brand, close }: { brand: BrandLite; close: () => void }) {
  const [state, action] = useActionState<FormState, FormData>(updateBrandAction, undefined);
  useCloseOnOk(state, close);
  return (
    <form action={action} className="space-y-3">
      <ErrBox s={state} />
      <input type="hidden" name="brandId" value={brand.id} />
      <div><label className="label">ブランド名 *</label><input name="name" defaultValue={brand.name} className="input" required /></div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><label className="label">担当者名</label><input name="contactName" defaultValue={brand.contactName} className="input" /></div>
        <div><label className="label">担当者メール</label><input name="contactEmail" type="email" defaultValue={brand.contactEmail} className="input" /></div>
      </div>
      <div><label className="label">月額・掲載料（円）</label><input name="monthlyFeeYen" type="number" min={0} defaultValue={brand.monthlyFeeYen} className="input" /></div>
      <div><label className="label">メモ</label><input name="notes" defaultValue={brand.notes} className="input" /></div>
      <label className="flex items-center gap-2 text-sm text-ink/80"><input type="checkbox" name="active" defaultChecked={brand.active} className="h-4 w-4 rounded border-line text-sunny-500" /> 契約中（商品登録の選択肢に表示）</label>
      <SubmitButton className="btn-primary w-full">保存する</SubmitButton>
    </form>
  );
}

export type ProductLite = { id: string; brandId: string; name: string; category: string; description: string; imageUrl: string; retailPriceYen: number };

export function ProductEditButton({ product, brands }: { product: ProductLite; brands: { id: string; name: string }[] }) {
  return <EditModal title="商品を編集">{(close) => <ProductEditFields product={product} brands={brands} close={close} />}</EditModal>;
}
function ProductEditFields({ product, brands, close }: { product: ProductLite; brands: { id: string; name: string }[]; close: () => void }) {
  const [state, action] = useActionState<FormState, FormData>(updateProductAction, undefined);
  useCloseOnOk(state, close);
  return (
    <form action={action} className="space-y-3">
      <ErrBox s={state} />
      <input type="hidden" name="productId" value={product.id} />
      <div className="grid gap-3 sm:grid-cols-2">
        <div><label className="label">ブランド *</label><select name="brandId" className="input" required defaultValue={product.brandId}>{brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</select></div>
        <div><label className="label">カテゴリ</label><select name="category" className="input" defaultValue={product.category}><option>スキンケア</option><option>メイクアップ</option><option>ヘアケア</option><option>その他</option></select></div>
      </div>
      <div><label className="label">商品名 *</label><input name="name" defaultValue={product.name} className="input" required /></div>
      <ImageUpload defaultUrl={product.imageUrl} />
      <div><label className="label">説明</label><input name="description" defaultValue={product.description} className="input" /></div>
      <div><label className="label">小売価格（円）</label><input name="retailPriceYen" type="number" min={0} defaultValue={product.retailPriceYen} className="input" /></div>
      <SubmitButton className="btn-primary w-full">保存する</SubmitButton>
    </form>
  );
}

export type CampaignLite = { id: string; productId: string; title: string; brief: string; media: string; tags: string; deadline: string; targetInfluencers: number; rewardType: string; rewardYen: number; billingModels: string; campaignFeeYen: number; salesCommissionPct: number };

export function CampaignEditButton({ campaign, products }: { campaign: CampaignLite; products: { id: string; name: string; brandName: string }[] }) {
  return <EditModal title="掲載を編集" label="掲載を編集">{(close) => <CampaignEditFields campaign={campaign} products={products} close={close} />}</EditModal>;
}
function CampaignEditFields({ campaign, products, close }: { campaign: CampaignLite; products: { id: string; name: string; brandName: string }[]; close: () => void }) {
  const [state, action] = useActionState<FormState, FormData>(updateCampaignAction, undefined);
  useCloseOnOk(state, close);
  const checked = new Set(campaign.billingModels.split(",").map((s) => s.trim()).filter(Boolean));
  return (
    <form action={action} className="space-y-3">
      <ErrBox s={state} />
      <input type="hidden" name="campaignId" value={campaign.id} />
      <div><label className="label">対象商品 *</label><select name="productId" className="input" required defaultValue={campaign.productId}>{products.map((p) => <option key={p.id} value={p.id}>{p.brandName} / {p.name}</option>)}</select></div>
      <div><label className="label">掲載タイトル *</label><input name="title" defaultValue={campaign.title} className="input" required /></div>
      <div><label className="label">依頼内容・投稿条件</label><textarea name="brief" rows={2} defaultValue={campaign.brief} className="input" /></div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div><label className="label">媒体</label><select name="media" className="input" defaultValue={campaign.media}><option>Instagram Feed</option><option>Instagram Reels</option><option>TikTok</option></select></div>
        <div><label className="label">タグ</label><input name="tags" defaultValue={campaign.tags} placeholder="顔出し不要" className="input" /></div>
        <div><label className="label">募集終了日</label><input name="deadline" defaultValue={campaign.deadline} placeholder="6/30" className="input" /></div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><label className="label">募集人数 *</label><input name="targetInfluencers" type="number" min={1} defaultValue={campaign.targetInfluencers} className="input" required /></div>
        <div><label className="label">報酬タイプ *</label><select name="rewardType" className="input" defaultValue={campaign.rewardType}><option value="GIFTING">ギフティング</option><option value="PAID">金銭報酬</option><option value="BOTH">現物＋報酬</option><option value="OTHER">特別報酬</option></select></div>
      </div>
      <div><label className="label">1人あたり報酬（円）</label><input name="rewardYen" type="number" min={0} defaultValue={campaign.rewardYen} className="input" /></div>
      <fieldset className="rounded-xl border border-line p-3">
        <legend className="px-1 text-xs font-semibold text-muted">収益モデル（複数可）</legend>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(billingModelLabel).map(([value, label]) => (
            <label key={value} className="flex items-center gap-2 text-sm text-ink/80"><input type="checkbox" name="billingModels" value={value} defaultChecked={checked.has(value)} className="h-4 w-4 rounded border-line text-sunny-500" /> {label}</label>
          ))}
        </div>
      </fieldset>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><label className="label">キャンペーン費用（円）</label><input name="campaignFeeYen" type="number" min={0} defaultValue={campaign.campaignFeeYen} className="input" /></div>
        <div><label className="label">販売手数料率（%）</label><input name="salesCommissionPct" type="number" min={0} max={100} defaultValue={campaign.salesCommissionPct} className="input" /></div>
      </div>
      <SubmitButton className="btn-primary w-full">保存する</SubmitButton>
    </form>
  );
}

// ============================================================
// メール送信（登録アドレス宛て）
// ============================================================

export function MailForm({ influencers, brands, defaultTo }: {
  influencers: { name: string; handle: string; email: string }[];
  brands: { name: string; contactEmail: string }[];
  defaultTo?: string;
}) {
  const ref = useRef<HTMLFormElement>(null);
  const [state, action] = useActionState<FormState, FormData>(sendMailAction, undefined);
  useResetOnOk(state, ref);
  const known = new Set([...influencers.map((i) => i.email), ...brands.map((b) => b.contactEmail)]);
  return (
    <form ref={ref} action={action} className="space-y-3">
      <ErrBox s={state} />
      {state?.ok && state.message && <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">✓ {state.message}</p>}
      <div>
        <label className="label">宛先 *</label>
        <select name="to" className="input" required defaultValue={defaultTo ?? ""}>
          <option value="" disabled>選択してください</option>
          <option value="ALL_INFLUENCERS">📣 全インフルエンサーへ一斉送信（{influencers.length}名）</option>
          {defaultTo && defaultTo !== "ALL_INFLUENCERS" && !known.has(defaultTo) && <option value={defaultTo}>{defaultTo}</option>}
          <optgroup label="インフルエンサー">
            {influencers.map((i) => <option key={i.email} value={i.email}>{i.name}（@{i.handle}）— {i.email}</option>)}
          </optgroup>
          {brands.length > 0 && (
            <optgroup label="ブランド担当者">
              {brands.map((b) => <option key={b.contactEmail} value={b.contactEmail}>{b.name} — {b.contactEmail}</option>)}
            </optgroup>
          )}
        </select>
      </div>
      <div><label className="label">件名 *</label><input name="subject" className="input" placeholder="【Sunnyway】新着案件のお知らせ" required /></div>
      <div><label className="label">本文 *</label><textarea name="body" rows={7} className="input" placeholder={"いつもSunnywayをご利用いただきありがとうございます。\n…"} required /></div>
      <SubmitButton className="btn-primary w-full"><Icon name="send" className="h-4 w-4" /> 送信する</SubmitButton>
    </form>
  );
}

export function CampaignForm({ products }: { products: { id: string; name: string; brandName: string }[] }) {
  const ref = useRef<HTMLFormElement>(null);
  const [state, action] = useActionState<FormState, FormData>(createCampaignAction, undefined);
  useResetOnOk(state, ref);
  return (
    <Collapsible openLabel="掲載を作成">{() => (
      <form ref={ref} action={action} className="space-y-3">
        <ErrBox s={state} />
        {products.length === 0 ? <p className="text-sm text-muted">先に「商品」を登録してください。</p> : (
          <>
            <div><label className="label">対象商品 *</label><select name="productId" className="input" required defaultValue=""><option value="" disabled>選択</option>{products.map((p) => <option key={p.id} value={p.id}>{p.brandName} / {p.name}</option>)}</select></div>
            <div><label className="label">掲載タイトル *</label><input name="title" className="input" required /></div>
            <div><label className="label">依頼内容・投稿条件</label><textarea name="brief" rows={2} className="input" /></div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div><label className="label">媒体</label><select name="media" className="input" defaultValue="Instagram Feed"><option>Instagram Feed</option><option>Instagram Reels</option><option>TikTok</option></select></div>
              <div><label className="label">タグ</label><input name="tags" placeholder="顔出し不要" className="input" /></div>
              <div><label className="label">募集終了日</label><input name="deadline" placeholder="6/30" className="input" /></div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div><label className="label">募集人数 *</label><input name="targetInfluencers" type="number" min={1} defaultValue={10} className="input" required /></div>
              <div><label className="label">報酬タイプ *</label><select name="rewardType" className="input" defaultValue="GIFTING"><option value="GIFTING">ギフティング</option><option value="PAID">金銭報酬</option><option value="BOTH">現物＋報酬</option><option value="OTHER">特別報酬</option></select></div>
            </div>
            <div><label className="label">1人あたり報酬（円）</label><input name="rewardYen" type="number" min={0} defaultValue={0} className="input" /></div>
            <fieldset className="rounded-xl border border-line p-3">
              <legend className="px-1 text-xs font-semibold text-muted">収益モデル（複数可）</legend>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(billingModelLabel).map(([value, label]) => (
                  <label key={value} className="flex items-center gap-2 text-sm text-ink/80"><input type="checkbox" name="billingModels" value={value} defaultChecked={value === "PER_CAMPAIGN"} className="h-4 w-4 rounded border-line text-sunny-500" /> {label}</label>
                ))}
              </div>
            </fieldset>
            <div className="grid gap-3 sm:grid-cols-2">
              <div><label className="label">キャンペーン費用（円）</label><input name="campaignFeeYen" type="number" min={0} defaultValue={0} className="input" /></div>
              <div><label className="label">販売手数料率（%）</label><input name="salesCommissionPct" type="number" min={0} max={100} defaultValue={0} className="input" /></div>
            </div>
            <SubmitButton className="btn-primary w-full">掲載を作成して募集開始</SubmitButton>
          </>
        )}
      </form>
    )}</Collapsible>
  );
}
