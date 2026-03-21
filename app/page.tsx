import { Navbar } from "@/components/landing/navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { StatsSection } from "@/components/landing/stats-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { CitiesSection } from "@/components/landing/cities-section";
import { CTASection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        {/* Stats banner */}
        <div className="border-y border-border bg-secondary">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4">
              {[
                { value: "5,000+", label: "Active Players" },
                { value: "50+",    label: "Partner Turfs" },
                { value: "3",      label: "Cities & Growing" },
                { value: "Free",   label: "Always Free to Join" },
              ].map((stat, i, arr) => (
                <div
                  key={stat.label}
                  className={`py-7 text-center ${i < arr.length - 1 ? "border-r border-border" : ""}`}
                >
                  <p className="text-[32px] font-900 text-primary tracking-[-1.5px] leading-none">{stat.value}</p>
                  <p className="text-[12px] font-500 text-muted-foreground mt-1.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <FeaturesSection />
        <HowItWorksSection />
        <CitiesSection />
        <StatsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
