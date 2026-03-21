import Link from "next/link";

export function CTASection() {
  return (
    <section id="download" className="bg-primary py-28 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04]"
        style={{backgroundImage:"radial-gradient(circle, white 1px, transparent 1px)", backgroundSize:"24px 24px"}}/>

      <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
        <p className="text-sm font-bold text-white/60 uppercase tracking-widest mb-5">Download Free</p>
        <h2 className="text-5xl font-black tracking-tight leading-tight text-white mb-5">
          Your Next Game<br/>
          is <em className="text-white/70 not-italic">One Tap Away</em>
        </h2>
        <p className="text-xl text-white/70 max-w-lg mx-auto mb-12 leading-relaxed">
          Free to download. Works on Android and iPhone. Join thousands of
          players across Kenya finding games every single week.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link href="#"
            className="flex items-center gap-4 bg-white px-8 py-5 rounded-2xl hover:opacity-90 transition-all hover:-translate-y-0.5 shadow-sm">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="oklch(0.15 0.005 90)">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            <div className="text-left">
              <p className="text-sm font-medium text-muted-foreground leading-none mb-1">Download on the</p>
              <p className="text-xl font-black text-foreground leading-none">App Store</p>
            </div>
          </Link>

          <Link href="#"
            className="flex items-center gap-4 bg-transparent border-2 border-white/40 px-8 py-5 rounded-2xl hover:border-white hover:bg-white/10 transition-all hover:-translate-y-0.5">
            <svg width="32" height="32" viewBox="0 0 24 24">
              <path d="M3.18 23.98c.34.19.74.19 1.08.01L16.93 17 13 13.07 3.18 23.98z" fill="rgba(255,255,255,0.85)"/>
              <path d="M20.74 10.5a1.5 1.5 0 0 0-1.95 0L17 11.55l-4-4 1.5-1.5c.58-.58.58-1.52 0-2.1L12.1.55a1.49 1.49 0 0 0-2.1 0L8.45 2.1c-.58.58-.58 1.52 0 2.1l1.5 1.5-8.77 8.77A1.5 1.5 0 0 0 .73 16l4-4L8.7 16l-4 4a1.5 1.5 0 0 0 1.56 1.56l8.77-8.77 1.5 1.5c.58.58 1.52.58 2.1 0l1.55-1.55c.58-.58.58-1.52 0-2.1z" fill="rgba(255,255,255,0.85)"/>
              <path d="M4.26.02C3.92-.17 3.52-.17 3.18.01L13 10.93l4-4L5.34.55A3 3 0 0 0 4.26.02z" fill="rgba(255,255,255,0.5)"/>
            </svg>
            <div className="text-left">
              <p className="text-sm font-medium text-white/60 leading-none mb-1">Get it on</p>
              <p className="text-xl font-black text-white leading-none">Google Play</p>
            </div>
          </Link>
        </div>

        <p className="text-sm text-white/40">
          Free forever <span className="mx-2 opacity-40">·</span>
          Available in Kenya <span className="mx-2 opacity-40">·</span>
          M-Pesa supported <span className="mx-2 opacity-40">·</span>
          No sign-up fee
        </p>
      </div>
    </section>
  );
}
