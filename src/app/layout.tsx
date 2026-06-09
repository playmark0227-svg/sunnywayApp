import type { Metadata, Viewport } from "next";
import { Montserrat, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { PwaRegister } from "@/components/PwaRegister";

// 見出しの欧文＝Montserrat、和文・本文＝Noto Sans JP（公式サイトに準拠）
const display = Montserrat({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});
const noto = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-noto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sunnyway",
  description: "サプライズを起こし続けよう。Sunnyway — コスメブランドとインフルエンサーのプラットフォーム",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Sunnyway", statusBarStyle: "default" },
  icons: { icon: "/icon-192.png", apple: "/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F26B1F",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${display.variable} ${noto.variable}`}>
      <body>{children}<PwaRegister /></body>
    </html>
  );
}
