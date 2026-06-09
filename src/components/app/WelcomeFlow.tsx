"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { Icon, SunMark } from "@/components/Icon";
import {
  loginAction,
  registerInfluencerAction,
  type FormState,
} from "@/lib/actions/auth";

const SLIDES = [
  { brand: true, sub: "好きなコスメで、つながる。" },
  { art: "serum", icon: "heart", tint: "linear-gradient(135deg,#FDEFE7,#FBE6EC)", title: "好きなコスメに、出会う。", sub: "あなたに合った案件が、毎日届く。" },
  { art: "lipstick", icon: "send", tint: "linear-gradient(135deg,#FBE6EC,#F6DCEA)", title: "応募して、投稿するだけ。", sub: "面倒な手続きはなし。スマホひとつで完結。" },
  { art: "jar", icon: "receipt", tint: "linear-gradient(135deg,#F4EFE6,#FBEFD9)", title: "報酬は、まっすぐ届く。", sub: "ギフティングも金銭報酬も、振込まで一元管理。" },
];
const ART: Record<string, string> = {
  serum: '<rect x="23" y="33" width="18" height="34" rx="7"/><path d="M28 33v-5h8v5"/><rect x="29" y="15" width="6" height="9" rx="2"/><path d="M32 24v5"/><path d="M27 47h10"/>',
  jar: '<rect x="18" y="39" width="28" height="25" rx="10"/><rect x="23" y="27" width="18" height="12" rx="5"/><path d="M26 50h12"/>',
  lipstick: '<rect x="25" y="41" width="14" height="25" rx="4"/><path d="M27 41v-7h10v7"/><path d="M28.5 34l3.5-9 3.5 9"/>',
};

function Submit({ children, className = "btn-primary w-full" }: { children: React.ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} className={className}>{pending ? "処理中…" : children}</button>;
}
function ErrBox({ s }: { s: FormState }) {
  if (!s?.error) return null;
  return <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-600">{s.error}</p>;
}

