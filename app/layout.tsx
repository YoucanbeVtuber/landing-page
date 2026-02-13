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
  title: "LIVINGCEl - AI-Powered Layer Splitting for Live2D",
  description: "Transform your artwork into riggable layers with AI. Upload, split, refine, and download PSD files ready for Live2D rigging.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={inter.variable} suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
