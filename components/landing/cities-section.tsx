const cities = [
  { emoji:"🏙️", name:"Nairobi",  players:"1,800+ players", turfs:"32 turfs",  live:true },
  { emoji:"🌊", name:"Mombasa",  players:"620+ players",   turfs:"11 turfs",  live:true },
  { emoji:"🦅", name:"Kisumu",   players:"390+ players",   turfs:"8 turfs",   live:true },
  { emoji:"🌄", name:"Nakuru",   players:null,              turfs:null,        live:false },
  { emoji:"🌿", name:"Eldoret",  players:null,              turfs:null,        live:false },
];

export function CitiesSection() {
  return (
    <section id="cities" className="py-24 bg-secondary border-t border-border">
      <div className="max-w-6xl mx-auto px-6">

        <div className="text-center mb-12">
          <p className="text-sm font-bold text-primary uppercase tracking-widest mb-3">Coverage</p>
          <h2 className="text-4xl font-black tracking-tight text-foreground mb-4">Available in Your City</h2>
          <p className="text-xl text-muted-foreground max-w-md mx-auto">Already live in Kenya's biggest football cities, with more launching soon</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {cities.map(city => (
            <div key={city.name} className={`bg-card rounded-2xl p-6 text-center border transition-all cursor-pointer hover:-translate-y-1 ${
              city.live
                ? "border-[oklch(0.78_0.07_148)] bg-accent hover:shadow-md"
                : "border-border hover:border-border"
            }`}>
              <div className="text-4xl mb-3">{city.emoji}</div>
              <p className="text-lg font-black text-foreground mb-1">{city.name}</p>
              {city.live ? (
                <>
                  <p className="text-sm font-semibold text-primary">{city.players}</p>
                  <p className="text-sm font-semibold text-primary">{city.turfs}</p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Coming soon</p>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
