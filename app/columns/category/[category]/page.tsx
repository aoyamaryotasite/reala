// app/columns/category/[category]/page.tsx
import type { PageProps } from "next";
import Link from "next/link";
import Image from "next/image";
import styles from "../../page.module.css";
import ColumnSidebar from "../../../../components/ColumnSidebar";
import Footer from "../../../../components/Footer";
import HeroHeader from "../../../../components/HeroHeader";
import { getColumns } from "../../../../lib/microcms";

export const revalidate = 300;

export default async function CategoryPage(
  { params, searchParams }: PageProps<{ category: string }>
) {
  const { category } = await params;          // ← 必須
  const sp = await searchParams;              // ← 必須

  const PER_PAGE = 10;
  const pageNum = Number(sp?.page ?? "1");
  const page = Number.isFinite(pageNum) && pageNum > 0 ? pageNum : 1;
  const q = sp?.q?.trim() || undefined;
  const offset = (page - 1) * PER_PAGE;

  const { contents, totalCount } = await getColumns({
    limit: PER_PAGE,
    offset,
    orders: "-publishedAt",
    fields: "id,title,slug,excerpt,eyecatch,category,publishedAt",
    // microCMS 例: カテゴリーが slug の場合
    filters: `category[equals]${category}`,
    ...(q ? { q } : {}),
  });

  const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE));

  return (
    <>
      <HeroHeader />
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 style={{ fontSize: 28, marginBottom: 12 }}>
            Category: {category}
          </h1>
          {q && <p>Search results for: <strong>{q}</strong></p>}
          {totalCount === 0 && <p>No posts yet.</p>}

          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {contents.map((post) => {
              const href = `/columns/${post.slug ?? post.id}`;
              return (
                <li key={post.id} style={{ padding: "16px 0", borderBottom: "1px solid #eee" }}>
                  <article style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 16 }}>
                    {post.eyecatch && (
                      <Link href={href}>
                        <Image
                          src={post.eyecatch.url}
                          alt={post.title}
                          width={160}
                          height={Math.round(160 * (post.eyecatch.height / post.eyecatch.width))}
                        />
                      </Link>
                    )}
                    <div>
                      <h2 style={{ margin: "0 0 6px", fontSize: 20 }}>
                        <Link href={href}>{post.title}</Link>
                      </h2>
                      {post.excerpt && (
                        <p style={{ margin: 0, color: "#4b5a63" }}>{post.excerpt}</p>
                      )}
                      {post.category && (
                        <p style={{ margin: "8px 0 0", fontSize: 12, color: "#60707a" }}>
                          {post.category.name}
                        </p>
                      )}
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>

          {/* Pager */}
          <div style={{ display: "flex", gap: 12, marginTop: 20, alignItems: "center" }}>
            {page > 1 && (
              <Link
                href={`/columns/category/${category}?${new URLSearchParams({
                  ...(q ? { q } : {}),
                  page: String(page - 1),
                }).toString()}`}
              >
                ← Prev
              </Link>
            )}
            <span>Page {page} / {totalPages}</span>
            {page < totalPages && (
              <Link
                href={`/columns/category/${category}?${new URLSearchParams({
                  ...(q ? { q } : {}),
                  page: String(page + 1),
                }).toString()}`}
              >
                Next →
              </Link>
            )}
          </div>
        </main>

        <ColumnSidebar />
      </div>
      <Footer />
    </>
  );
}
