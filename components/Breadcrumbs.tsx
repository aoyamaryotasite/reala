    // app/components/Breadcrumbs.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumbs() {
  const pathname = usePathname();
  if (!pathname) return null;

  // パスを / で分割
  const segments = pathname.split("/").filter(Boolean);

  // api配下はパンくずを出さない
  if (segments[0] === "api") return null;

  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <ol className="flex gap-2 text-sm">
        <li>
          <Link href="/">Home</Link>
        </li>
        {segments.map((segment, idx) => {
          const href = "/" + segments.slice(0, idx + 1).join("/");
          const isLast = idx === segments.length - 1;

          return (
            <li key={href} className="flex gap-2">
              <span>/</span>
              {isLast ? (
                <span>{segment}</span>
              ) : (
                <Link href={href}>{segment}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
