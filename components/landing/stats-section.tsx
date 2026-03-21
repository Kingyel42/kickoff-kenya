const testimonials = [
  {
    stars: 5,
    quote: "Ilikuwa inachukua siku mbili kushika watu kwa WhatsApp. Saa hii nafungua app, ninaona match, naingia. Rahisi sana.",
    name: "James Mwangi",
    loc: "Midfielder · Lavington, Nairobi",
    initials: "JM",
    bg: "bg-emerald-100",
    col: "text-emerald-700",
  },
  {
    stars: 5,
    quote: "Niliunda team hapa na bado tunacheza pamoja every weekend for 5 months. Hata tumeshinda challenge mbili. This app ni different.",
    name: "Aisha Kamau",
    loc: "Forward · Nyali, Mombasa",
    initials: "AK",
    bg: "bg-purple-100",
    col: "text-purple-700",
  },
  {
    stars: 5,
    quote: "The turf booking alone is worth it. Ninaona ground iko free and ninaweza book direct — no more calling and waiting.",
    name: "Brian Ochieng",
    loc: "Goalkeeper · Milimani, Kisumu",
    initials: "BO",
    bg: "bg-blue-100",
    col: "text-blue-700",
  },
];

export function StatsSection() {
  return (
    <section id="community" className="py-24 bg-background border-t border-border">
      <div className="max-w-6xl mx-auto px-6">

        <div className="mb-12">
          <p className="text-sm font-bold text-primary uppercase tracking-widest mb-3">Community</p>
          <h2 className="text-4xl font-black tracking-tight text-foreground">Kenyan Players Love It</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map(t => (
            <div key={t.name} className="bg-card border border-border rounded-2xl p-8 hover:shadow-md transition-shadow">
              <div className="text-primary text-lg tracking-widest mb-4">{"★".repeat(t.stars)}</div>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6 italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-full ${t.bg} ${t.col} flex items-center justify-center text-sm font-black flex-shrink-0`}>
                  {t.initials}
                </div>
                <div>
                  <p className="text-base font-bold text-foreground">{t.name}</p>
                  <p className="text-sm text-muted-foreground">{t.loc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
