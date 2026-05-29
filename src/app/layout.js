// © 2026 Bastet — 未闻·I Ching × Perfume Mapping。All rights reserved.
import "./globals.css";
import { Noto_Serif_SC } from "next/font/google";

const notoSerif = Noto_Serif_SC({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "未闻 - 命运不可见，但可以闻见",
  description: "将《周易》六十四卦与香水气味体系结合的沉浸式占卜体验",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN" className={notoSerif.className}>
      <body>{children}</body>
    </html>
  );
}
