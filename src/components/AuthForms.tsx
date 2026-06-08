"use client";

import { useActionState } from "react";
import { SubmitButton } from "@/components/SubmitButton";
import {
  loginAction,
  registerInfluencerAction,
  type FormState,
} from "@/lib/actions/auth";

function ErrorBox({ state }: { state: FormState }) {
  if (!state?.error) return null;
  return (
    <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
      {state.error}
    </p>
  );
}

export function LoginForm({ role }: { role: "ADMIN" | "INFLUENCER" }) {
  const action = loginAction.bind(null, role);
  const [state, formAction] = useActionState<FormState, FormData>(
    action,
    undefined
  );
  return (
    <form action={formAction} className="space-y-4">
      <ErrorBox state={state} />
      <div>
        <label className="label" htmlFor="email">
          メールアドレス
        </label>
        <input id="email" name="email" type="email" className="input" required />
      </div>
      <div>
        <label className="label" htmlFor="password">
          パスワード
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="input"
          required
        />
      </div>
      <SubmitButton>ログイン</SubmitButton>
    </form>
  );
}

export function RegisterForm() {
  const [state, formAction] = useActionState<FormState, FormData>(
    registerInfluencerAction,
    undefined
  );
  return (
    <form action={formAction} className="space-y-4">
      <ErrorBox state={state} />
      <div>
        <label className="label" htmlFor="name">
          お名前
        </label>
        <input id="name" name="name" className="input" required />
      </div>
      <div>
        <label className="label" htmlFor="handle">
          SNS ハンドル（@なし）
        </label>
        <input id="handle" name="handle" className="input" required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label" htmlFor="platform">
            主な媒体
          </label>
          <select id="platform" name="platform" className="input">
            <option value="INSTAGRAM">Instagram</option>
            <option value="TIKTOK">TikTok</option>
            <option value="YOUTUBE">YouTube</option>
            <option value="X">X (Twitter)</option>
          </select>
        </div>
        <div>
          <label className="label" htmlFor="followers">
            フォロワー数
          </label>
          <input
            id="followers"
            name="followers"
            type="number"
            min={0}
            defaultValue={0}
            className="input"
          />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="email">
          メールアドレス
        </label>
        <input id="email" name="email" type="email" className="input" required />
      </div>
      <div>
        <label className="label" htmlFor="password">
          パスワード（8文字以上）
        </label>
        <input
          id="password"
          name="password"
          type="password"
          minLength={8}
          className="input"
          required
        />
      </div>
      <SubmitButton>登録して始める</SubmitButton>
    </form>
  );
}
