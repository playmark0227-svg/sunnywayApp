import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { PageHeader, EmptyState } from "@/components/ui";
import { ProductForm } from "@/components/AdminForms";
import { yen } from "@/lib/labels";

export default async function ProductsPage() {
  await requireAdmin();
  const [products, brands] = await Promise.all([
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        brand: { select: { name: true } },
        _count: { select: { campaigns: true } },
      },
    }),
    prisma.brand.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <div>
      <PageHeader
        title="商品"
        description="ブランドの商品を登録します。掲載（キャンペーン）はこの商品に紐づきます。"
        action={<ProductForm brands={brands} />}
      />

      {products.length === 0 ? (
        <EmptyState>
          {brands.length === 0
            ? "先にブランドを登録してください。"
            : "まだ商品がありません。「＋ 商品を追加」から登録してください。"}
        </EmptyState>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <div key={p.id} className="card overflow-hidden">
              <div className="flex h-32 items-center justify-center bg-sunny-50">
                {p.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-4xl">💄</span>
                )}
              </div>
              <div className="p-4">
                <span className="badge bg-gray-100 text-gray-600">
                  {p.category}
                </span>
                <h3 className="mt-2 font-semibold text-gray-900">{p.name}</h3>
                <p className="text-xs text-gray-500">{p.brand.name}</p>
                {p.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                    {p.description}
                  </p>
                )}
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">
                    {p.retailPriceYen > 0 ? yen(p.retailPriceYen) : "—"}
                  </span>
                  <span className="text-xs text-gray-400">
                    掲載 {p._count.campaigns} 件
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
