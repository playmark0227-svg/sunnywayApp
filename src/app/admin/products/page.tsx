import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { PageHeader, EmptyState } from "@/components/ui";
import { ProductForm, ProductEditButton } from "@/components/AdminForms";
import { Thumb, ART_BY_CATEGORY } from "@/components/Icon";
import { yen } from "@/lib/labels";

export default async function ProductsPage() {
  await requireAdmin();
  const [products, allBrands] = await Promise.all([
    prisma.product.findMany({ orderBy: { createdAt: "desc" }, include: { brand: { select: { name: true } }, _count: { select: { campaigns: true } } } }),
    prisma.brand.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, active: true } }),
  ]);
  // 新規登録は契約中ブランドのみ。編集は（停止中含む）全ブランドから選べる。
  const brands = allBrands.filter((b) => b.active).map(({ id, name }) => ({ id, name }));
  const brandsForEdit = allBrands.map(({ id, name }) => ({ id, name }));
  return (
    <div>
      <PageHeader title="商品" description="掲載はこの商品に紐づきます。" action={<ProductForm brands={brands} />} />
      {products.length === 0 ? (
        <EmptyState>{brands.length === 0 ? "先にブランドを登録してください。" : "まだ商品がありません。"}</EmptyState>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <div key={p.id} className="card overflow-hidden">
              <Thumb imageUrl={p.imageUrl} art={ART_BY_CATEGORY(p.category)} className="h-32" svgClass="h-16 w-16" />
              <div className="p-4">
                <span className="badge bg-ink/5 text-ink/60">{p.category}</span>
                <h3 className="mt-2 font-semibold text-ink">{p.name}</h3>
                <p className="text-xs text-muted">{p.brand.name}</p>
                <div className="mt-3 flex items-center justify-between text-sm"><span className="font-medium text-ink/80">{p.retailPriceYen > 0 ? yen(p.retailPriceYen) : "—"}</span><span className="text-xs text-muted">掲載 {p._count.campaigns} 件</span></div>
                <div className="mt-3 border-t border-line pt-3 text-right">
                  <ProductEditButton product={{ id: p.id, brandId: p.brandId, name: p.name, category: p.category, description: p.description, imageUrl: p.imageUrl, retailPriceYen: p.retailPriceYen }} brands={brandsForEdit} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
