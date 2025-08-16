import "../styles/globals.css";

import {Barlow_Condensed} from 'next/font/google'



const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '700'], // 必要なウェイトに変更
  display: 'swap',
})

export const metadata = {   icons: {
    icon: '/favicon.ico',
  },};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${barlowCondensed.className}`}>
      <body>{children}</body>
    </html>
  );
}

