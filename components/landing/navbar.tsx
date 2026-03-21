"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
      scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-border" : "bg-background/90 backdrop-blur-sm"
    }`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 2a10 10 0 0 1 0 20M12 2C9.5 6 8 9 8 12s1.5 6 4 10M12 2c2.5 4 4 7 4 10s-1.5 6-4 10M2 12h20"/>
              </svg>
            </div>
            <span className="font-extrabold text-xl tracking-tight text-foreground">
              KickOff <span className="text-primary">Kenya</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {["Features","How It Works","Cities","Community"].map(item => (
              <Link key={item} href={`#${item.toLowerCase().replace(" ","-")}`}
                className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors">
                {item}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:block">
            <Link href="#download"
              className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-base font-bold hover:opacity-90 transition-opacity shadow-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download Free
            </Link>
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden border-t border-border py-5">
            <nav className="flex flex-col gap-4">
              {["Features","How It Works","Cities","Community"].map(item => (
                <Link key={item} href={`#${item.toLowerCase().replace(" ","-")}`}
                  className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setIsOpen(false)}>
                  {item}
                </Link>
              ))}
              <Link href="#download"
                className="mt-2 flex items-center justify-center gap-2 bg-primary text-white px-5 py-3 rounded-xl text-base font-bold"
                onClick={() => setIsOpen(false)}>
                Download Free
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
