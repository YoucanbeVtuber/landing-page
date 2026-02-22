"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/85 backdrop-blur-lg shadow-sm border-b border-gray-100 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <Link
          href="/"
          className="text-lg font-bold text-gray-900 tracking-tight hover:opacity-70 transition-opacity"
        >
          LIVINGCEl
        </Link>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-xs font-semibold text-purple-600">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            Private Alpha
          </span>
          <a
            href="#pre-register"
            className="px-4 py-2 rounded-full bg-gray-900 text-white text-xs font-semibold hover:bg-black transition-colors"
          >
            사전 예약
          </a>
        </div>
      </div>
    </nav>
  );
}
