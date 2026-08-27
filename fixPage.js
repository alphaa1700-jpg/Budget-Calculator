const fs = require('fs');
let c = fs.readFileSync('src/app/page.tsx', 'utf8');

c = c.replace(
  'import { incomeRepo, expensesRepo, accountsRepo } from "@/lib/repositories";',
  'import { transactionsRepo, accountsRepo } from "@/lib/repositories";'
);

c = c.replace(
  '      incomeRepo.getAll(),\n      expensesRepo.getAll(),\n      accountsRepo.getAll()',
  '      transactionsRepo.getAll(),\n      accountsRepo.getAll()'
);

c = c.replace(
  '    income = results[0];\n    expenses = results[1];\n    accounts = results[2];',
  '    const allTxs = results[0];\n    accounts = results[1];\n    income = allTxs.filter((t: any) => t.type === "INCOME");\n    expenses = allTxs.filter((t: any) => t.type === "EXPENSE");'
);

fs.writeFileSync('src/app/page.tsx', c);
