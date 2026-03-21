import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden bg-background">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] opacity-40"
          style={{background:"radial-gradient(ellipse at 80% 20%, oklch(0.90 0.025 148) 0%, transparent 65%)"}}/>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10 w-full py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT: Copy */}
          <div>
            {/* Live badge */}
            <div className="inline-flex items-center gap-2 bg-accent border border-[oklch(0.78_0.07_148)] rounded-full px-4 py-2 text-sm font-semibold text-primary mb-8">
              <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 animate-pulse"/>
              Now live in Nairobi · Mombasa · Kisumu
            </div>

            {/* H1 */}
            <h1 className="text-5xl lg:text-6xl font-black leading-none tracking-tight text-foreground mb-4">
              Stop Chasing<br />
              People on<br />
              <em className="text-primary not-italic">WhatsApp.</em>
            </h1>
            <p className="text-3xl font-bold text-muted-foreground tracking-tight mb-8">Just Play.</p>

            {/* Body */}
            <p className="text-xl text-muted-foreground leading-relaxed max-w-lg mb-10">
              Find pickup matches, build teams, and book turfs across Kenya —
              all from one <strong className="text-foreground font-semibold">free app</strong>.
              No group chats, no calls, no stress.
            </p>

            {/* Download buttons */}
            <div className="flex flex-wrap gap-4 mb-10">
              <Link href="#download"
                className="flex items-center gap-3 bg-foreground text-background px-6 py-4 rounded-2xl hover:opacity-90 transition-all hover:-translate-y-0.5 shadow-sm">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div>
                  <div className="text-xs font-medium opacity-75 leading-none mb-1">Download on the</div>
                  <div className="text-lg font-black leading-none">App Store</div>
                </div>
              </Link>
              <Link href="#download"
                className="flex items-center gap-3 bg-card border-2 border-border px-6 py-4 rounded-2xl hover:border-primary hover:bg-accent transition-all hover:-translate-y-0.5">
                <svg width="28" height="28" viewBox="0 0 24 24">
                  <path d="M3.18 23.98c.34.19.74.19 1.08.01L16.93 17 13 13.07 3.18 23.98z" fill="oklch(0.43 0.13 148)"/>
                  <path d="M20.74 10.5a1.5 1.5 0 0 0-1.95 0L17 11.55l-4-4 1.5-1.5c.58-.58.58-1.52 0-2.1L12.1.55a1.49 1.49 0 0 0-2.1 0L8.45 2.1c-.58.58-.58 1.52 0 2.1l1.5 1.5-8.77 8.77A1.5 1.5 0 0 0 .73 16l4-4L8.7 16l-4 4a1.5 1.5 0 0 0 1.56 1.56l8.77-8.77 1.5 1.5c.58.58 1.52.58 2.1 0l1.55-1.55c.58-.58.58-1.52 0-2.1z" fill="oklch(0.43 0.13 148)"/>
                  <path d="M4.26.02C3.92-.17 3.52-.17 3.18.01L13 10.93l4-4L5.34.55A3 3 0 0 0 4.26.02z" fill="oklch(0.30 0.10 148)"/>
                </svg>
                <div>
                  <div className="text-xs font-medium text-muted-foreground leading-none mb-1">Get it on</div>
                  <div className="text-lg font-black text-foreground leading-none">Google Play</div>
                </div>
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-4">
              <div className="flex">
                {[
                  {i:"JM",bg:"bg-emerald-100",   t:"text-emerald-700"},
                  {i:"AK",bg:"bg-purple-100",    t:"text-purple-700"},
                  {i:"BO",bg:"bg-blue-100",      t:"text-blue-700"},
                  {i:"WN",bg:"bg-amber-100",     t:"text-amber-700"},
                  {i:"PM",bg:"bg-emerald-100",   t:"text-emerald-700"},
                ].map((av,idx) => (
                  <div key={av.i}
                    className={`w-9 h-9 rounded-full ${av.bg} ${av.t} border-2 border-background flex items-center justify-center text-xs font-bold ${idx>0?"-ml-2":""}`}>
                    {av.i}
                  </div>
                ))}
              </div>
              <p className="text-base text-muted-foreground">
                <strong className="text-foreground font-semibold">5,000+ players</strong> already on the pitch
              </p>
            </div>
          </div>

          {/* RIGHT: Phone mockup */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative" style={{animation:"float 3s ease-in-out infinite"}}>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-80 h-80 rounded-full border border-[oklch(0.78_0.07_148)] opacity-50"/>
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-96 h-96 rounded-full border border-[oklch(0.78_0.07_148)] opacity-20"/>
              </div>

              <div className="relative z-10 w-64 bg-card rounded-[40px] border-2 border-border overflow-hidden"
                style={{boxShadow:"0 32px 72px rgba(26,26,24,0.14)"}}>
                {/* Notch */}
                <div className="w-20 h-5 bg-foreground rounded-b-2xl mx-auto"/>
                {/* App header */}
                <div className="bg-secondary px-4 py-3 flex justify-between items-center border-b border-border">
                  <span className="text-base font-black text-foreground">Kick<span className="text-primary">Off</span></span>
                  <div className="w-8 h-8 rounded-full bg-accent border border-[oklch(0.78_0.07_148)] flex items-center justify-center text-xs font-bold text-primary">JM</div>
                </div>
                {/* Cards */}
                <div className="px-3 pt-3 pb-4">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1 mb-2">Open Near You</p>
                  {[
                    {type:"Pickup · 5v5",  name:"Lavington Sat Kickabout",loc:"Lavington",time:"6:30 AM",pct:70, p:"7", m:"10",price:"KSh 200",full:false},
                    {type:"7v7 · Comp",    name:"South B Sunday League",  loc:"South B",  time:"7:00 AM",pct:43, p:"6", m:"14",price:"KSh 350",full:false},
                    {type:"Pickup · 5v5",  name:"Kilimani Evening",       loc:"Kilimani", time:"6:00 PM",pct:100,p:"10",m:"10",price:"Free",    full:true},
                  ].map(m => (
                    <div key={m.name} className="bg-card border border-border rounded-xl p-3 mb-2 last:mb-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-primary uppercase tracking-wide">{m.type}</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${m.full?"bg-red-50 text-red-600":"bg-accent text-primary"}`}>
                          {m.full?"Full":"Open"}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-foreground mb-1">{m.name}</p>
                      <p className="text-xs text-muted-foreground mb-2">📍 {m.loc} · ⏰ {m.time}</p>
                      <div className="h-1.5 bg-secondary rounded-full mb-1.5">
                        <div className="h-full bg-primary rounded-full" style={{width:`${m.pct}%`}}/>
                      </div>
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-muted-foreground"><strong className="text-foreground">{m.p}</strong>/{m.m}</span>
                        <span className="text-primary font-bold">{m.price}</span>
                      </div>
                    </div>
                  ))}
                  <button className="w-full bg-primary text-white rounded-xl py-2.5 text-sm font-black mt-2">
                    Browse All Matches →
                  </button>
                </div>
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-40 h-5 bg-foreground/10 rounded-full blur-xl"/>
            </div>
          </div>

        </div>
      </div>

      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}</style>
    </section>
  );
}
