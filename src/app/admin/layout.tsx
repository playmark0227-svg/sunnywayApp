import { requireAdmin } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { SunMark, Icon } from "@/components/Icon";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return (
    <div className="min-h-[100dvh] bg-canvas lg:flex">
      <aside className="border-b border-line bg-surface lg:flex lg:w-64 lg:shrink-0 lg:flex-col lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-2 px-6 py-5">
          <SunMark className="h-8 w-8" />
          <div><p className="display font-semibold leading-none text-ink">Sunnyway</p><p className="mt-1 text-[11px] text-muted">運営コンソール</p></div>
        </div>
        <AdminNav />
        <div className="mt-auto hidden p-3 lg:block">
          <div className="flex items-center gap-2 rounded-xl bg-canvas px-3 py-2">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-sunny-100 text-xs font-bold text-sunny-700">運</div>
            <div className="min-w-0 flex-1 text-xs"><p className="truncate font-semibold text-ink">{admin.name}</p><p className="truncate text-muted">管理者</p></div>
            <form action={logoutAction}><button className="text-muted hover:text-ink" title="ログアウト"><Icon name="logout" className="h-5 w-5" /></button></form>
          </div>
        </div>
      </aside>
      <main className="flex-1 px-6 py-8 lg:px-12 lg:py-10">{children}</main>
    </div>
  );
}
