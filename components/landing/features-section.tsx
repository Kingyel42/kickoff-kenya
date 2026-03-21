import { Calendar, Users, MapPin } from "lucide-react";

const features = [
  {
    icon: Calendar, tag:"Pickup Matches",
    title:"Find a game\nin minutes",
    description:"Browse open matches near you and tap to join. No group chats, no chasing people. Just open the app and find your next game.",
    points:[
      {bold:"Live spots left",  text:" — see exactly how many slots are open"},
      {bold:"Create your own",  text:" match in under 60 seconds"},
      {bold:"Pay via M-Pesa",   text:" — entry fees handled inside the app"},
    ],
    visual:"matches", flip:false,
  },
  {
    icon: Users, tag:"Teams",
    title:"Build your\ndream squad",
    description:"Create a team, recruit players, and track your squad's record together. Challenge rival teams when you're ready to compete.",
    points:[
      {bold:"Team challenges",  text:" — take on rival squads city-wide"},
      {bold:"Live leaderboard", text:" — city rankings updated after every match"},
      {bold:"Rate teammates",   text:" — build your rep game by game"},
    ],
    visual:"teams", flip:true,
  },
  {
    icon: MapPin, tag:"Turf Booking",
    title:"Book the best\npitches in Kenya",
    description:"Discover verified football grounds near you, check real-time availability, and reserve your slot — all without a single phone call.",
    points:[
      {bold:"50+ verified pitches", text:" across Nairobi, Mombasa & Kisumu"},
      {bold:"Real-time slots",      text:" — see what's free right now"},
      {bold:"M-Pesa payment",       text:" — confirmed instantly in the app"},
    ],
    visual:"turfs", flip:false,
  },
];

function Check() {
  return (
    <div className="w-5 h-5 rounded-full bg-accent border border-[oklch(0.78_0.07_148)] flex items-center justify-center flex-shrink-0 mt-0.5">
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="oklch(0.43 0.13 148)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="2 6 5 9 10 3"/>
      </svg>
    </div>
  );
}

function MatchesVisual() {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
      <div className="p-6">
        <p className="text-base font-bold text-foreground mb-4">Open Matches · Nairobi</p>
        {[
          {name:"Lavington Saturday Kickabout",loc:"Lavington Grounds · Sat · 6:30 AM",open:true, price:"KSh 200"},
          {name:"South B Sunday League",       loc:"South B · Sun · 7:00 AM",          open:true, price:"KSh 350"},
          {name:"Kilimani Evening 5-a-Side",   loc:"Kilimani Turf · Fri · 6:00 PM",    open:false,price:"Free"},
          {name:"Parklands Morning Run",       loc:"Parklands · Sat · 6:00 AM",        open:true, price:"KSh 150"},
        ].map(m => (
          <div key={m.name} className="flex items-center gap-3 p-3 rounded-xl bg-secondary border border-border mb-2 last:mb-0 hover:border-primary/40 transition-colors cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center text-base flex-shrink-0">⚽</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground truncate">{m.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{m.loc}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full block mb-1 ${m.open?"bg-accent text-primary":"bg-red-50 text-red-600"}`}>
                {m.open?"Open":"Full"}
              </span>
              <span className="text-sm font-bold text-primary">{m.price}</span>
            </div>
          </div>
        ))}
        {/* Pricing breakdown */}
        <div className="mt-4 bg-accent/50 border border-[oklch(0.78_0.07_148)] rounded-xl p-4">
          <p className="text-sm font-bold text-primary mb-2">How pricing works</p>
          {[
            {l:"Total turf cost",   v:"KSh 1,000"},
            {l:"Max players",       v:"10"},
            {l:"Cost per player",   v:"KSh 100"},
            {l:"Platform fee (10%)",v:"KSh 10"},
          ].map(r => (
            <div key={r.l} className="flex justify-between text-sm text-muted-foreground mb-1">{r.l}<span>{r.v}</span></div>
          ))}
          <div className="flex justify-between text-base font-bold text-foreground border-t border-[oklch(0.78_0.07_148)] pt-2 mt-2">
            <span>You pay</span><span className="text-primary">KSh 110</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Price is fixed at creation — it never changes.</p>
        </div>
      </div>
    </div>
  );
}

