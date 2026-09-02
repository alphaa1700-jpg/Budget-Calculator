const fs = require('fs');
const glob = require('glob');

function repairPage(file, replacements) {
  let c = fs.readFileSync(file, 'utf8');
  for (const [bad, good] of replacements) {
    c = c.split(bad).join(good);
  }
  fs.writeFileSync(file, c);
}

repairPage('src/app/bills/page.tsx', [
  ['const upcomingBills = ( || []).filter', 'const upcomingBills = (bills || []).filter'],
  ['const paidBills = ( || []).filter', 'const paidBills = (bills || []).filter']
]);

repairPage('src/app/budget/page.tsx', [
  ['const currentMonthExpenses = ( || []).filter', 'const currentMonthExpenses = (transactions || []).filter']
]);

repairPage('src/app/expenses/page.tsx', [
  ['transactions = ( || []).filter', 'transactions = (txs || []).filter'],
  ['( || []).sort', '(transactions || []).sort']
]);

repairPage('src/app/income/page.tsx', [
  ['transactions = ( || []).filter', 'transactions = (txs || []).filter'],
  ['( || []).sort', '(transactions || []).sort']
]);

repairPage('src/app/page.tsx', [
  ['income = ( || []).filter', 'income = (allTxs || []).filter'],
  ['expenses = ( || []).filter', 'expenses = (allTxs || []).filter']
]);

console.log("Pages repaired!");
