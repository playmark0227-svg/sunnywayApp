import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { PageHeader, EmptyState } from "@/components/ui";
import { BrandForm } from "@/components/AdminForms";
import { yen } from "@/lib/labels";

export default async function BrandsPage() {
  await requireAdmin();
  const brands = await prisma.brand.findMany({ orderBy: { createdAt: "desc" }, include: { _count: { select: { products: true, campaigns: true } } } });
  return (
    <div>
      <PageHeader title="ブランド" description="運営が管理（ブランド自身は管理画面に入れません）" action={<BrandForm />} />
      {brands.length === 0 ? <EmptyState>まだブランドがありません。</EmptyState> : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead><tr className="text-left text-xs uppercase tracking-wider text-muted"><th className="px-5 py-3">ブランド</th><th className="px-5 py-3">担当者</th><th className="px-5 py-3">月額</th><th className="px-5 py-3 text-center">商品</th><th className="px-5 py-3 text-center">掲載</th></tr></thead>
            <tbody>
              {brands.map((b) => (
                <tr key={b.id} className="border-t border-line hover:bg-canvas">
                  <td className="px-5 py-4"><div className="font-semibold text-ink">{b.name}</div>{b.notes && <div className="text-xs text-muted">{b.notes}</div>}</td>
                  <td className="px-5 py-4 text-sm text-ink/70">{b.contactName || "—"}{b.contactEmail && <div className="text-xs text-muted">{b.contactEmail}</div>}</td>
                  <td className="px-5 py-4 text-sm text-ink/70">{b.monthlyFeeYen > 0 ? yen(b.monthlyFeeYen) : "—"}</td>
                  <td className="px-5 py-4 text-center text-sm">{b._count.products}</td>
                  <td className="px-5 py-4 text-center text-sm">{b._count.campaigns}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
