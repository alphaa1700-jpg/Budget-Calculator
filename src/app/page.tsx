import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, TrendingDown, TrendingUp, PiggyBank } from "lucide-react";
import { transactionsRepo, accountsRepo, categoriesRepo } from "@/lib/repositories";
import { DashboardCharts } from "@/components/DashboardCharts";

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  let income: any[] = [];
  let expenses: any[] = [];
  let accounts: any[] = [];
  let categories: any[] = [];

  try {
    const results = await Promise.all([
      transactionsRepo.getAll(),
      accountsRepo.getAll(),
      categoriesRepo.getAll()
    ]);
    const allTxs = results[0];
    accounts = results[1];
    const categories = results[2];
    income = (allTxs || []).filter((t: any) => t.type === "INCOME");
    expenses = (allTxs || []).filter((t: any) => t.type === "EXPENSE");
  } catch(e) {
    console.error(e);
  }

  // Calculate live values
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const currentMonthIncome = income.reduce((total, item) => {
    const d = new Date(item.date);
    if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
      return total + Number(item.amount || 0);
    }
    return total;
  }, 0);

  const currentMonthExpenses = expenses.reduce((total, item) => {
    const d = new Date(item.date);
    if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
      return total + Number(item.amount || 0);
    }
    return total;
  }, 0);

  const availableBalance = accounts.reduce((total, acc) => total + Number(acc.currentBalance || 0), 0);
  const currentMonthSavings = currentMonthIncome - currentMonthExpenses;

  
  // Calculate historical chart data (last 6 months)
  const chartData = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(currentYear, currentMonth - i, 1);
    const monthName = d.toLocaleString('default', { month: 'short' });
    const targetMonth = d.getMonth();
    const targetYear = d.getFullYear();
    
    const mIncome = income.reduce((sum, t) => {
      const td = new Date(t.date);
      return (td.getMonth() === targetMonth && td.getFullYear() === targetYear) ? sum + Number(t.amount || 0) : sum;
    }, 0);
    
    const mExpenses = expenses.reduce((sum, t) => {
      const td = new Date(t.date);
      return (td.getMonth() === targetMonth && td.getFullYear() === targetYear) ? sum + Number(t.amount || 0) : sum;
    }, 0);
    
    chartData.push({ name: monthName, income: mIncome, expenses: mExpenses });
  }

  // Calculate category donut data
  const COLORS = ['#10b981', '#6366f1', '#f43f5e', '#f59e0b', '#8b5cf6', '#0ea5e9'];
  const categoryTotals: Record<string, number> = {};
  
  expenses.forEach(t => {
    const d = new Date(t.date);
    if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
      const catName = categories.find((c: any) => c.id === t.categoryId)?.name || 'Uncategorized';
      categoryTotals[catName] = (categoryTotals[catName] || 0) + Number(t.amount || 0);
    }
  });
  
  const categoryData = Object.keys(categoryTotals)
    .map((name, index) => ({
      name,
      value: categoryTotals[name],
      color: COLORS[index % COLORS.length]
    }))
    .sort((a, b) => b.value - a.value);

  // Generate Insights
  let savingsRate = "0%";
  let savingsMessage = "Keep track of your spending!";
  if (currentMonthIncome > 0) {
    const rate = Math.max(0, (currentMonthSavings / currentMonthIncome) * 100);
    savingsRate = rate.toFixed(1) + "%";
    if (rate >= 20) savingsMessage = "Excellent! You are saving above the recommended 20% rule.";
    else if (rate > 0) savingsMessage = "Good start. Try to reach a 20% savings rate.";
    else savingsMessage = "You spent more than you earned this month.";
  }

  let topExpenseName = "None";
  let topExpenseMessage = "No expenses this month.";
  if (categoryData.length > 0) {
    topExpenseName = categoryData[0].name;
    const percentage = ((categoryData[0].value / currentMonthExpenses) * 100).toFixed(0);
    topExpenseMessage = `Accounting for ${percentage}% of your total monthly expenses.`;
  }

  // Variance: Compare current month expenses to last month
  let variance = "₹0";
  let varianceMessage = "No change from last month.";
  if (chartData.length >= 2) {
    const lastMonthEx = chartData[4].expenses; // index 4 is last month, index 5 is current
    const diff = currentMonthExpenses - lastMonthEx;
    if (diff > 0) {
      variance = `+₹${diff.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
      varianceMessage = `You spent more than last month.`;
    } else {
      variance = `-₹${Math.abs(diff).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
      varianceMessage = `Great job! You spent less than last month.`;
    }
  }

  const insights = {
    savingsRate,
    savingsMessage,
    topExpenseName,
    topExpenseMessage,
    variance,
    varianceMessage
  };


  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Monthly Budget Overview</h1>
        <p className="text-muted-foreground">Track your spending against your plan</p>
      </div>

      {/* Top summary metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-emerald-800 dark:text-emerald-400">Total Income</CardTitle>
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-full">
              <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">₹{currentMonthIncome.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
            <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80 mt-1">actual this month</p>
          </CardContent>
        </Card>
        
        <Card className="bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-rose-800 dark:text-rose-400">Total Expenses</CardTitle>
            <div className="p-2 bg-rose-100 dark:bg-rose-900 rounded-full">
              <TrendingDown className="h-4 w-4 text-rose-600 dark:text-rose-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-900 dark:text-rose-100">₹{currentMonthExpenses.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
            <p className="text-xs text-rose-600/80 dark:text-rose-400/80 mt-1">actual this month</p>
          </CardContent>
        </Card>
        
        <Card className="bg-indigo-50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-indigo-800 dark:text-indigo-400">Net Savings</CardTitle>
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-full">
              <PiggyBank className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">₹{currentMonthSavings.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
            <p className="text-xs text-indigo-600/80 dark:text-indigo-400/80 mt-1">income minus expenses</p>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-amber-800 dark:text-amber-400">Available Balance</CardTitle>
            <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-full">
              <Wallet className="h-4 w-4 text-amber-600 dark:text-amber-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">₹{availableBalance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
            <p className="text-xs text-amber-600/80 dark:text-amber-400/80 mt-1">across all accounts</p>
          </CardContent>
        </Card>
      </div>

      <DashboardCharts data={chartData} categoryData={categoryData} insights={insights} />
    </div>
  );
}
