import type { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "../../page.module.css";
import HeroHeader from "../../../../components/HeroHeader";
import ColumnSidebar from "../../../../components/ColumnSidebar";
import Footer from "../../../../components/Footer";
import { getColumnById } from "../../../../lib/microcms";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// ← /columns/[slug] と同じ方針で Promise を明示
type ParamsPromise<T extends Record<string, string>> = Promise<T>;

type PageProps = {
  params: ParamsPromise<{ id: string }>;
  searchParams?: { draftKey?: string };
};

export async function generateMetadata(
  { params, searchParams }: PageProps,
  _parent?: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;                  // ← await が必須
  const post = await getColumnById(id, searchParams?.draftKey);
  if (!post) return {};
  const ogImg = post.eyecatch?.url ?? "/og/og-image.jpg";
  return {
    title: `[Preview] ${post.title}`,
    description: post.excerpt ?? post.title,
    openGraph: { images: [{ url: ogImg }] },
  };
}

export default async function Page({ params, searchParams }: PageProps) {
  const { id } = await params;                  // ← await
  const post = await getColumnById(id, searchParams?.draftKey);
  if (!post) notFound();

  return (
    <>
      <HeroHeader />
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
      <Footer />
    </>
  );
}
