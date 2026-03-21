import { UserPlus, Search, CreditCard, TrendingUp } from "lucide-react";

const steps = [
  { icon: UserPlus,    num:"01", title:"Create Your Profile",       desc:"Sign up with your phone number. Set your position, skill level, and city to get matched with the right games." },
  { icon: Search,      num:"02", title:"Find or Create a Match",     desc:"Browse open games near you or create your own in seconds. Set the rules, format, and entry fee." },
  { icon: CreditCard,  num:"03", title:"Pay via M-Pesa & Show Up",   desc:"Secure your spot with a single M-Pesa tap. No payment, no slot — which means everyone who shows up has paid." },
  { icon: TrendingUp,  num:"04", title:"Track & Climb",              desc:"Stats update after every match. Rate teammates, build your reliability score, and climb the leaderboard." },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-background border-t border-border">
      <div className="max-w-6xl mx-auto px-6">

        <div className="text-center mb-16">
          <p className="text-sm font-bold text-primary uppercase tracking-widest mb-3">Simple Process</p>
          <h2 className="text-4xl font-black tracking-tight text-foreground mb-4">Ready in 4 Steps</h2>
          <p className="text-xl text-muted-foreground max-w-md mx-auto">From signup to kickoff in under 5 minutes</p>
        </div>

        {/* Desktop */}
        <div className="hidden md:grid grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={step.num} className="relative text-center">
              {/* Connecting line */}
              {i < steps.length - 1 && (
                <div className="absolute top-8 left-1/2 w-full h-px bg-border"/>
              )}
              <div className="relative inline-flex mb-5">
                <div className="w-16 h-16 rounded-2xl bg-accent border border-[oklch(0.78_0.07_148)] flex items-center justify-center relative z-10">
                  <step.icon className="w-7 h-7 text-primary"/>
                </div>
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-white text-xs font-black flex items-center justify-center z-20">
                  {step.num}
                </span>
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Mobile */}
        <div className="md:hidden space-y-8">
          {steps.map(step => (
            <div key={step.num} className="flex gap-5">
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-accent border border-[oklch(0.78_0.07_148)] flex items-center justify-center">
                  <step.icon className="w-6 h-6 text-primary"/>
                </div>
                <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-primary text-white text-xs font-black flex items-center justify-center">
                  {step.num}
                </span>
              </div>
              <div className="pt-1">
                <h3 className="text-base font-bold text-foreground mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
