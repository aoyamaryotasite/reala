import "./globals.css";

import { Noto_Serif } from "next/font/google";

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  weight: ["400", "700"], // 必要なウェイト
  variable: "--font-geist-mono" // ← Geist Monoを上書き
});

export const metadata = { title: "My Page" };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={notoSerif.variable}>
      <body>{children}</body>
    </html>
  );
}

