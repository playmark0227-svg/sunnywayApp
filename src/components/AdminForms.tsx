"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { SubmitButton } from "@/components/SubmitButton";
import { createBrandAction, createProductAction, createCampaignAction } from "@/lib/actions/admin";
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
        <div><label className="label">説明</label><input name="description" className="input" /></div>
        <div><label className="label">小売価格（円）</label><input name="retailPriceYen" type="number" min={0} defaultValue={0} className="input" /></div>
        <SubmitButton className="btn-primary w-full">登録する</SubmitButton>
      </form>
    )}</Collapsible>
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