function TeamsVisual() {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
          <div className="w-12 h-12 rounded-xl bg-accent border border-[oklch(0.78_0.07_148)] flex items-center justify-center text-xl font-black text-primary">NU</div>
          <div>
            <p className="text-base font-black text-foreground">Nairobi United FC</p>
            <p className="text-sm text-muted-foreground">Nairobi · Intermediate · Recruiting</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[{n:"34",l:"Matches"},{n:"21",l:"Wins"},{n:"62%",l:"Win Rate"}].map(s => (
            <div key={s.l} className="bg-secondary rounded-xl p-3 text-center">
              <p className="text-2xl font-black text-primary">{s.n}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.l}</p>
            </div>
          ))}
        </div>
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Squad</p>
        {[
          {av:"JM",bg:"bg-emerald-100",c:"text-emerald-700",name:"James Mwangi",  role:"Captain · MID"},
          {av:"AK",bg:"bg-purple-100", c:"text-purple-700", name:"Aisha Kamau",   role:"Vice Captain · FWD"},
          {av:"BO",bg:"bg-blue-100",   c:"text-blue-700",   name:"Brian Ochieng", role:"Member · GK"},
        ].map(m => (
          <div key={m.name} className="flex items-center gap-3 py-2 border-b border-border last:border-b-0">
            <div className={`w-8 h-8 rounded-full ${m.bg} ${m.c} flex items-center justify-center text-xs font-bold flex-shrink-0`}>{m.av}</div>
            <span className="text-sm font-semibold text-foreground flex-1">{m.name}</span>
            <span className="text-xs text-muted-foreground">{m.role}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TurfsVisual() {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
      <div className="h-44 bg-gradient-to-br from-[oklch(0.20_0.10_148)] to-[oklch(0.12_0.08_148)] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <svg width="220" height="140" viewBox="0 0 220 140" fill="none" stroke="white" strokeWidth="1.5">
            <rect x="6" y="6" width="208" height="128" rx="3"/>
            <line x1="110" y1="6" x2="110" y2="134"/>
            <circle cx="110" cy="70" r="22"/>
            <rect x="6" y="48" width="24" height="48"/>
            <rect x="190" y="48" width="24" height="48"/>
          </svg>
        </div>
        <div className="relative z-10 text-center">
          <div className="text-4xl mb-2">🏟️</div>
          <p className="text-base font-bold text-white">City Park Grounds</p>
          <p className="text-sm text-white/60">Nairobi CBD</p>
        </div>
      </div>
      <div className="p-5">
        <div className="flex flex-wrap gap-2 mb-4">
          {["Floodlights","Changing Rooms","KSh 1,500/hr"].map(c => (
            <span key={c} className="text-sm font-semibold px-3 py-1 rounded-full bg-accent text-primary border border-[oklch(0.78_0.07_148)]">{c}</span>
          ))}
        </div>
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Available Today</p>
        <div className="grid grid-cols-3 gap-2">
          {[
            {t:"6:00 AM",f:true},{t:"8:00 AM",f:false},{t:"10:00 AM",f:true},
            {t:"12:00 PM",f:false},{t:"2:00 PM",f:true},{t:"4:00 PM",f:true},
          ].map(s => (
            <div key={s.t} className={`text-sm font-semibold text-center py-2 rounded-xl ${
              s.f
                ? "bg-accent text-primary border border-[oklch(0.78_0.07_148)] cursor-pointer hover:bg-accent/80"
                : "bg-secondary text-muted-foreground border border-border"
            }`}>{s.t}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FeaturesSection() {
  return (
    <section id="features">
      {features.map((feat, i) => (
        <div key={feat.tag} className={`py-24 border-t border-border ${i%2===1?"bg-secondary":"bg-background"}`}>
          <div className="max-w-6xl mx-auto px-6">
            <div className={`grid lg:grid-cols-2 gap-16 items-center`}>

              {/* Text */}
              <div className={feat.flip?"lg:order-2":""}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-accent border border-[oklch(0.78_0.07_148)] flex items-center justify-center">
                    <feat.icon className="w-4 h-4 text-primary"/>
                  </div>
                  <span className="text-sm font-bold text-primary uppercase tracking-widest">{feat.tag}</span>
                </div>
                <h2 className="text-4xl font-black tracking-tight leading-tight text-foreground mb-4 whitespace-pre-line">
                  {feat.title}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">{feat.description}</p>
                <ul className="space-y-4">
                  {feat.points.map(pt => (
                    <li key={pt.bold} className="flex items-start gap-3 text-base text-muted-foreground">
                      <Check/>
                      <span><strong className="text-foreground font-semibold">{pt.bold}</strong>{pt.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Visual */}
              <div className={feat.flip?"lg:order-1":""}>
                {feat.visual==="matches" && <MatchesVisual/>}
                {feat.visual==="teams"   && <TeamsVisual/>}
                {feat.visual==="turfs"   && <TurfsVisual/>}
              </div>

            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
