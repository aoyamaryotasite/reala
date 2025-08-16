// app/layout.tsx もしくは app/layout.jsx
import "../styles/globals.css";
import { Barlow_Condensed } from "next/font/google";
import Script from "next/script";
import { cookies } from "next/headers";

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata = {
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  // サーバーで opt-out を判定（cookie: ga-opt-out=1）
  const gaOptOut = cookies().get("ga-opt-out")?.value === "1";
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
