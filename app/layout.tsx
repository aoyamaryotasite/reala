// app/layout.tsx もしくは app/layout.jsx
import "../styles/globals.css";
import { Barlow_Condensed } from "next/font/google";
import Script from "next/script";
import { cookies } from "next/headers";
import type { Metadata } from 'next';



const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const SITE_NAME = "REALA Japanese Academy";
const SITE_URL = "https://www.reala-academy.com/"; 
const MEASUREMENT_ID = "G-E1EY692JJC";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: "REALA Japanese Academy's lessons are tailored, one-on-one online Japanese lessons, customized to each student's specific goals and objectives.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: "REALA Japanese Academy's lessons are tailored, one-on-one online Japanese lessons, customized to each student's specific goals and objectives.",
    images: [
      {
        url: "/ogp.jpg", // ★public配下のパス
        width: 500,
        height: 350,
        alt: `${SITE_NAME} OGP`,
      },
    ],
    locale: "en_US", 
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: "REALA Japanese Academy's lessons are tailored, one-on-one online Japanese lessons, customized to each student's specific goals and objectives.",
    images: ["/ogp.jpg"],
  },
  alternates: {
    canonical: SITE_URL, // ルートのcanonical
  },
  robots: {
    index: true,
    follow: true,
    // ニーズに応じて
    // nocache: false,
    googleBot: { index: true, follow: true },
  },
  verification: {
    // Search Console等があれば
    // google: "xxxxxxxxxxxxxxxxxxxx",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // サーバーで opt-out を判定（cookie: ga-opt-out=1）
  const cookieStore = await cookies();
  const gaOptOut = cookieStore.get("ga-opt-out")?.value === "1";
  const MEASUREMENT_ID = "G-E1EY692JJC";

  return (
    <html
      lang="en"
      className={barlowCondensed.className}
      suppressHydrationWarning
    >
      <body>
        {/* --- GA4（無効化フラグは SSR と同条件に） --- */}
        <Script id="ga-disable-flag" strategy="beforeInteractive">
          {`window['ga-disable-${MEASUREMENT_ID}'] = ${
            gaOptOut ? "true" : "false"
          };`}
        </Script>

        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${MEASUREMENT_ID}');
          `}
        </Script>
        {/* --- end GA4 --- */}
        {children}
      </body>
    </html>
  );
}
