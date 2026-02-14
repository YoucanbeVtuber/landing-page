"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black/80 backdrop-blur-md py-4 border-b border-white/10" : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Service Name */}
        <Link href="/" className="text-xl font-bold text-white tracking-tighter">
          LIVINGCEl
        </Link>
        
        <span className="px-3 py-1 rounded-full border border-white/20 bg-white/10 text-xs font-semibold tracking-wide text-white/90">
          Private Alpha v0.1
        </span>
      </div>
    </nav>
  );
}
