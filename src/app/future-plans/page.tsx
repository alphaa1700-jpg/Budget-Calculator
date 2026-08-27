import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FuturePlanForm } from "@/components/forms/FuturePlanForm";
import { futurePlansRepo } from "@/lib/repositories";
import { Button } from "@/components/ui/button";
import { Plus, Rocket, Clock, CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";

export const dynamic = 'force-dynamic';

export default async function FuturePlansPage() {
  let plans = [];
  
  try {
    plans = await futurePlansRepo.getAll();
  } catch (error) {
    console.error("Failed to load data:", error);
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Future Plans</h1>
          <p className="text-muted-foreground">Map out your long-term financial journey.</p>
        </div>
        <Dialog>
          <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Add Blueprint
        
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Blueprint
        </DialogTitle>
            </DialogHeader>
            <FuturePlanForm />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.length === 0 ? (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center py-12 text-center border rounded-lg border-dashed">
            <Rocket className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold">No future plans found</h3>
            <p className="text-muted-foreground max-w-sm mt-2">
              You haven't added any long-term plans yet. Map out your financial journey today!
            </p>
          </div>
        ) : (
        plans.map((plan) => {
          let icon = <Clock className="h-5 w-5 text-slate-500" />;
          let badgeColor = "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400";
          
          if (plan.status === "IN_PROGRESS" || plan.status === "ON_TRACK") {
            icon = <Rocket className="h-5 w-5 text-indigo-500" />;
            badgeColor = "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400";
          } else if (plan.status === "COMPLETED") {
            icon = <CheckCircle className="h-5 w-5 text-emerald-500" />;
            badgeColor = "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
          }

          return (
            <Card key={plan.id} className="shadow-sm border-border/50 transition-all hover:-translate-y-1 hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="p-2 rounded-lg bg-secondary/50">
                    {icon}
                  </div>
                  <div className={`px-2 py-1 text-[10px] font-bold rounded uppercase tracking-wider ₹{badgeColor}`}>
                    {plan.status.replace("_", " ")}
                  </div>
                </div>
                <CardTitle className="text-lg mt-4">{plan.name}</CardTitle>
                <CardDescription>Target Year: {plan.targetYear}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">
                  ₹{Number(plan.estimatedCost).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
                  {plan.notes}
                </div>
              </CardContent>
            </Card>
          );
        }))}
      </div>
    </div>
  );
}
