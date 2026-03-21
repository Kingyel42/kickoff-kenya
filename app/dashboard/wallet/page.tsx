import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Construction } from "lucide-react";

export default function WalletPage() {
  return (
    <div className="pt-14 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
          <Wallet className="w-8 h-8 text-primary" />
          Wallet
        </h1>
        <p className="text-muted-foreground">Manage your balance and transactions</p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Construction className="w-8 h-8 text-primary" />
          </div>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            The wallet feature is currently under development
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center pb-8">
          <p className="text-muted-foreground max-w-md mx-auto">
            Soon you&apos;ll be able to top up your balance, pay match entry fees, 
            collect prize money, and track all your transactions in one place — 
            including M-Pesa integration.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
