"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { Icon } from "@/components/Icon";
import type { FormState } from "@/lib/actions/auth";
import { haptic } from "@/lib/haptics";
import { fireConfetti } from "@/components/fx/confetti";
import { toast } from "@/components/fx/Toast";
import {
  applyToCampaignAction,
  submitPostAction,
  updateProfileAction,
  updateAddressAction,
  updateBankAction,
  sendMessageAction,
  toggleFavoriteAction,
  toggleSnsAction,
  setNotifyAction,
} from "@/lib/actions/influencer";

function Submit({ children, className = "btn-primary w-full" }: { children: React.ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} className={className}>{pending ? "処理中…" : children}</button>;
}
function ErrBox({ s }: { s: FormState }) {
  if (!s?.error) return null;
  return <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-600">{s.error}</p>;
}
function OkBox({ s, msg }: { s: FormState; msg: string }) {
  if (!s?.ok) return null;
  return <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{msg}</p>;
}

// state が成功（ok）に変わった瞬間に一度だけ実行する。
function useOnOk(s: FormState, fn: () => void) {
  const done = useRef(false);
  useEffect(() => {
    if (s?.ok && !done.current) { done.current = true; fn(); }
    if (!s?.ok) done.current = false;
  }, [s, fn]);
}

function Sparkles() {
  const pts: [string, string, string][] = [["18%", "-16px", "-18px"], ["80%", "14px", "-16px"], ["50%", "0px", "-24px"], ["32%", "-10px", "-20px"], ["68%", "10px", "-18px"]];
  return (
    <>
      {pts.map(([l, dx, dy], i) => (
        <span key={i} className="spark go text-sunny-400" style={{ left: l, top: "55%", ["--dx" as string]: dx, ["--dy" as string]: dy } as React.CSSProperties}>✦</span>
      ))}
    </>
  );
}

export function ApplyForm({ campaignId }: { campaignId: string }) {
  const [open, setOpen] = useState(false);
  const [state, action] = useActionState<FormState, FormData>(applyToCampaignAction, undefined);
  useOnOk(state, () => { haptic("success"); fireConfetti({ y: 0.42 }); });
  if (state?.ok) return (
    <div className="success-pop relative overflow-hidden rounded-xl bg-emerald-50 px-4 py-3 text-center text-sm font-medium text-emerald-700">
      応募しました ✦ 案件管理で確認できます
      <Sparkles />
    </div>
  );
  if (!open) return <button onClick={() => { haptic("tap"); setOpen(true); }} className="btn-primary ripple-host w-full">この案件に応募する</button>;
  return (
    <form action={action} className="space-y-2">
      <ErrBox s={state} />
      <input type="hidden" name="campaignId" value={campaignId} />
      <textarea name="message" rows={2} placeholder="意気込みやアピールを一言（任意）" className="input" />
      <div className="flex gap-2"><Submit className="btn-primary ripple-host flex-1">応募を送る</Submit><button type="button" onClick={() => setOpen(false)} className="btn-ghost">やめる</button></div>
    </form>
  );
}

export function SubmitPostForm({ applicationId, defaultUrl, defaultReach }: { applicationId: string; defaultUrl: string; defaultReach: number }) {
  const [state, action] = useActionState<FormState, FormData>(submitPostAction, undefined);
  useOnOk(state, () => { haptic("success"); fireConfetti({ y: 0.5 }); toast.success("投稿を提出しました。確認をお待ちください"); });
  return (
    <form action={action} className="mt-4 space-y-2 border-t border-line pt-4">
      <ErrBox s={state} />
      <OkBox s={state} msg="提出しました。運営の確認をお待ちください。" />
      <p className="text-xs font-semibold text-muted">投稿 URL を提出</p>
      <input type="hidden" name="applicationId" value={applicationId} />
      <input name="postUrl" type="url" defaultValue={defaultUrl} placeholder="https://www.instagram.com/p/…" className="input" required />
      <input name="postReach" type="number" min={0} defaultValue={defaultReach || ""} placeholder="リーチ / 表示回数" className="input" />
      <Submit className="btn-primary ripple-host w-full">提出する</Submit>
    </form>
  );
}

