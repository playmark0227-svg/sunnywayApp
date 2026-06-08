"use client";

import { useActionState, useState } from "react";
import { SubmitButton } from "@/components/SubmitButton";
import {
  applyToCampaignAction,
  submitPostAction,
  updateProfileAction,
} from "@/lib/actions/influencer";
import type { FormState } from "@/lib/actions/auth";

function ErrorBox({ state }: { state: FormState }) {
  if (!state?.error) return null;
  return (
    <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
      {state.error}
    </p>
  );
}

/** 応募ボタン → 一言メッセージ付きで応募 */
export function ApplyForm({ campaignId }: { campaignId: string }) {
  const [open, setOpen] = useState(false);
  const [state, action] = useActionState<FormState, FormData>(
    applyToCampaignAction,
    undefined
  );

  if (state?.ok) {
    return (
      <p className="rounded-lg bg-green-50 px-3 py-2 text-center text-sm font-medium text-green-700">
        応募しました！承認をお待ちください ✨
      </p>
    );
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="btn-primary w-full">
        この案件に応募する
      </button>
    );
  }

  return (
    <form action={action} className="space-y-2">
      <ErrorBox state={state} />
      <input type="hidden" name="campaignId" value={campaignId} />
      <textarea
        name="message"
        rows={2}
        placeholder="意気込みやアピールを一言（任意）"
        className="input"
      />
      <div className="flex gap-2">
        <SubmitButton className="btn-primary flex-1">応募を送る</SubmitButton>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="btn-ghost"
        >
          やめる
        </button>
      </div>
    </form>
  );
}

/** 投稿提出（承認後） */
export function SubmitPostForm({
  applicationId,
  defaultUrl,
  defaultReach,
}: {
  applicationId: string;
  defaultUrl: string;
  defaultReach: number;
}) {
  const [state, action] = useActionState<FormState, FormData>(
    submitPostAction,
    undefined
  );
  return (
    <form action={action} className="space-y-2">
      <ErrorBox state={state} />
      {state?.ok && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
          投稿を提出しました。ありがとうございます！
        </p>
      )}
      <input type="hidden" name="applicationId" value={applicationId} />
      <div>
        <label className="label">投稿 URL</label>
        <input
          name="postUrl"
          type="url"
          defaultValue={defaultUrl}
          placeholder="https://www.instagram.com/p/…"
          className="input"
          required
        />
      </div>
      <div>
        <label className="label">リーチ / 表示回数</label>
        <input
          name="postReach"
          type="number"
          min={0}
          defaultValue={defaultReach || 0}
          className="input"
        />
      </div>
      <SubmitButton className="btn-primary w-full">投稿を提出する</SubmitButton>
    </form>
  );
}

/** プロフィール編集 */
export function ProfileForm({
  bio,
  shippingAddress,
  followers,
}: {
  bio: string;
  shippingAddress: string;
  followers: number;
}) {
  const [state, action] = useActionState<FormState, FormData>(
    updateProfileAction,
    undefined
  );
  return (
    <form action={action} className="space-y-3">
      <ErrorBox state={state} />
      {state?.ok && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
          プロフィールを保存しました。
        </p>
      )}
      <div>
        <label className="label">フォロワー数</label>
        <input
          name="followers"
          type="number"
          min={0}
          defaultValue={followers}
          className="input"
        />
      </div>
      <div>
        <label className="label">自己紹介</label>
        <textarea name="bio" rows={2} defaultValue={bio} className="input" />
      </div>
      <div>
        <label className="label">発送先住所（ギフティング用）</label>
        <textarea
          name="shippingAddress"
          rows={2}
          defaultValue={shippingAddress}
          placeholder="現物提供の案件で使用します"
          className="input"
        />
      </div>
      <SubmitButton className="btn-primary w-full">保存する</SubmitButton>
    </form>
  );
}
