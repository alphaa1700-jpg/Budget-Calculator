import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MobilePlanForm } from "@/components/forms/MobilePlanForm";
import { mobilePlansRepo } from "@/lib/repositories";
import { Button } from "@/components/ui/button";
import { Plus, Smartphone, Wifi, RadioTower } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";

export const dynamic = 'force-dynamic';

export default async function MobilePlansPage() {
  let plans = [];
  
  try {
    plans = await mobilePlansRepo.getAll();
  } catch (error) {
    console.error("Failed to load data:", error);
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mobile Plans</h1>
          <p className="text-muted-foreground">Manage your cellular subscriptions and devices.</p>
        </div>
        <Dialog>
          <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Add Plan
        
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Plan
        </DialogTitle>
            </DialogHeader>
            <MobilePlanForm />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {plans.length === 0 ? (
          <div className="col-span-1 md:col-span-2 flex flex-col items-center justify-center py-12 text-center border rounded-lg border-dashed">
            <Smartphone className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold">No mobile plans found</h3>
            <p className="text-muted-foreground max-w-sm mt-2">
              You haven't added any mobile plans yet. Click "Add Plan" to start tracking.
            </p>
          </div>
        ) : (
        plans.map((plan) => (
          <Card key={plan.id} className="shadow-sm border-border/50 relative overflow-hidden group hover:shadow-md transition-all">
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-10 transition-opacity">
              <RadioTower className="w-32 h-32" />
            </div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Smartphone className="h-5 w-5 text-blue-500" />
                    {plan.provider}
                  </CardTitle>
                  <CardDescription className="mt-1">{plan.phone}</CardDescription>
                </div>
                <div className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-semibold rounded-full uppercase">
                  {plan.status}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 relative z-10">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <div className="text-3xl font-bold">₹{Number(plan.cost).toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground mt-1">Monthly Cost</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold flex items-center justify-end gap-1">
                    <Wifi className="h-4 w-4" /> {plan.dataLimit}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Data Allowance</div>
                </div>
              </div>
              
              <div className="pt-4 border-t flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Next Renewal</span>
                <span className="font-medium">{new Date(plan.renewalDate).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        )))}
      </div>
    </div>
  );
}