export function ProfileForm({ name, bio, followers }: { name: string; bio: string; followers: number }) {
  const [state, action] = useActionState<FormState, FormData>(updateProfileAction, undefined);
  useOnOk(state, () => toast.success("プロフィールを保存しました"));
  return (
    <form action={action} className="space-y-4 p-5">
      <ErrBox s={state} /><OkBox s={state} msg="保存しました。" />
      <div><label className="label">表示名</label><input name="name" defaultValue={name} className="input" required /></div>
      <div><label className="label">フォロワー数</label><input name="followers" type="number" min={0} defaultValue={followers} className="input" /></div>
      <div><label className="label">自己紹介</label><textarea name="bio" rows={3} defaultValue={bio} className="input" /></div>
      <Submit className="btn-primary ripple-host w-full">保存する</Submit>
    </form>
  );
}
export function AddressForm({ address }: { address: string }) {
  const [state, action] = useActionState<FormState, FormData>(updateAddressAction, undefined);
  useOnOk(state, () => toast.success("住所を保存しました"));
  return (
    <form action={action} className="space-y-4 p-5">
      <p className="rounded-xl bg-sunny-50 px-4 py-3 text-xs text-sunny-800">ギフティング（現物提供）の発送先に使います。</p>
      <OkBox s={state} msg="住所を保存しました。" />
      <div><label className="label">住所</label><textarea name="address" rows={3} defaultValue={address} placeholder="〒 都道府県 市区町村 番地…" className="input" /></div>
      <Submit className="btn-primary ripple-host w-full">保存する</Submit>
    </form>
  );
}
export function BankForm({ bank }: { bank: string }) {
  const [state, action] = useActionState<FormState, FormData>(updateBankAction, undefined);
  useOnOk(state, () => toast.success("振込先を保存しました"));
  return (
    <form action={action} className="space-y-4 p-5">
      <p className="rounded-xl bg-sunny-50 px-4 py-3 text-xs text-sunny-800">金銭報酬はここへ振り込まれます。</p>
      <OkBox s={state} msg="振込先を保存しました。" />
      <div><label className="label">振込先（銀行・支店・口座）</label><textarea name="bank" rows={2} defaultValue={bank} placeholder="例）みずほ銀行 渋谷支店 普通 1234567" className="input" /></div>
      <Submit className="btn-primary ripple-host w-full">保存する</Submit>
    </form>
  );
}

export function MessageForm() {
  const [state, action] = useActionState<FormState, FormData>(sendMessageAction, undefined);
  useOnOk(state, () => haptic("tap"));
  return (
    <form action={action} key={state?.ok ? Math.random() : "f"} className="flex items-center gap-2 border-t border-line bg-surface p-3">
      <input name="text" className="input flex-1 rounded-full" placeholder="メッセージを入力…" autoComplete="off" required />
      <Submit className="ripple-host grid h-11 w-11 shrink-0 place-items-center rounded-full bg-sunny-500 text-white shadow-lift active:scale-95"><Icon name="send" className="h-5 w-5" /></Submit>
    </form>
  );
}

export function FavoriteButton({ campaignId, fav }: { campaignId: string; fav: boolean }) {
  const action = toggleFavoriteAction.bind(null, campaignId);
  const [go, setGo] = useState(false);
  return (
    <form action={action} className="absolute right-3 top-3">
      <button onClick={() => { setGo(true); haptic(fav ? "soft" : "select"); setTimeout(() => setGo(false), 600); }} className={`relative grid h-9 w-9 place-items-center rounded-full bg-white/85 backdrop-blur transition active:scale-90 ${fav ? "text-sunny-500" : "text-ink/40"}`}>
        <span className={`ring text-sunny-500 ${go ? "go" : ""}`} />
        <Icon name="heart" className={`h-5 w-5 ${go ? "burst" : ""}`} fill={fav} />
      </button>
    </form>
  );
}
export function SnsToggle({ which, linked }: { which: "ig" | "tt"; linked: boolean }) {
  const action = toggleSnsAction.bind(null, which);
  return (
    <form action={action}>
      <button onClick={() => { haptic("select"); toast.success(linked ? "連携を解除しました" : "連携しました"); }} className={`ripple-host rounded-full px-4 py-1.5 text-xs font-semibold transition active:scale-95 ${linked ? "bg-emerald-50 text-emerald-700" : "bg-sunny-500 text-white"}`}>{linked ? "連携済み" : "連携する"}</button>
    </form>
  );
}
export function NotifyToggle({ on }: { on: boolean }) {
  const action = setNotifyAction.bind(null, !on);
  return (
    <form action={action}>
      <button onClick={() => { haptic("select"); toast.success(on ? "通知をオフにしました" : "通知をオンにしました"); }} className={`relative block h-7 w-12 rounded-full transition active:scale-95 ${on ? "bg-sunny-500" : "bg-ink/15"}`}>
        <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${on ? "left-[1.375rem]" : "left-0.5"}`} />
      </button>
    </form>
  );
}
