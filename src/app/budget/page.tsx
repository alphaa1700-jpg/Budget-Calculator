import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { categoriesRepo, budgetsRepo, transactionsRepo } from "@/lib/repositories";
import { PieChart, Lightbulb } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function BudgetPage() {
  const [categories, budgets, transactions] = await Promise.all([
    categoriesRepo.getAll(),
    budgetsRepo.getAll(),
    transactionsRepo.getAll()
  ]);

  // Aggregate current month transactions by category
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const currentMonthExpenses = transactions.filter(t => 
    t.type === 'EXPENSE' && t.date.startsWith(currentMonth)
  );

  const spentByCategory = currentMonthExpenses.reduce((acc, tx) => {
    acc[tx.categoryId] = (acc[tx.categoryId] || 0) + Number(tx.amount);
    return acc;
  }, {} as Record<string, number>);

  const displayBudgets = budgets.length > 0 
    ? budgets.map(b => ({
        categoryId: b.categoryId,
        amount: Number(b.budgetAmount),
        name: categories.find(c => c.id === b.categoryId)?.name || 'Unknown',
        color: "bg-primary"
      }))
    : [];

  const totalBudget = displayBudgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = Object.values(spentByCategory).reduce((sum, val) => sum + val, 0);
  const budgetUtilization = Math.min((totalSpent / totalBudget) * 100, 100) || 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Budgets</h1>
        <p className="text-muted-foreground">Monitor your spending limits and goals.</p>
      </div>

      {/* Overview Card */}
      <Card className="bg-slate-900 text-slate-50 border-slate-800 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <PieChart className="w-48 h-48" />
        </div>
        <CardHeader>
          <CardTitle className="text-lg">Monthly Budget Usage</CardTitle>
          <CardDescription className="text-slate-400">Current Month: {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 relative z-10">
          <div className="flex justify-between items-end">
            <div>
              <div className="text-4xl font-bold">₹{totalSpent.toFixed(2)}</div>
              <div className="text-sm text-slate-400 mt-1">spent of ₹{totalBudget.toFixed(2)}</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-semibold text-emerald-400">
                ₹{(totalBudget - totalSpent > 0 ? totalBudget - totalSpent : 0).toFixed(2)}
              </div>
              <div className="text-sm text-slate-400 mt-1">remaining</div>
            </div>
          </div>
          
          <div className="pt-4 space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>0%</span>
              <span>{budgetUtilization.toFixed(1)}% Used</span>
              <span>100%</span>
            </div>
            <Progress 
              value={budgetUtilization} 
              className="h-3 bg-slate-800" 
              // Indicator style is usually handled in global css, but we'll let shadcn default handle it 
            />
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <h3 className="text-xl font-semibold mt-8 mb-4">Category Limits</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {displayBudgets.length === 0 ? (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center py-12 text-center border rounded-lg border-dashed">
            <PieChart className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold">No budgets set</h3>
            <p className="text-muted-foreground max-w-sm mt-2">
              You haven't set any monthly category limits yet. Use the calculator below to plan your budget!
            </p>
          </div>
        ) : (
        displayBudgets.map((budget) => {
          const spent = spentByCategory[budget.categoryId] || 0;
          const remaining = budget.amount - spent;
          const percent = Math.min((spent / budget.amount) * 100, 100);
          const isOver = spent > budget.amount;

          return (
            <Card key={budget.categoryId} className="shadow-sm border-border/50 transition-all hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-semibold text-base">{budget.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">₹{budget.amount.toFixed(2)} limit</p>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ₹{isOver ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                    {isOver ? 'Over budget' : 'On track'}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">₹{spent.toFixed(2)} spent</span>
                    <span className="text-muted-foreground">
                      {remaining > 0 ? `$${remaining.toFixed(2)} left` : `-$${Math.abs(remaining).toFixed(2)} over`}
                    </span>
                  </div>
                  <Progress value={percent} className="h-2" />
                </div>
              </CardContent>
            </Card>
          )
        }))}
      </div>
      
      {/* Smart Suggestions */}
      <Card className="mt-8 border-dashed border-2 bg-transparent shadow-none">
        <CardContent className="p-6 flex items-start gap-4">
          <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full shrink-0">
            <Lightbulb className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-semibold">Budget Calculator Tool</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Want to recalculate your optimal category allocations based on your income? Try the interactive zero-based budget calculator to plan your next month.
            </p>
            <Button variant="outline" className="mt-4">Launch Calculator</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
