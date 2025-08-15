import Link from "next/link";
import styles from "../app/columns/page.module.css";
import { getColumns, getCategories } from "../lib/microcms";

export default async function ColumnSidebar() {
  const [{ contents: latest }, { contents: cats }] = await Promise.all([
    getColumns({ limit: 6, orders: "-publishedAt", fields: "id,slug,title" }),
    getCategories?.() ?? Promise.resolve({ contents: [] as any[] } as any),
  ]);

  return (
    <aside className={styles.sidebar}>
      {/* Search */}
      <div className={styles.card}>
        <h3>Search</h3>
        <form action="/columns" method="GET" className={styles.inputWrap}>
          <input
            className={styles.searchInput}
            type="search"
            name="q"
            placeholder="Search columns"
          />
          <button className={styles.searchBtn} type="submit">Search</button>
        </form>
      </div>

      {/* Latest */}
      <div className={styles.card}>
        <h3>Latest</h3>
        <ul className={styles.latestList}>
          {latest.map((p) => (
            <li key={p.id} className={styles.latestItem}>
              <Link
                className={styles.latestLink}
                href={`/columns/${p.slug ?? p.id}`}
              >
                {p.title}
              </Link>
            </li>
          ))}
        </ul>
        <hr className={styles.hr} />
        <Link className={styles.moreLink} href="/columns">View all →</Link>
      </div>

      {/* Categories（存在する場合だけ） */}
      {cats?.length > 0 && (
        <div className={styles.card}>
          <h3>Categories</h3>
          <ul className={styles.catList}>
            {cats.map((c: any) => (
              <li key={c.id} className={styles.catItem}>
                <Link
                  className={styles.catLink}
                  href={`/columns/category/${c.slug ?? c.id}`}
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
