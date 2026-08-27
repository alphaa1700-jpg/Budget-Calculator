const fs = require('fs');

let c = fs.readFileSync('src/components/DashboardCharts.tsx', 'utf8');

c = c.replace(
  'export function DashboardCharts({ data, categoryData }) {',
  'export function DashboardCharts({ data, categoryData, insights }: { data: any[], categoryData: any[], insights: any }) {'
);

// Replace Actionable Insights section
c = c.replace(
  /<div className="text-2xl font-bold text-emerald-400">31.0%<\/div>\s*<div className="text-sm text-slate-300 mt-2">Excellent! You are saving above the recommended 20% rule.<\/div>/g,
  '<div className="text-2xl font-bold text-emerald-400">{insights.savingsRate}</div>\n                <div className="text-sm text-slate-300 mt-2">{insights.savingsMessage}</div>'
);

c = c.replace(
  /<div className="text-2xl font-bold text-rose-400">Housing<\/div>\s*<div className="text-sm text-slate-300 mt-2">Accounting for 50% of your total monthly expenses.<\/div>/g,
  '<div className="text-2xl font-bold text-rose-400">{insights.topExpenseName}</div>\n                <div className="text-sm text-slate-300 mt-2">{insights.topExpenseMessage}</div>'
);

c = c.replace(
  /<div className="text-2xl font-bold text-amber-400">\+₹232.00<\/div>\s*<div className="text-sm text-slate-300 mt-2">You are slightly over budget in Travel this month.<\/div>/g,
  '<div className="text-2xl font-bold text-amber-400">{insights.variance}</div>\n                <div className="text-sm text-slate-300 mt-2">{insights.varianceMessage}</div>'
);

fs.writeFileSync('src/components/DashboardCharts.tsx', c);

let page = fs.readFileSync('src/app/page.tsx', 'utf8');

const dynamicLogic = `
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
    topExpenseMessage = \`Accounting for \${percentage}% of your total monthly expenses.\`;
  }

  // Variance: Compare current month expenses to last month
  let variance = "₹0";
  let varianceMessage = "No change from last month.";
  if (chartData.length >= 2) {
    const lastMonthEx = chartData[4].expenses; // index 4 is last month, index 5 is current
    const diff = currentMonthExpenses - lastMonthEx;
    if (diff > 0) {
      variance = \`+₹\${diff.toLocaleString('en-IN', { maximumFractionDigits: 2 })}\`;
      varianceMessage = \`You spent more than last month.\`;
    } else {
      variance = \`-₹\${Math.abs(diff).toLocaleString('en-IN', { maximumFractionDigits: 2 })}\`;
      varianceMessage = \`Great job! You spent less than last month.\`;
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
`;

// Replace the static charts logic
page = page.replace(
  'import { transactionsRepo, accountsRepo } from "@/lib/repositories";',
  'import { transactionsRepo, accountsRepo, categoriesRepo } from "@/lib/repositories";'
);

page = page.replace(
  '      transactionsRepo.getAll(),\n      accountsRepo.getAll()',
  '      transactionsRepo.getAll(),\n      accountsRepo.getAll(),\n      categoriesRepo.getAll()'
);

page = page.replace(
  '    accounts = results[1];\n    income = allTxs.filter((t: any) => t.type === "INCOME");',
  '    accounts = results[1];\n    const categories = results[2];\n    income = allTxs.filter((t: any) => t.type === "INCOME");'
);

// We need to inject `let categories: any[] = [];` at the top
page = page.replace(
  '  let accounts: any[] = [];',
  '  let accounts: any[] = [];\n  let categories: any[] = [];'
);

// Replace the hardcoded `chartData` and `categoryData` with our dynamic logic
page = page.replace(
  /\/\/ Placeholder data for charts[\s\S]*?(?=<div className="space-y-8 animate-in fade-in duration-500">)/,
  dynamicLogic + '\n\n  return (\n    '
);

page = page.replace(
  '<DashboardCharts data={chartData} categoryData={categoryData} />',
  '<DashboardCharts data={chartData} categoryData={categoryData} insights={insights} />'
);

fs.writeFileSync('src/app/page.tsx', page);
console.log('Successfully refactored charts');
