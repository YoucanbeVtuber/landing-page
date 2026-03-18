import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./main-override.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "LivingCel | 리깅 노가다 끝, 원클릭 레이어 분리",
  description:
    "일러스트를 업로드하고 바로 리깅하세요. 가장 번거로운 레이어 분리 작업을 LivingCel이 대신합니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="antialiased bg-white text-gray-900">
        {children}
        {/* Footer */}
        <footer className="w-full border-t border-gray-100 bg-white py-12 px-6 text-center">
          <p className="text-lg font-bold text-gray-900 mb-1">LIVINGCEl</p>
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} LIVINGCEl. All rights reserved.
          </p>
        </footer>
      </body>
    </html>
  );
}
