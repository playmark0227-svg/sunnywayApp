import { prisma } from "@/lib/db";

// ------------------------------------------------------------
// メール送信レイヤー
// - RESEND_API_KEY が設定されていれば Resend API で実送信（依存パッケージ不要）
// - 未設定の環境（開発・デモ）では送信せず MailLog に「記録のみ」として残す
// - どちらの場合も全送信内容を MailLog に記録する（運営の送信履歴）
// 本番セットアップ: 環境変数 RESEND_API_KEY と MAIL_FROM（例: "Sunnyway <info@sunnyway.jp>"）
// ------------------------------------------------------------

export type MailResult = { status: "SENT" | "LOGGED" | "ERROR"; error?: string };

export async function sendMail({ to, subject, body }: { to: string; subject: string; body: string }): Promise<MailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  let result: MailResult;

  if (!apiKey) {
    // プロバイダ未設定 → 記録のみ（デモ・開発環境）
    result = { status: "LOGGED" };
  } else {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          from: process.env.MAIL_FROM || "Sunnyway <onboarding@resend.dev>",
          to: [to],
          subject,
          text: body,
        }),
      });
      if (res.ok) {
        result = { status: "SENT" };
      } else {
        const detail = await res.text().catch(() => "");
        result = { status: "ERROR", error: `Resend ${res.status}: ${detail.slice(0, 300)}` };
      }
    } catch (e) {
      result = { status: "ERROR", error: e instanceof Error ? e.message : String(e) };
    }
  }

  await prisma.mailLog.create({ data: { to, subject, body, status: result.status, error: result.error ?? "" } });
  return result;
}
