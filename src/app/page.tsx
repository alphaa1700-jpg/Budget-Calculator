import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, TrendingDown, TrendingUp, PiggyBank } from "lucide-react";
import { transactionsRepo, accountsRepo } from "@/lib/repositories";
import { DashboardCharts } from "@/components/DashboardCharts";

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  let income: any[] = [];
  let expenses: any[] = [];
  let accounts: any[] = [];

  try {
    const results = await Promise.all([
      transactionsRepo.getAll(),
      accountsRepo.getAll()
    ]);
    const allTxs = results[0];
    accounts = results[1];
    income = allTxs.filter((t: any) => t.type === "INCOME");
    expenses = allTxs.filter((t: any) => t.type === "EXPENSE");
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

  // Placeholder data for charts
  const chartData = [
    { name: 'Jan', income: 4500, expenses: 3200 },
    { name: 'Feb', income: 4800, expenses: 3000 },
    { name: 'Mar', income: 5200, expenses: 3800 },
    { name: 'Apr', income: 4900, expenses: 3100 },
    { name: 'May', income: 5500, expenses: 3500 },
    { name: 'Jun', income: currentMonthIncome, expenses: currentMonthExpenses },
  ];

  const categoryData = [
    { name: 'Groceries', value: 850, color: '#10b981' },
    { name: 'Rent', value: 2000, color: '#6366f1' },
    { name: 'Shopping', value: 450, color: '#f43f5e' },
    { name: 'Utilities', value: 300, color: '#f59e0b' },
    { name: 'Entertainment', value: 400, color: '#8b5cf6' }
  ];

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

      <DashboardCharts data={chartData} categoryData={categoryData} />
    </div>
  );
}
