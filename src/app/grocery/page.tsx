import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { GroceryForm } from "@/components/forms/GroceryForm";
import { groceryRepo } from "@/lib/repositories";
import { Button } from "@/components/ui/button";
import { Plus, ShoppingCart, Apple, Utensils } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const dynamic = 'force-dynamic';

export default async function GroceryPage() {
  let groceries: any[] = [];
  
  try {
    groceries = await groceryRepo.getAll();
  } catch (error) {
    console.error("Failed to load data:", error);
  }

  const monthlyBudget = 600;
  const spentThisMonth = groceries.reduce((sum, g) => sum + Number(g.amount), 0);
  const utilization = Math.min((spentThisMonth / monthlyBudget) * 100, 100);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Grocery Tracker</h1>
          <p className="text-muted-foreground">Manage your food budgets and supermarket runs.</p>
        </div>
        <Dialog>
          <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Add Run
        
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Run
        </DialogTitle>
            </DialogHeader>
            <GroceryForm />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1 shadow-sm border-border/50 bg-gradient-to-b from-orange-50 to-orange-100/50 dark:from-orange-950/40 dark:to-orange-950/10">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Apple className="h-5 w-5 text-orange-500" />
              Monthly Food Budget
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              ₹{spentThisMonth.toFixed(2)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">spent of ₹{monthlyBudget} budget</p>
            
            <Progress value={utilization} className="h-3 mt-6 [&>div]:bg-orange-500 bg-orange-200 dark:bg-orange-900/50" />
            <div className="flex justify-between text-sm mt-2 font-medium">
              <span className="text-orange-600 dark:text-orange-400">{utilization.toFixed(1)}%</span>
              <span className="text-muted-foreground">₹{(monthlyBudget - spentThisMonth).toFixed(2)} left</span>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 shadow-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-muted-foreground" />
              Recent Grocery Runs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {groceries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center border rounded-lg border-dashed">
                <ShoppingCart className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold">No grocery runs</h3>
                <p className="text-muted-foreground max-w-sm mt-2">
                  You haven't tracked any grocery expenses yet.
                </p>
              </div>
            ) : (
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Store</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groceries.map((run) => (
                      <TableRow key={run.id}>
                        <TableCell className="font-medium">
                          {new Date(run.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{run.store}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] uppercase font-semibold">
                            {run.category}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          ₹{Number(run.amount).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
