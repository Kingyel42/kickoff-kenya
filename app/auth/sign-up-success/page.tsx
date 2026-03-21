import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail, ArrowLeft } from "lucide-react";

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 30%, oklch(0.90 0.025 148) 0%, transparent 65%)", opacity: 0.5 }} />
      <div className="w-full max-w-md relative z-10">
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden text-center">
          <div className="bg-secondary border-b border-border px-8 py-8">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-accent border border-[oklch(0.78_0.07_148)] flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-800 tracking-tight text-foreground">Check Your Email</h1>
            <p className="text-sm text-muted-foreground mt-1">We&apos;ve sent you a confirmation link</p>
          </div>
          <div className="px-8 py-7 space-y-5">
            <p className="text-muted-foreground text-sm leading-relaxed">
              Click the link in the email we sent you to verify your account and start playing.
              The link will expire in 24 hours.
            </p>
            <div className="p-4 rounded-[10px] bg-accent border border-[oklch(0.78_0.07_148)]">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Didn&apos;t receive it?</strong><br />
                Check your spam folder or try signing up again with a different email address.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Button asChild className="bg-primary text-primary-foreground font-700">
                <Link href="/auth/login">Go to Login</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/"><ArrowLeft className="mr-2 w-4 h-4" />Back to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
