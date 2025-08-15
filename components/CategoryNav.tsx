import Link from "next/link";
import styles from "../styles/CategoryNav.module.css";
import { getCategories } from "../lib/microcms";

export default async function CategoryNav({ current }: { current?: string }) {
  const { contents } = await getCategories();
  return (
    <nav className={styles.nav} aria-label="Categories">
      <Link className={!current ? styles.active : ""} href="/columns">All</Link>
      {contents.map(c => (
        <Link
          key={c.id}
          className={current === (c.slug ?? c.id) ? styles.active : ""}
          href={`/columns/category/${c.slug ?? c.id}`}
        >
          {c.name}
        </Link>
      ))}
    </nav>
  );
}
