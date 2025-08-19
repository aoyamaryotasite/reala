import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HeroHeader from "../../../../components/HeroHeader";
import Footer from "../../../../components/Footer";
import ColumnSidebar from "../../../../components/ColumnSidebar";
import styles from "../../page.module.css";
import Image from "next/image";
import Link from "next/link";
import { getColumnById } from "../../../../lib/microcms"; // 新規: IDで取得

export const dynamic = "force-dynamic";       // 下書きはキャッシュしない
export const revalidate = 0;

type Props = {
  params: { id: string };
  searchParams?: { draftKey?: string };
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const post = await getColumnById(params.id, searchParams?.draftKey);
  if (!post) return {};
  const url = `https://reala-academy.com/columns/preview/${params.id}`;
  const ogImg = post.eyecatch?.url ?? "/og/og-image.jpg";
  return {
    title: `[Preview] ${post.title}`,
    description: post.excerpt ?? post.title,
    openGraph: { images: [{ url: ogImg }] },
  };
}

export default async function Page({ params, searchParams }: Props) {
  const post = await getColumnById(params.id, searchParams?.draftKey);
  if (!post) notFound();

  return (
    <>
      <HeroHeader />
      <div className={styles.container}>
        <main className={styles.main}>
          <p style={{ marginBottom: 8 }}>
            <Link href="/columns">Columns</Link>
            {post.category && (
              <> / <Link href={`/columns/category/${post.category.slug ?? post.category.id}`}>
                {post.category.name}
              </Link></>
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
      <Footer />
    </>
  );
}
