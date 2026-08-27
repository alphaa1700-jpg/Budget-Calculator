import { DataTableActions } from "@/components/ui/data-table-actions";
import { categoriesRepo } from "@/lib/repositories";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CategoryForm } from "@/components/forms/CategoryForm";
import { Plus, Settings2, Tags } from "lucide-react";
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

export default async function SettingsPage() {
  let categories = [];
  
  try {
    categories = await categoriesRepo.getAll();
  } catch (error) {
    console.error("Failed to load data:", error);
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your app preferences and reference data.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* General Preferences */}
        <Card className="shadow-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings2 className="h-5 w-5" />
              General Preferences
            </CardTitle>
            <CardDescription>Customize your experience.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <div>
                <div className="font-medium">Currency</div>
                <div className="text-sm text-muted-foreground">Set your default currency symbol</div>
              </div>
              <div className="font-semibold px-3 py-1 bg-secondary rounded-md">₹ INR</div>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b">
              <div>
                <div className="font-medium">Date Format</div>
                <div className="text-sm text-muted-foreground">How dates are displayed</div>
              </div>
              <div className="font-semibold px-3 py-1 bg-secondary rounded-md">MM/DD/YYYY</div>
            </div>

            <Button variant="outline" className="w-full mt-2">Edit Preferences</Button>
          </CardContent>
        </Card>

        {/* Categories Manager */}
        <Card className="shadow-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Tags className="h-5 w-5 text-muted-foreground" />
                Custom Categories
              </CardTitle>
            </div>
            
            <Dialog>
              <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-8 px-3 text-xs">
                <Plus className="mr-2 h-4 w-4" /> Add Category
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Custom Category</DialogTitle>
                </DialogHeader>
                <CategoryForm />
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {categories.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground border rounded-md border-dashed mt-4">
                No categories found. Click Add to create one.
              </div>
            ) : (
            <div className="rounded-md border overflow-hidden mt-4">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((cat) => (
                    <TableRow key={cat.id}>
                      <TableCell className="font-medium">{cat.name}</TableCell>
                      <TableCell>
                        <span className={`text-xs px-2 py-1 rounded-full ₹{
                          cat.type === 'INCOME' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                        }`}>
                          {cat.type}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-xs text-muted-foreground">{cat.status}</span>
                      </TableCell>
                      <TableCell>
                        <DataTableActions sheetName="Categories" recordId={cat.id} recordName="Category" />
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
    </div>
  );
}
