"use client";

export default function AppError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="grid min-h-[75dvh] place-items-center px-6 text-center">
      <div>
        <p className="display text-xl font-semibold text-ink">問題が発生しました</p>
        <p className="mt-2 text-sm text-muted">時間をおいて再度お試しください。</p>
        <button onClick={reset} className="btn-primary mt-5">再読み込み</button>
      </div>
    </div>
  );
}
