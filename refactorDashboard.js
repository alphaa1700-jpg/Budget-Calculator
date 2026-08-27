const fs = require('fs');

const pageContent = fs.readFileSync('src/app/page.tsx', 'utf8');

// The original page content is a Client component. We'll extract the charts to a separate file.
const dashboardChartsContent = `"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";

export function DashboardCharts({ data, categoryData }) {
  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Income vs Expenses Chart */}
        <Card className="col-span-4 shadow-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Income vs. Expenses by Month</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'currentColor', opacity: 0.7 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'currentColor', opacity: 0.7 }}
                  tickFormatter={(value) => \`₹\${value}\`}
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="income" fill="#1e1b4b" radius={[4, 4, 0, 0]} className="dark:fill-indigo-400" />
                <Bar dataKey="expenses" fill="#e11d48" radius={[4, 4, 0, 0]} className="dark:fill-rose-500" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Category Breakdown Donut */}
        <Card className="col-span-3 shadow-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Expense Breakdown by Category</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px] flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={\`cell-₹\${index}\`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [\`₹\${value}\`, undefined]}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Custom Legend */}
            <div className="w-full grid grid-cols-2 gap-2 mt-4 px-4">
              {categoryData.slice(0, 4).map(cat => (
                <div key={cat.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-muted-foreground">{cat.name}</span>
                  </div>
                  <span className="font-medium">₹{cat.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Actionable Insights */}
        <Card className="col-span-2 shadow-sm border-border/50 bg-gradient-to-br from-slate-900 to-slate-800 text-slate-50 dark:from-slate-950 dark:to-slate-900">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-400" />
              Actionable Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
                <div className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Savings Rate</div>
                <div className="text-2xl font-bold text-emerald-400">31.0%</div>
                <div className="text-sm text-slate-300 mt-2">Excellent! You are saving above the recommended 20% rule.</div>
              </div>
              
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
                <div className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Top Expense</div>
                <div className="text-2xl font-bold text-rose-400">Housing</div>
                <div className="text-sm text-slate-300 mt-2">Accounting for 50% of your total monthly expenses.</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
                <div className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Variance</div>
                <div className="text-2xl font-bold text-amber-400">+₹232.00</div>
                <div className="text-sm text-slate-300 mt-2">You are slightly over budget in Travel this month.</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Small Trend Chart */}
        <Card className="col-span-1 shadow-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Spending Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'currentColor', opacity: 0.5, fontSize: 12 }}
                  dy={10}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#0ea5e9" 
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
`;

fs.writeFileSync('src/components/DashboardCharts.tsx', dashboardChartsContent);

const serverPageContent = `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, TrendingDown, TrendingUp, PiggyBank } from "lucide-react";
import { incomeRepo, expensesRepo, accountsRepo } from "@/lib/repositories";
import { DashboardCharts } from "@/components/DashboardCharts";

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  let income = [];
  let expenses = [];
  let accounts = [];

  try {
    const results = await Promise.all([
      incomeRepo.getAll(),
      expensesRepo.getAll(),
      accountsRepo.getAll()
    ]);
    income = results[0];
    expenses = results[1];
    accounts = results[2];
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
`;

fs.writeFileSync('src/app/page.tsx', serverPageContent);
console.log('Done rewriting page.tsx');
