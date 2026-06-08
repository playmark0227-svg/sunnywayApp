import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { PageHeader, EmptyState } from "@/components/ui";
import { BrandForm } from "@/components/AdminForms";
import { yen } from "@/lib/labels";

export default async function BrandsPage() {
  await requireAdmin();
  const brands = await prisma.brand.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { products: true, campaigns: true } } },
  });

  return (
    <div>
      <PageHeader
        title="ブランド"
        description="コスメブランドは運営が管理します（ブランド自身は管理画面に入れません）"
        action={<BrandForm />}
      />

      {brands.length === 0 ? (
        <EmptyState>
          まだブランドがありません。右上の「＋ ブランドを追加」から登録してください。
        </EmptyState>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">ブランド</th>
                <th className="px-4 py-3">担当者</th>
                <th className="px-4 py-3">月額</th>
                <th className="px-4 py-3 text-center">商品</th>
                <th className="px-4 py-3 text-center">掲載</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {brands.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{b.name}</div>
                    {b.notes && (
                      <div className="text-xs text-gray-400">{b.notes}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {b.contactName || "—"}
                    {b.contactEmail && (
                      <div className="text-xs text-gray-400">
                        {b.contactEmail}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {b.monthlyFeeYen > 0 ? yen(b.monthlyFeeYen) : "—"}
                  </td>
                  <td className="px-4 py-3 text-center">{b._count.products}</td>
                  <td className="px-4 py-3 text-center">
                    {b._count.campaigns}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
