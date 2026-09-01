const fs = require('fs');
let c = fs.readFileSync('src/app/layout.tsx', 'utf8');

c = c.replace(
  'import { ThemeToggle } from "@/components/theme-toggle";',
  'import { ThemeToggle } from "@/components/theme-toggle";\nimport { MagicExpenseLogger } from "@/components/MagicExpenseLogger";'
);

c = c.replace(
  '<main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 flex flex-col">\n              <div className="flex-1">',
  `<div className="hidden md:flex h-14 items-center justify-end border-b px-6 lg:h-[60px] bg-background gap-4">
              <MagicExpenseLogger />
              <ThemeToggle />
            </div>
            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 flex flex-col">
              <div className="flex-1">`
);

fs.writeFileSync('src/app/layout.tsx', c);
