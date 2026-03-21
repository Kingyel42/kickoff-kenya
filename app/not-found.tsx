import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 30%, oklch(0.90 0.025 148) 0%, transparent 65%)", opacity: 0.4 }}
      />
      <div className="relative z-10 text-center max-w-md">
        <div className="relative mb-8">
          <p className="text-[120px] font-900 text-primary/10 leading-none select-none tracking-[-4px]">404</p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-[18px] bg-accent border border-[oklch(0.78_0.07_148)] flex items-center justify-center">
              <Search className="w-9 h-9 text-primary" />
            </div>
          </div>
        </div>
        <h1 className="text-[24px] font-800 text-foreground mb-3 tracking-tight">Page Not Found</h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          We couldn&apos;t find what you were looking for. The page may have been
          removed, or the link might be incorrect.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Go to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
