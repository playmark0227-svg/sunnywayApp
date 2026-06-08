"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { SubmitButton } from "@/components/SubmitButton";
import {
  createBrandAction,
  createProductAction,
  createCampaignAction,
} from "@/lib/actions/admin";
import type { FormState } from "@/lib/actions/auth";
import { billingModelLabel } from "@/lib/labels";

function Collapsible({
  openLabel,
  children,
}: {
  openLabel: string;
  children: (close: () => void) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="btn-primary">
        ＋ {openLabel}
      </button>
    );
  }
  return (
    <div className="card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">{openLabel}</h3>
        <button
          onClick={() => setOpen(false)}
          className="text-sm text-gray-400 hover:text-gray-600"
        >
          閉じる ✕
        </button>
      </div>
      {children(() => setOpen(false))}
    </div>
  );
}

function ErrorBox({ state }: { state: FormState }) {
  if (!state?.error) return null;
  return (
    <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
      {state.error}
    </p>
  );
}

/** 送信成功(ok)でフォームを初期化するための共通フック */
function useResetOnSuccess(state: FormState, ref: React.RefObject<HTMLFormElement | null>) {
  useEffect(() => {
    if (state?.ok) ref.current?.reset();
  }, [state, ref]);
}

export function BrandForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action] = useActionState<FormState, FormData>(
    createBrandAction,
    undefined
  );
  useResetOnSuccess(state, formRef);

  return (
    <Collapsible openLabel="ブランドを追加">
      {() => (
        <form ref={formRef} action={action} className="space-y-4">
          <ErrorBox state={state} />
          <div>
            <label className="label">ブランド名 *</label>
            <input name="name" className="input" required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">担当者名</label>
              <input name="contactName" className="input" />
            </div>
            <div>
              <label className="label">担当者メール</label>
              <input name="contactEmail" type="email" className="input" />
            </div>
          </div>
          <div>
            <label className="label">月額・掲載料（円）</label>
            <input
              name="monthlyFeeYen"
              type="number"
              min={0}
              defaultValue={0}
              className="input"
            />
          </div>
          <div>
            <label className="label">メモ</label>
            <textarea name="notes" rows={2} className="input" />
          </div>
          <SubmitButton className="btn-primary">登録する</SubmitButton>
        </form>
      )}
    </Collapsible>
  );
}

type BrandOption = { id: string; name: string };

export function ProductForm({ brands }: { brands: BrandOption[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action] = useActionState<FormState, FormData>(
    createProductAction,
    undefined
  );
  useResetOnSuccess(state, formRef);

  return (
    <Collapsible openLabel="商品を追加">
      {() => (
        <form ref={formRef} action={action} className="space-y-4">
          <ErrorBox state={state} />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">ブランド *</label>
              <select name="brandId" className="input" required defaultValue="">
                <option value="" disabled>
                  選択してください
                </option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">カテゴリ</label>
              <select name="category" className="input" defaultValue="スキンケア">
                <option>スキンケア</option>
                <option>メイクアップ</option>
                <option>ヘアケア</option>
                <option>フレグランス</option>
                <option>ボディケア</option>
                <option>その他</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label">商品名 *</label>
            <input name="name" className="input" required />
          </div>
          <div>
            <label className="label">説明</label>
            <textarea name="description" rows={2} className="input" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">画像 URL</label>
              <input name="imageUrl" className="input" placeholder="https://…" />
            </div>
            <div>
              <label className="label">小売価格（円）</label>
              <input
                name="retailPriceYen"
                type="number"
                min={0}
                defaultValue={0}
                className="input"
              />
            </div>
          </div>
          <SubmitButton className="btn-primary">登録する</SubmitButton>
        </form>
      )}
    </Collapsible>
  );
}

type ProductOption = { id: string; name: string; brandName: string };

export function CampaignForm({ products }: { products: ProductOption[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action] = useActionState<FormState, FormData>(
    createCampaignAction,
    undefined
  );
  useResetOnSuccess(state, formRef);

  return (
    <Collapsible openLabel="掲載（キャンペーン）を作成">
      {() => (
        <form ref={formRef} action={action} className="space-y-4">
          <ErrorBox state={state} />
          {products.length === 0 ? (
            <p className="text-sm text-gray-500">
              先に「商品」を登録してください。
            </p>
          ) : (
            <>
              <div>
                <label className="label">対象商品 *</label>
                <select name="productId" className="input" required defaultValue="">
                  <option value="" disabled>
                    選択してください
                  </option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.brandName} / {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">掲載タイトル *</label>
                <input name="title" className="input" required />
              </div>
              <div>
                <label className="label">依頼内容・投稿条件</label>
                <textarea name="brief" rows={2} className="input" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">目標インフルエンサー数 *</label>
                  <input
                    name="targetInfluencers"
                    type="number"
                    min={1}
                    defaultValue={10}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="label">報酬タイプ *</label>
                  <select name="rewardType" className="input" defaultValue="GIFTING">
                    <option value="GIFTING">ギフティング（現物提供）</option>
                    <option value="PAID">金銭報酬</option>
                    <option value="BOTH">現物＋金銭</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="label">1人あたり報酬（円・PAID/BOTH時）</label>
                <input
                  name="rewardYen"
                  type="number"
                  min={0}
                  defaultValue={0}
                  className="input"
                />
              </div>

              <fieldset className="rounded-lg border border-gray-200 p-3">
                <legend className="px-1 text-sm font-medium text-gray-700">
                  収益モデル（ブランドへの課金・複数選択可）
                </legend>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(billingModelLabel).map(([value, label]) => (
                    <label
                      key={value}
                      className="flex items-center gap-2 text-sm text-gray-700"
                    >
                      <input
                        type="checkbox"
                        name="billingModels"
                        value={value}
                        defaultChecked={value === "PER_CAMPAIGN"}
                        className="h-4 w-4 rounded border-gray-300 text-sunny-500"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">キャンペーン費用（円）</label>
                  <input
                    name="campaignFeeYen"
                    type="number"
                    min={0}
                    defaultValue={0}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">販売手数料率（%）</label>
                  <input
                    name="salesCommissionPct"
                    type="number"
                    min={0}
                    max={100}
                    defaultValue={0}
                    className="input"
                  />
                </div>
              </div>

              <SubmitButton className="btn-primary">
                掲載を作成して募集開始
              </SubmitButton>
            </>
          )}
        </form>
      )}
    </Collapsible>
  );
}
