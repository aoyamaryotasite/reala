import type { Metadata, PageProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getColumnBySlug } from "../../../lib/microcms";
import styles from "../page.module.css";
import ColumnSidebar from "../../../components/ColumnSidebar";

type Props = PageProps<{ slug: string }>;

export const revalidate = 600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getColumnBySlug(params.slug);
  if (!post) return {};

  const url = `https://www.example.com/columns/${params.slug}`;
  const ogImg = post.eyecatch?.url ?? "/og/og-image.jpg";

  return {
    title: post.title,
    description: post.excerpt ?? post.title,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.excerpt ?? post.title,
      images: [{ url: ogImg }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt ?? post.title,
      images: [ogImg],
    },
  };
}

export default async function ColumnDetail({ params }: Props) {
  const post = await getColumnBySlug(params.slug);
  if (!post) return notFound();

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <p style={{ marginBottom: 8 }}>
          <Link href="/columns">Columns</Link>
          {post.category && (
            <>
              {" "} / {" "}
              <Link href={`/columns/category/${post.category.slug ?? post.category.id}`}>
                {post.category.name}
              </Link>
            </>
          )}
        </p>

        <h1 style={{ fontSize: 32, margin: "6px 0 12px" }}>{post.title}</h1>

        {post.eyecatch && (
          <div style={{ margin: "16px 0" }}>
            <Image
              src={post.eyecatch.url}
              className={styles.eyecatch}
              alt={post.title}
              width={post.eyecatch.width}
              height={post.eyecatch.height}
              sizes="(min-width: 900px) 720px, 92vw"
              priority
            />
          </div>
        )}

        <article
          className={styles.postBody}
          dangerouslySetInnerHTML={{ __html: post.content ?? "" }}
        />
      </main>

      <ColumnSidebar />
    </div>
  );
}
