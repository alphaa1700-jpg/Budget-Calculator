import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AccountForm } from "@/components/forms/AccountForm";
import { accountsRepo, transactionsRepo } from "@/lib/repositories";
import { Button } from "@/components/ui/button";
import { Plus, Wallet, Building2, Landmark, Smartphone } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const dynamic = 'force-dynamic';

export default async function AccountsPage() {
  let accounts = [];
  let transactions = [];
  
  try {
    const [accs, txs] = await Promise.all([
      accountsRepo.getAll(),
      transactionsRepo.getAll()
    ]);
    accounts = accs;
    transactions = txs;
  } catch (error) {
    console.error("Failed to load data:", error);
  }

  const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.currentBalance), 0);

  const getIcon = (type: string) => {
    switch(type) {
      case 'BANK': return <Building2 className="h-5 w-5 text-blue-500" />;
      case 'CASH': return <Wallet className="h-5 w-5 text-emerald-500" />;
      case 'UPI': return <Smartphone className="h-5 w-5 text-purple-500" />;
      default: return <Landmark className="h-5 w-5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
          <p className="text-muted-foreground">Manage your bank accounts, wallets, and cash.</p>
        </div>
        <Dialog>
          <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Add Account
        
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Account
        </DialogTitle>
            </DialogHeader>
            <AccountForm />
          </DialogContent>
        </Dialog>
      </div>

      {/* Net Worth / Total Balance */}
      <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-slate-50 dark:from-slate-950 dark:to-slate-900 border-none shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-slate-200 font-medium text-sm uppercase tracking-wider">Total Liquid Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">₹{totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <p className="text-slate-400 mt-2 text-sm">Across {accounts.length} active accounts</p>
        </CardContent>
      </Card>

      {accounts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg border-dashed">
          <Landmark className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold">No accounts found</h3>
          <p className="text-muted-foreground max-w-sm mt-2">
            You haven't added any accounts yet. Click "Add Account" to start tracking your assets.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => (
          <Card key={account.id} className="shadow-sm border-border/50 transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                {getIcon(account.type)}
                {account.name}
              </CardTitle>
              <div className="px-2 py-1 bg-secondary rounded-full text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {account.type}
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">₹{Number(account.currentBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              <p className="text-xs text-muted-foreground mt-1">Current Balance</p>
              
              <div className="mt-4 pt-4 border-t flex justify-between gap-2">
                <Button variant="outline" size="sm" className="w-full">Edit</Button>
                <Button variant="outline" size="sm" className="w-full">History</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      )}
    </div>
  );
}
