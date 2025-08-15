import type { Metadata } from "next";
import ColumnCard from "../../../../components/ColumnCard";
import CategoryNav from "../../../../components/CategoryNav";
import { getCategories, getColumns } from "../../../../lib/microcms";

type Props = { params: { category: string }, searchParams?: { page?: string } };

export const revalidate = 600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const url = `https://www.example.com/columns/category/${params.category}`;
  return {
    title: `Category: ${params.category}`,
    alternates: { canonical: url },
  };
}

const PER_PAGE = 10;

export default async function CategoryPage({ params, searchParams }: Props) {
  const page = Number(searchParams?.page ?? "1");
  const offset = (page - 1) * PER_PAGE;

  // slug でも id でもヒットさせたいので filters を OR で
  const catIdOrSlug = params.category;
  const { contents, totalCount } = await getColumns({
    limit: PER_PAGE,
    offset,
    orders: "-publishedAt",
    filters: `category[equals]${catIdOrSlug} || category[equals]${catIdOrSlug}`,
    // ↑ slug参照を使っていない場合もあるため、「idと同値」として扱う想定
  });

  // 本当はカテゴリ名を出したいので、取得して解決
  const cats = await getCategories();
  const current = cats.contents.find(c => (c.slug ?? c.id) === catIdOrSlug);

  const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE));

  return (
    <main style={{ width: "min(900px,92vw)", margin: "64px auto" }}>
      <h1 style={{ fontSize: "28px", marginBottom: 6 }}>
        Category: {current?.name ?? params.category}
      </h1>
      <CategoryNav current={catIdOrSlug} />

      {contents.map((item) => (
        <ColumnCard key={item.id} item={item} />
      ))}

      <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
        {page > 1 && (
          <a href={`/columns/category/${catIdOrSlug}?page=${page - 1}`}>← Prev</a>
        )}
        <span>Page {page} / {totalPages}</span>
        {page < totalPages && (
          <a href={`/columns/category/${catIdOrSlug}?page=${page + 1}`}>Next →</a>
        )}
      </div>
    </main>
  );
}
