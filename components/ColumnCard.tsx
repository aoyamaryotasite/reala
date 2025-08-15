import Link from "next/link";
import Image from "next/image";
import styles from "../styles/ColumnCard.module.css";
import { Column } from "../lib/microcms";

export default function ColumnCard({ item }: { item: Column }) {
  const href = `/columns/${item.slug ?? item.id}`;
  return (
    <article className={styles.card}>
      {item.eyecatch && (
        <Link href={href} className={styles.thumb}>
          <Image
            src={item.eyecatch.url}
            alt={item.title}
            width={item.eyecatch.width}
            height={item.eyecatch.height}
          />
        </Link>
      )}
      <div className={styles.body}>
        <h3 className={styles.title}>
          <Link href={href}>{item.title}</Link>
        </h3>
        {item.excerpt && <p className={styles.excerpt}>{item.excerpt}</p>}
        {item.category && (
          <Link href={`/columns/category/${item.category.slug ?? item.category.id}`} className={styles.cat}>
            {item.category.name}
          </Link>
        )}
      </div>
    </article>
  );
}
