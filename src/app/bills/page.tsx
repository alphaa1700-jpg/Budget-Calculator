import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BillForm } from "@/components/forms/BillForm";
import { billsRepo } from "@/lib/repositories";
import { Button } from "@/components/ui/button";
import { Plus, CalendarDays, CheckCircle2, Circle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const dynamic = 'force-dynamic';

export default async function BillsPage() {
  let bills: any[] = [];
  
  try {
    bills = await billsRepo.getAll();
  } catch (error) {
    console.error("Failed to load data:", error);
  }

  const upcomingBills = ( || []).filter(b => b.status === "UNPAID");
  const paidBills = ( || []).filter(b => b.status === "PAID");
  
  const upcomingTotal = upcomingBills.reduce((sum, b) => sum + Number(b.amount), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bills & Subscriptions</h1>
          <p className="text-muted-foreground">Keep track of your recurring payments.</p>
        </div>
        <Dialog>
          <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Add Bill
        
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Bill
        </DialogTitle>
            </DialogHeader>
            <BillForm />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-sm border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-amber-500" />
                  Upcoming Bills
                </CardTitle>
                <CardDescription>To be paid in the next 30 days.</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Total Due</div>
                <div className="text-xl font-bold text-amber-600 dark:text-amber-400">₹{upcomingTotal.toFixed(2)}</div>
              </div>
            </CardHeader>
            <CardContent>
              {upcomingBills.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                  No upcoming bills due.
                </div>
              ) : (
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead>Bill Name</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingBills.map((bill) => (
                      <TableRow key={bill.id}>
                        <TableCell>
                          <button className="text-muted-foreground hover:text-emerald-500 transition-colors">
                            <Circle className="h-5 w-5" />
                          </button>
                        </TableCell>
                        <TableCell className="font-medium">
                          {bill.name}
                          <div className="text-xs text-muted-foreground font-normal">{bill.frequency}</div>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                            {new Date(bill.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          ₹{Number(bill.amount).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border/50 opacity-70 hover:opacity-100 transition-opacity">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                Recently Paid
              </CardTitle>
            </CardHeader>
            <CardContent>
              {paidBills.length === 0 ? (
                <div className="text-center py-4 text-sm text-muted-foreground">No recent payments.</div>
              ) : (
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableBody>
                    {paidBills.map((bill) => (
                      <TableRow key={bill.id} className="bg-muted/20">
                        <TableCell className="w-[50px]">
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        </TableCell>
                        <TableCell className="font-medium text-muted-foreground strike-through">
                          {bill.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(bill.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          ₹{Number(bill.amount).toFixed(2)}
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

        <div className="space-y-6">
          <Card className="bg-slate-900 text-slate-50 dark:from-slate-950 dark:to-slate-900 border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-base text-slate-300">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="secondary" className="w-full justify-start text-slate-900">Scan Bill / Receipt</Button>
              <Button variant="secondary" className="w-full justify-start text-slate-900">Manage Auto-Pay</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
