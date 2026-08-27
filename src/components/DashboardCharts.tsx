"use client";

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
                  tickFormatter={(value) => `₹${value}`}
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
                    <Cell key={`cell-₹${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`₹${value}`, undefined]}
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
