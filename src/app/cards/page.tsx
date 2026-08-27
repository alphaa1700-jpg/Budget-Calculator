import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CardForm } from "@/components/forms/CardForm";
import { cardsRepo } from "@/lib/repositories";
import { Button } from "@/components/ui/button";
import { Plus, CreditCard, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";

export const dynamic = 'force-dynamic';

export default async function CardsPage() {
  let cards = [];
  
  try {
    cards = await cardsRepo.getAll();
  } catch (error) {
    console.error("Failed to load data:", error);
  }

  const totalLimit = cards.reduce((sum, c) => sum + Number(c.creditLimit), 0);
  const totalOutstanding = cards.reduce((sum, c) => sum + Number(c.currentOutstanding), 0);
  const globalUtilization = (totalOutstanding / totalLimit) * 100;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Credit Cards</h1>
          <p className="text-muted-foreground">Monitor outstanding balances and limits.</p>
        </div>
        <Dialog>
          <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Add Card
        
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Card
        </DialogTitle>
            </DialogHeader>
            <CardForm />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="col-span-1 md:col-span-3 bg-gradient-to-r from-violet-900 to-indigo-900 text-slate-50 border-none shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-indigo-200 text-sm font-medium mb-1">Total Outstanding</p>
                <h2 className="text-4xl font-bold text-white">₹{totalOutstanding.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
              </div>
              <div>
                <p className="text-indigo-200 text-sm font-medium mb-1">Total Credit Limit</p>
                <h2 className="text-4xl font-bold text-indigo-100">₹{totalLimit.toLocaleString()}</h2>
              </div>
              <div>
                <p className="text-indigo-200 text-sm font-medium mb-1">Global Utilization</p>
                <div className="flex items-center gap-4 mt-2">
                  <Progress value={globalUtilization} className="h-3 flex-1 bg-indigo-950/50" />
                  <span className="font-bold text-xl">{globalUtilization.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {cards.length === 0 ? (
          <div className="col-span-1 md:col-span-3 flex flex-col items-center justify-center py-12 text-center border rounded-lg border-dashed">
            <CreditCard className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold">No credit cards found</h3>
            <p className="text-muted-foreground max-w-sm mt-2">
              You haven't added any credit cards yet. Click "Add Card" to start tracking your limits and utilization.
            </p>
          </div>
        ) : (
          cards.map(card => {
            const util = (Number(card.currentOutstanding) / Number(card.creditLimit)) * 100;
            const isHighUtil = util > 30;

          return (
            <Card key={card.id} className="shadow-sm border-border/50 relative overflow-hidden transition-all hover:shadow-md">
              {isHighUtil && (
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <AlertCircle className="w-24 h-24 text-rose-500" />
                </div>
              )}
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-indigo-500" />
                      {card.name}
                    </CardTitle>
                    <CardDescription>{card.bank} •••• {card.last4}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10 space-y-4 pt-4">
                <div>
                  <div className="text-2xl font-bold">₹{Number(card.currentOutstanding).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  <div className="text-xs text-muted-foreground mt-1">Outstanding Balance</div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>{util.toFixed(1)}%</span>
                    <span>₹{Number(card.creditLimit).toLocaleString()} Limit</span>
                  </div>
                  <Progress value={util} className={`h-2 ₹{isHighUtil ? '[&>div]:bg-rose-500' : ''}`} />
                  {isHighUtil && <p className="text-[10px] text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> High utilization</p>}
                </div>

                <div className="pt-4 border-t flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Payment Due</span>
                  <span className="font-medium">{new Date(card.dueDate).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          )
        }))}
      </div>
    </div>
  );
}
