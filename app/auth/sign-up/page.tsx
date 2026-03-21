"use client";

import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { signUp } from "../actions";

const positions = [
  { value: "goalkeeper", label: "Goalkeeper" },
  { value: "defender",   label: "Defender" },
  { value: "midfielder", label: "Midfielder" },
  { value: "forward",    label: "Forward" },
];
const skillLevels = [
  { value: "beginner",     label: "Beginner — Just starting out" },
  { value: "intermediate", label: "Intermediate — Play regularly" },
  { value: "advanced",     label: "Advanced — Very experienced" },
  { value: "pro",          label: "Pro — Competitive level" },
];
const locations = ["Nairobi","Mombasa","Kisumu","Nakuru","Eldoret","Thika","Malindi","Kitale","Garissa","Other"];

export default function SignUpPage() {
  const [error, setError]     = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true); setError(null);
    const result = await signUp(formData);
    if (result?.error) { setError(result.error); setIsLoading(false); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 60% 20%, oklch(0.90 0.025 148) 0%, transparent 65%)", opacity: 0.5 }} />

      <div className="w-full max-w-md relative z-10 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-secondary border-b border-border px-8 py-7 text-center">
            <Link href="/" className="inline-flex items-center justify-center mb-4">
              <div className="w-11 h-11 rounded-[11px] bg-primary flex items-center justify-center shadow-sm">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 2a10 10 0 0 1 0 20M12 2C9.5 6 8 9 8 12s1.5 6 4 10M12 2c2.5 4 4 7 4 10s-1.5 6-4 10M2 12h20"/>
                </svg>
              </div>
            </Link>
            <h1 className="text-2xl font-800 tracking-tight text-foreground">Create Your Account</h1>
            <p className="text-sm text-muted-foreground mt-1">Join Kenya&apos;s football community today</p>
          </div>

          <div className="px-8 py-7">
            {error && (
              <Alert variant="destructive" className="mb-5">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form action={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="fullName" className="text-sm font-600">Full Name</Label>
                  <Input id="fullName" name="fullName" placeholder="John Doe" required className="bg-secondary border-border" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="username" className="text-sm font-600">Username</Label>
                  <Input id="username" name="username" placeholder="johndoe" required className="bg-secondary border-border" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-600">Email</Label>
                <Input id="email" name="email" type="email" placeholder="you@example.com" required className="bg-secondary border-border" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-600">Password</Label>
                <Input id="password" name="password" type="password" placeholder="At least 6 characters" required minLength={6} className="bg-secondary border-border" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-sm font-600">Position</Label>
                  <Select name="preferredPosition" defaultValue="midfielder">
                    <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                    <SelectContent>{positions.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-600">Skill Level</Label>
                  <Select name="skillLevel" defaultValue="intermediate">
                    <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                    <SelectContent>{skillLevels.map(l => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-600">City</Label>
                <Select name="location" defaultValue="Nairobi">
                  <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                  <SelectContent>{locations.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              {/* Reliability score explainer */}
              <div className="bg-accent border border-[oklch(0.78_0.07_148)] rounded-[9px] p-3 text-xs text-primary">
                <span className="font-600">Your Reliability Score starts at 80/100.</span> Show up, pay on time, and be a good teammate to earn Elite status.
              </div>

              <button type="submit" disabled={isLoading}
                className="w-full bg-primary text-primary-foreground py-2.5 rounded-[9px] text-sm font-700 hover:opacity-88 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2">
                {isLoading ? (<><Loader2 className="h-4 w-4 animate-spin" />Creating account...</>) : "Create Account — It's Free"}
              </button>

              <p className="text-xs text-muted-foreground text-center">
                By creating an account, you agree to our{" "}
                <Link href="/terms" className="text-primary hover:underline">Terms</Link>{" "}and{" "}
                <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
              </p>
            </form>
          </div>

          <div className="border-t border-border px-8 py-5 text-center bg-secondary">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary hover:underline font-600">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
