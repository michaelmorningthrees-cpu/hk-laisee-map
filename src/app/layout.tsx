import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://hk-laisee-map.vercel.app'),
  title: "香港利是行情地圖 2026 🧧",
  description: "全港 18 區利是公價大公開！即刻睇下你區行情係幾多？",
  openGraph: {
    title: "香港利是行情地圖 2026 🧧",
    description: "全港 18 區利是公價大公開！即刻睇下你區行情係幾多？",
    type: "website",
    locale: "zh_HK",
    siteName: "香港利是行情地圖",
    url: "https://hk-laisee-map.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "香港利是行情地圖 2026 🧧",
    description: "全港 18 區利是公價大公開！即刻睇下你區行情係幾多？",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-HK">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
