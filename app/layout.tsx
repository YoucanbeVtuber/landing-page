import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./main-override.css";
import Navbar from "@/components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "LIVINGCEl - AI-Powered Layer Splitting for Live2D",
  description:
    "Transform your artwork into riggable layers with AI. Upload, split, refine, and download PSD files ready for Live2D rigging.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={inter.variable} suppressHydrationWarning>
      <body className="antialiased bg-white text-gray-900">
        <Navbar />
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