export function WelcomeFlow() {
  const [step, setStep] = useState<"onboard" | "auth" | "login" | "register">("onboard");
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    if (localStorage.getItem("sw_onboarded") === "1") setStep("auth");
  }, []);
  const finishOnboard = () => { localStorage.setItem("sw_onboarded", "1"); setStep("auth"); };

  if (step === "onboard") {
    const s = SLIDES[slide];
    const last = slide === SLIDES.length - 1;
    const next = () => (last ? finishOnboard() : setSlide(slide + 1));
    const dots = (
      <div className="flex gap-2">
        {SLIDES.map((_, i) => <span key={i} className={`h-2 rounded-full transition-all ${i === slide ? "w-6 bg-white" : "w-2 bg-white/40"}`} style={s.brand ? {} : { background: i === slide ? "#EC5A36" : "rgba(36,30,26,.15)" }} />)}
      </div>
    );
    if (s.brand) {
      return (
        <main className="fade grad-move flex min-h-[100dvh] flex-col items-center justify-center bg-sunrise px-8 text-center text-white">
          <div className="relative">
            <div className="spin-slow absolute -inset-8 rounded-full" style={{ background: "conic-gradient(from 0deg, rgba(255,255,255,0), rgba(255,255,255,.4), rgba(255,255,255,0) 60%)" }} />
            <div className="breathe pop relative"><SunMark className="h-24 w-24 shadow-lift" /></div>
          </div>
          <h1 className="reveal display mt-8 text-4xl font-semibold tracking-wide">Sunnyway</h1>
          <p className="reveal mt-3 text-white/85" style={{ animationDelay: "120ms" }}>{s.sub}</p>
          <div className="mt-12">{dots}</div>
          <button onClick={next} className="sheen reveal mt-8 w-full max-w-xs rounded-full bg-white py-3.5 text-base font-semibold text-sunny-600 active:scale-[.98]" style={{ animationDelay: "220ms" }}>はじめる</button>
        </main>
      );
    }
    return (
      <main className="fade flex min-h-[100dvh] flex-col bg-canvas px-7" style={{ paddingTop: "max(1rem,env(safe-area-inset-top))" }}>
        <div className="flex justify-end py-2"><button onClick={finishOnboard} className="rounded-full px-3 py-2 text-sm font-medium text-muted">スキップ</button></div>
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="relative grid h-64 w-64 place-items-center rounded-[2.5rem] shadow-card" style={{ background: s.tint }}>
            <svg className="h-32 w-32 text-ink/55" viewBox="0 0 64 80" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: ART[s.art!] }} />
            <span className="absolute -right-3 -top-3 grid h-12 w-12 place-items-center rounded-2xl bg-surface text-sunny-500 shadow-soft"><Icon name={s.icon!} className="h-6 w-6" /></span>
          </div>
          <h2 className="display mt-10 text-2xl font-semibold leading-snug text-ink">{s.title}</h2>
          <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-muted">{s.sub}</p>
        </div>
        <div className="flex items-center justify-between pb-10" style={{ paddingBottom: "max(2.5rem,env(safe-area-inset-bottom))" }}>
          {dots}
          <button onClick={next} className="btn-primary px-7">{last ? "はじめる" : "次へ"} <Icon name="chevron" className="h-4 w-4" /></button>
        </div>
      </main>
    );
  }

  return (
    <main className="fade flex min-h-[100dvh] flex-col bg-canvas px-7">
      <div className="flex flex-1 flex-col justify-center py-10">
        <div className="mb-9 text-center"><SunMark className="mx-auto h-16 w-16" />
          <h1 className="display mt-5 text-3xl font-semibold text-ink">{step === "login" ? "おかえりなさい" : "はじめよう"}</h1>
          <p className="mt-2 text-sm text-muted">{step === "login" ? "ログインして続けます。" : "数秒で登録。好きな案件にすぐ応募できます。"}</p>
        </div>

        {step === "auth" && (
          <div className="space-y-3">
            <button onClick={() => setStep("register")} className="flex w-full items-center justify-center gap-2.5 rounded-full bg-ink py-3.5 text-base font-semibold text-white active:scale-[.99]"><Icon name="insta" className="h-5 w-5" /> Instagram で続ける</button>
            <button onClick={() => setStep("register")} className="flex w-full items-center justify-center gap-2.5 rounded-full border border-line bg-surface py-3.5 text-base font-semibold text-ink active:scale-[.99]"><Icon name="mail" className="h-5 w-5" /> メールアドレスで続ける</button>
            <div className="my-6 flex items-center gap-3 text-xs text-muted"><span className="h-px flex-1 bg-line" />すでにアカウントをお持ちの方<span className="h-px flex-1 bg-line" /></div>
            <button onClick={() => setStep("login")} className="w-full rounded-full bg-sunny-50 py-3.5 text-base font-semibold text-sunny-700 active:scale-[.99]">ログイン</button>
          </div>
        )}

        {step === "register" && <RegisterForm onBack={() => setStep("auth")} />}
        {step === "login" && <LoginForm onBack={() => setStep("auth")} />}
      </div>
      <p className="pb-8 text-center text-[11px] leading-relaxed text-muted" style={{ paddingBottom: "max(2rem,env(safe-area-inset-bottom))" }}>続行することで <span className="underline">利用規約</span> と <span className="underline">プライバシーポリシー</span> に同意したものとみなされます。</p>
    </main>
  );
}

function RegisterForm({ onBack }: { onBack: () => void }) {
  const [state, action] = useActionState<FormState, FormData>(registerInfluencerAction, undefined);
  return (
    <form action={action} className="space-y-3">
      <ErrBox s={state} />
      <div className="grid grid-cols-2 gap-3">
        <div><label className="label">お名前</label><input name="name" className="input" required /></div>
        <div><label className="label">ハンドル(@なし)</label><input name="handle" className="input" required /></div>
      </div>
      <input type="hidden" name="platform" value="INSTAGRAM" />
      <input type="hidden" name="followers" value="0" />
      <div><label className="label">メールアドレス</label><input name="email" type="email" className="input" required /></div>
      <div><label className="label">パスワード(8文字以上)</label><input name="password" type="password" minLength={8} className="input" required /></div>
      <Submit>登録して始める</Submit>
      <button type="button" onClick={onBack} className="w-full py-2 text-sm text-muted">← もどる</button>
    </form>
  );
}
function LoginForm({ onBack }: { onBack: () => void }) {
  const bound = loginAction.bind(null, "INFLUENCER");
  const [state, action] = useActionState<FormState, FormData>(bound, undefined);
  return (
    <form action={action} className="space-y-3">
      <ErrBox s={state} />
      <div><label className="label">メールアドレス</label><input name="email" type="email" className="input" required /></div>
      <div><label className="label">パスワード</label><input name="password" type="password" className="input" required /></div>
      <Submit>ログイン</Submit>
      <button type="button" onClick={onBack} className="w-full py-2 text-sm text-muted">← もどる</button>
    </form>
  );
}
