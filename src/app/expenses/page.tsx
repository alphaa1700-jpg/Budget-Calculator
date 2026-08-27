import { DataTableActions } from "@/components/ui/data-table-actions";
import { transactionsRepo, categoriesRepo } from "@/lib/repositories";
import { Button } from "@/components/ui/button";
import { Plus, Receipt } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ExpenseForm } from "@/components/forms/ExpenseForm";

export const dynamic = 'force-dynamic';

export default async function ExpensesPage() {
  let transactions: any[] = [];
  let categories: any[] = [];
  
  try {
    const [txs, cats] = await Promise.all([
      transactionsRepo.getAll(),
      categoriesRepo.getAll()
    ]);
    
    // Filter just to expenses
    transactions = txs.filter(t => t.type === 'EXPENSE');
    // Sort descending by date
    transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    categories = cats;
  } catch (error) {
    console.error("Failed to load data:", error);
  }

  // Helper to resolve category ID to Name
  const getCategoryName = (id: string) => {
    if (!id) return 'Uncategorized';
    const cat = categories.find(c => c.id === id);
    return cat ? cat.name : id;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
          <p className="text-muted-foreground">Manage and track your daily spending.</p>
        </div>
        
        <Dialog>
          <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Add Expense
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Expense</DialogTitle>
              <DialogDescription>
                Record a new expense. It will be saved to your Google Sheet instantly.
              </DialogDescription>
            </DialogHeader>
            <ExpenseForm categories={categories} />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Receipt className="h-5 w-5 text-muted-foreground" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Receipt className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold">No expenses found</h3>
              <p className="text-muted-foreground max-w-sm mt-2">
                You haven't recorded any expenses yet. Click the "Add Expense" button to get started.
              </p>
            </div>
          ) : (
            <div className="rounded-md border border-border/50 overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Merchant</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="font-medium">
                        {new Date(tx.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{tx.description || '-'}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary/50">
                          {getCategoryName(tx.categoryId)}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{tx.merchant || '-'}</TableCell>
                      <TableCell className="text-right font-bold text-rose-500">
                        ₹{Number(tx.amount).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <DataTableActions sheetName="Transactions" recordId={tx.id} recordName="Expense" />
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
  );
}
