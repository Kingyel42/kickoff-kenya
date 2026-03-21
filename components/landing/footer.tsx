"use client";

import Link from "next/link";
import { Twitter, Instagram, Facebook } from "lucide-react";
import { useEffect, useState } from "react";

export function Footer() {
  const [year, setYear] = useState("2025");
  useEffect(() => { setYear(new Date().getFullYear().toString()); }, []);

  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-8">
        <div className="grid md:grid-cols-4 gap-12 mb-14">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 2a10 10 0 0 1 0 20M12 2C9.5 6 8 9 8 12s1.5 6 4 10M12 2c2.5 4 4 7 4 10s-1.5 6-4 10M2 12h20"/>
                </svg>
              </div>
              <span className="font-extrabold text-lg text-white">
                KickOff <span className="text-primary">Kenya</span>
              </span>
            </div>
            <p className="text-base text-white/40 leading-relaxed max-w-xs mb-6">
              Kenya&apos;s home for pickup football. Find matches, build teams,
              book turfs — free app for Android and iPhone.
            </p>
            <div className="flex gap-3">
              {[Twitter, Instagram, Facebook].map((Icon, i) => (
                <div key={i}
                  className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center cursor-pointer hover:border-white/20 transition-colors">
                  <Icon className="w-4 h-4 text-white/50"/>
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            { heading:"Product",  links:["Features","How It Works","Find Turfs","Leaderboard"] },
            { heading:"Company",  links:["About Us","Blog","Careers","Contact"] },
            { heading:"Download", links:["App Store (iOS)","Google Play","Privacy Policy","Terms of Service"] },
          ].map(col => (
            <div key={col.heading}>
              <h4 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-5">{col.heading}</h4>
              {col.links.map(l => (
                <Link key={l} href="#"
                  className="block text-base text-white/40 hover:text-white/70 mb-3 transition-colors">
                  {l}
                </Link>
              ))}
            </div>
          ))}

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/30">
            © {year} KickOff Kenya. Made with passion in Nairobi.
          </p>
          <div className="flex gap-6">
            {["Privacy","Terms","Community Guidelines"].map(l => (
              <Link key={l} href="#" className="text-sm text-white/30 hover:text-white/50 transition-colors">{l}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
