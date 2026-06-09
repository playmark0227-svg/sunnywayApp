import Link from "next/link";
import { SunMark } from "@/components/Icon";

export default function NotFound() {
  return (
    <main className="grid min-h-[100dvh] place-items-center bg-canvas px-6 text-center">
      <div>
        <SunMark className="mx-auto h-14 w-14" />
        <p className="display mt-5 text-2xl font-semibold text-ink">ページが見つかりません</p>
        <p className="mt-2 text-sm text-muted">URL をご確認ください。</p>
        <Link href="/" className="btn-primary mt-6 inline-flex">トップへ</Link>
      </div>
    </main>
  );
}
