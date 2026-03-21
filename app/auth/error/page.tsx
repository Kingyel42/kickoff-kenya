import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 30%, oklch(0.94 0.05 27) 0%, transparent 65%)", opacity: 0.4 }} />
      <div className="w-full max-w-md relative z-10">
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden text-center">
          <div className="bg-secondary border-b border-border px-8 py-8">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-800 tracking-tight text-foreground">Authentication Error</h1>
            <p className="text-sm text-muted-foreground mt-1">Something went wrong during authentication</p>
          </div>
          <div className="px-8 py-7 space-y-5">
            <p className="text-muted-foreground text-sm leading-relaxed">
              This could happen if the confirmation link has expired, was already used,
              or if there was a problem with your account.
            </p>
            <div className="flex flex-col gap-2">
              <Button asChild className="bg-primary text-primary-foreground font-700">
                <Link href="/auth/login">Try Logging In</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/auth/sign-up">Create New Account</Link>
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
