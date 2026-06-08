import "server-only";
import { prisma } from "@/lib/db";

/**
 * 管理操作の監査ログを記録する。
 * セキュリティ要件（誰が・いつ・何をしたか）を満たすため、
 * ADMIN による作成/更新/承認などの破壊的操作で必ず呼ぶ。
 */
export async function recordAudit(params: {
  actorId: string;
  action: string;
  target?: string;
  meta?: Record<string, unknown>;
}): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: params.actorId,
        action: params.action,
        target: params.target ?? "",
        meta: params.meta ? JSON.stringify(params.meta) : "",
      },
    });
  } catch (e) {
    // 監査記録の失敗で業務処理を止めないが、ログには残す
    console.error("[audit] failed to record", params.action, e);
  }
}
