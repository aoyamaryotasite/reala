// app/columns/page.tsx
import Link from "next/link";
import Image from "next/image";
import ColumnSidebar from "../../components/ColumnSidebar";
import styles from "./page.module.css";
import { getColumns } from "../../lib/microcms";
import Footer from "../../components/Footer";
import HeroHeader from "../../components/HeroHeader";

export const revalidate = 300;

// Promise で受け取る searchParams の型を自前定義
type SearchParamsPromise<T extends Record<string, string | undefined>> = Promise<T>;

export default async function ColumnsPage({
  searchParams,
}: {
  searchParams: SearchParamsPromise<{ page?: string; q?: string }>;
}) {
  const sp = await searchParams; // ← Next 15 では await が必要

  const pageNum = Number(sp?.page ?? "1");
  const page = Number.isFinite(pageNum) && pageNum > 0 ? pageNum : 1;
  const q = sp?.q?.trim() || undefined;

  const PER_PAGE = 10;
  const offset = (page - 1) * PER_PAGE;

  const { contents, totalCount } = await getColumns({
    limit: PER_PAGE,
    offset,
    orders: "-publishedAt",
    fields: "id,title,slug,excerpt,eyecatch,category,publishedAt,revisedAt",
    ...(q ? { q } : {}),
  });

  const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE));

  return (
    <>
      <HeroHeader />
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 style={{ fontSize: 32, marginBottom: 16 }}>Columns</h1>
          {q && (
            <p>
              Search results for: <strong>{q}</strong>
            </p>
          )}

          {totalCount === 0 && <p>No posts yet.</p>}

          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {contents.map((post) => {
              const href = `/columns/${post.slug ?? post.id}`;
              return (
                <li
                  key={post.id}
                  style={{ padding: "16px 0", borderBottom: "1px solid #eee" }}
                >
                  <article className={styles.article}>
                    {post.eyecatch && (
                      <Link href={href}>
                        <Image
                          src={post.eyecatch.url}
                          alt={post.title}
                          width={160}
                          height={Math.round(
                            160 * (post.eyecatch.height / post.eyecatch.width)
                          )}
                          style={{ width: "100%", height: "auto" }} // スマホ時に横幅合わせ
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
                        <p
                          style={{
                            margin: "8px 0 0",
                            fontSize: 12,
                            color: "#60707a",
                          }}
                        >
                          {post.category.name}
                        </p>
                      )}

                      {/* 投稿日と更新日 */}
                      <p style={{ margin: "4px 0 0", fontSize: 12, color: "#888" }}>
                        Published:{" "}
                        {new Date(post.publishedAt).toLocaleDateString("ja-JP")}
                        {post.revisedAt &&
                          post.revisedAt !== post.publishedAt && (
                            <>
                              {" "}
                              （Updated:{" "}
                              {new Date(post.revisedAt).toLocaleDateString("ja-JP")}
                              ）
                            </>
                          )}
                      </p>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>

          {/* Pager */}
          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 20,
              alignItems: "center",
            }}
          >
            {page > 1 && (
              <Link
                href={`/columns?${new URLSearchParams({
                  ...(q ? { q } : {}),
                  page: String(page - 1),
                }).toString()}`}
              >
                ← Prev
              </Link>
            )}
            <span>
              Page {page} / {totalPages}
            </span>
            {page < totalPages && (
              <Link
                href={`/columns?${new URLSearchParams({
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
