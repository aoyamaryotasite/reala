import { createClient, MicroCMSQueries } from "microcms-js-sdk";

export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN!,
  apiKey: process.env.MICROCMS_API_KEY!,
});

export type Category = {
  id: string;
  name: string;
  slug?: string;
};

export type Eyecatch = {
  url: string;
  width: number;
  height: number;
};

export type Column = {
  id: string;
  title: string;
  slug?: string;        // slugフィールドを使う場合
  excerpt?: string;
  content: string;      // リッチエディタ（HTML）
  eyecatch?: Eyecatch;
  category?: Category;
  publishedAt?: string;
  revisedAt?: string;
};

const COL_ENDPOINT = "columns";
const CAT_ENDPOINT = "categories";

export async function getCategories() {
  return client.getList<Category>({ endpoint: CAT_ENDPOINT, queries: { limit: 100 } });
}

export async function getColumns(queries: MicroCMSQueries = {}) {
  return client.getList<Column>({ endpoint: COL_ENDPOINT, queries });
}

/** slug で記事を1件取得（なければ id で取得） */
export async function getColumnBySlug(slugOrId: string) {
  // slugフィールドを使っているケース
  const bySlug = await client.getList<Column>({
    endpoint: COL_ENDPOINT,
    queries: { limit: 1, filters: `slug[equals]${slugOrId}` },
  });
  if (bySlug.totalCount > 0) return bySlug.contents[0];

  // コンテンツID=スラッグで運用しているケース
  return client.getListDetail<Column>({ endpoint: COL_ENDPOINT, contentId: slugOrId });
}

/** id で1件取得（draftKey対応） */
export async function getColumnById(id: string, draftKey?: string) {
  // microcms-js-sdk は queries で draftKey を渡せる
  const queries: MicroCMSQueries = draftKey ? { draftKey } : {};
  try {
    return await client.getListDetail<Column>({
      endpoint: COL_ENDPOINT,
      contentId: id,
      queries,
    });
  } catch {
    return null;
  }
}