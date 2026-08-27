const fs = require('fs');
const path = require('path');

const features = [
  {
    name: 'Account',
    sheetName: 'Accounts',
    route: 'accounts',
    schema: 'name: z.string().min(2),\n  type: z.enum(["BANK", "CASH", "UPI", "OTHER"]).default("BANK"),\n  currentBalance: z.coerce.number(),\n  status: z.enum(["ACTIVE", "CLOSED"]).default("ACTIVE"),',
    fields: '        <FormField control={form.control} name="name" render={({ field }) => (\n          <FormItem><FormLabel>Account Name</FormLabel><FormControl><Input placeholder="e.g. Chase Checking" {...field} /></FormControl></FormItem>\n        )} />\n        <FormField control={form.control} name="type" render={({ field }) => (\n          <FormItem><FormLabel>Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="BANK">Bank</SelectItem><SelectItem value="CASH">Cash</SelectItem><SelectItem value="UPI">UPI/Digital</SelectItem><SelectItem value="OTHER">Other</SelectItem></SelectContent></Select></FormItem>\n        )} />\n        <FormField control={form.control} name="currentBalance" render={({ field }) => (\n          <FormItem><FormLabel>Current Balance</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl></FormItem>\n        )} />\n'
  },
  {
    name: 'Card',
    sheetName: 'Cards',
    route: 'cards',
    schema: 'name: z.string().min(2),\n  bank: z.string().min(2),\n  creditLimit: z.coerce.number(),\n  currentOutstanding: z.coerce.number(),\n  dueDate: z.string(),\n  last4: z.string().max(4),',
    fields: '        <FormField control={form.control} name="name" render={({ field }) => (\n          <FormItem><FormLabel>Card Name</FormLabel><FormControl><Input placeholder="e.g. Sapphire" {...field} /></FormControl></FormItem>\n        )} />\n        <FormField control={form.control} name="bank" render={({ field }) => (\n          <FormItem><FormLabel>Bank</FormLabel><FormControl><Input placeholder="e.g. Chase" {...field} /></FormControl></FormItem>\n        )} />\n        <div className="grid grid-cols-2 gap-4">\n          <FormField control={form.control} name="creditLimit" render={({ field }) => (\n            <FormItem><FormLabel>Credit Limit</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>\n          )} />\n          <FormField control={form.control} name="currentOutstanding" render={({ field }) => (\n            <FormItem><FormLabel>Outstanding</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>\n          )} />\n        </div>\n        <div className="grid grid-cols-2 gap-4">\n          <FormField control={form.control} name="dueDate" render={({ field }) => (\n            <FormItem><FormLabel>Due Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl></FormItem>\n          )} />\n          <FormField control={form.control} name="last4" render={({ field }) => (\n            <FormItem><FormLabel>Last 4 Digits</FormLabel><FormControl><Input placeholder="1234" {...field} /></FormControl></FormItem>\n          )} />\n        </div>\n'
  },
  {
    name: 'Bill',
    sheetName: 'Bills',
    route: 'bills',
    schema: 'name: z.string().min(2),\n  amount: z.coerce.number(),\n  dueDate: z.string(),\n  status: z.enum(["PAID", "UNPAID"]).default("UNPAID"),\n  frequency: z.enum(["MONTHLY", "YEARLY", "WEEKLY"]).default("MONTHLY"),',
    fields: '        <FormField control={form.control} name="name" render={({ field }) => (\n          <FormItem><FormLabel>Bill Name</FormLabel><FormControl><Input placeholder="e.g. Electricity" {...field} /></FormControl></FormItem>\n        )} />\n        <FormField control={form.control} name="amount" render={({ field }) => (\n          <FormItem><FormLabel>Amount</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl></FormItem>\n        )} />\n        <FormField control={form.control} name="dueDate" render={({ field }) => (\n          <FormItem><FormLabel>Due Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl></FormItem>\n        )} />\n'
  },
  {
    name: 'Goal',
    sheetName: 'Goals',
    route: 'goals',
    schema: 'name: z.string().min(2),\n  targetAmount: z.coerce.number(),\n  currentAmount: z.coerce.number(),\n  targetDate: z.string(),\n  priority: z.enum(["HIGH", "MEDIUM", "LOW"]).default("MEDIUM"),\n  status: z.enum(["ACTIVE", "COMPLETED"]).default("ACTIVE"),',
    fields: '        <FormField control={form.control} name="name" render={({ field }) => (\n          <FormItem><FormLabel>Goal Name</FormLabel><FormControl><Input placeholder="e.g. Vacation" {...field} /></FormControl></FormItem>\n        )} />\n        <div className="grid grid-cols-2 gap-4">\n          <FormField control={form.control} name="targetAmount" render={({ field }) => (\n            <FormItem><FormLabel>Target Amount</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>\n          )} />\n          <FormField control={form.control} name="currentAmount" render={({ field }) => (\n            <FormItem><FormLabel>Current Saved</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>\n          )} />\n        </div>\n        <FormField control={form.control} name="targetDate" render={({ field }) => (\n          <FormItem><FormLabel>Target Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl></FormItem>\n        )} />\n'
  },
  {
    name: 'Grocery',
    sheetName: 'Grocery',
    route: 'grocery',
    schema: 'date: z.string(),\n  store: z.string().min(2),\n  amount: z.coerce.number(),\n  category: z.string().min(2),\n  notes: z.string().optional(),',
    fields: '        <FormField control={form.control} name="store" render={({ field }) => (\n          <FormItem><FormLabel>Store</FormLabel><FormControl><Input placeholder="e.g. Costco" {...field} /></FormControl></FormItem>\n        )} />\n        <FormField control={form.control} name="amount" render={({ field }) => (\n          <FormItem><FormLabel>Amount</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl></FormItem>\n        )} />\n        <FormField control={form.control} name="date" render={({ field }) => (\n          <FormItem><FormLabel>Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl></FormItem>\n        )} />\n        <FormField control={form.control} name="category" render={({ field }) => (\n          <FormItem><FormLabel>Sub-Category</FormLabel><FormControl><Input placeholder="e.g. Meat/Produce" {...field} /></FormControl></FormItem>\n        )} />\n'
  },
  {
    name: 'MobilePlan',
    sheetName: 'MobilePlans',
    route: 'mobile-plans',
    schema: 'provider: z.string().min(2),\n  phone: z.string().min(2),\n  cost: z.coerce.number(),\n  dataLimit: z.string(),\n  renewalDate: z.string(),\n  status: z.string().default("ACTIVE"),',
    fields: '        <FormField control={form.control} name="provider" render={({ field }) => (\n          <FormItem><FormLabel>Provider</FormLabel><FormControl><Input placeholder="e.g. Verizon" {...field} /></FormControl></FormItem>\n        )} />\n        <FormField control={form.control} name="phone" render={({ field }) => (\n          <FormItem><FormLabel>Device/Plan Name</FormLabel><FormControl><Input placeholder="e.g. iPhone 15" {...field} /></FormControl></FormItem>\n        )} />\n        <FormField control={form.control} name="cost" render={({ field }) => (\n          <FormItem><FormLabel>Monthly Cost</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl></FormItem>\n        )} />\n        <FormField control={form.control} name="dataLimit" render={({ field }) => (\n          <FormItem><FormLabel>Data Limit</FormLabel><FormControl><Input placeholder="e.g. Unlimited or 5GB" {...field} /></FormControl></FormItem>\n        )} />\n        <FormField control={form.control} name="renewalDate" render={({ field }) => (\n          <FormItem><FormLabel>Next Renewal</FormLabel><FormControl><Input type="date" {...field} /></FormControl></FormItem>\n        )} />\n'
  },
  {
    name: 'FuturePlan',
    sheetName: 'FuturePlans',
    route: 'future-plans',
    schema: 'name: z.string().min(2),\n  estimatedCost: z.coerce.number(),\n  targetYear: z.string(),\n  status: z.enum(["PLANNING", "IN_PROGRESS", "ON_TRACK", "COMPLETED"]).default("PLANNING"),\n  notes: z.string().optional(),',
    fields: '        <FormField control={form.control} name="name" render={({ field }) => (\n          <FormItem><FormLabel>Plan Name</FormLabel><FormControl><Input placeholder="e.g. Buy a House" {...field} /></FormControl></FormItem>\n        )} />\n        <FormField control={form.control} name="estimatedCost" render={({ field }) => (\n          <FormItem><FormLabel>Estimated Cost</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>\n        )} />\n        <FormField control={form.control} name="targetYear" render={({ field }) => (\n          <FormItem><FormLabel>Target Year</FormLabel><FormControl><Input placeholder="e.g. 2030" {...field} /></FormControl></FormItem>\n        )} />\n        <FormField control={form.control} name="status" render={({ field }) => (\n          <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="PLANNING">Planning</SelectItem><SelectItem value="IN_PROGRESS">In Progress</SelectItem><SelectItem value="ON_TRACK">On Track</SelectItem><SelectItem value="COMPLETED">Completed</SelectItem></SelectContent></Select></FormItem>\n        )} />\n'
  }
];

const template = function(feat) {
  return '"use client";\n\n' +
  'import { useState } from "react";\n' +
  'import { useForm } from "react-hook-form";\n' +
  'import { zodResolver } from "@hookform/resolvers/zod";\n' +
  'import * as z from "zod";\n' +
  'import { createRecord } from "@/app/actions";\n' +
  'import { toast } from "sonner";\n' +
  'import { Button } from "@/components/ui/button";\n' +
  'import { Input } from "@/components/ui/input";\n' +
  'import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";\n' +
  'import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";\n' +
  'import { Loader2 } from "lucide-react";\n\n' +
  'const formSchema = z.object({\n' + feat.schema + '\n});\n\n' +
  'export function ' + feat.name + 'Form({ onSuccess }: { onSuccess?: () => void }) {\n' +
  '  const [isSubmitting, setIsSubmitting] = useState(false);\n' +
  '  const form = useForm<z.infer<typeof formSchema>>({ resolver: zodResolver(formSchema) });\n\n' +
  '  async function onSubmit(values: z.infer<typeof formSchema>) {\n' +
  '    setIsSubmitting(true);\n' +
  '    try {\n' +
  '      const result = await createRecord("' + feat.sheetName + '", values);\n' +
  '      if (result.success) {\n' +
  '        toast.success("' + feat.name + ' saved!");\n' +
  '        form.reset();\n' +
  '        if (onSuccess) onSuccess();\n' +
  '      } else {\n' +
  '        toast.error("Error: " + result.error);\n' +
  '      }\n' +
  '    } catch (e) {\n' +
  '      toast.error("Failed to save");\n' +
  '    } finally {\n' +
  '      setIsSubmitting(false);\n' +
  '    }\n' +
  '  }\n\n' +
  '  return (\n' +
  '    <Form {...form}>\n' +
  '      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">\n' +
  feat.fields +
  '        <Button type="submit" className="w-full" disabled={isSubmitting}>\n' +
  '          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save"}\n' +
  '        </Button>\n' +
  '      </form>\n' +
  '    </Form>\n' +
  '  );\n' +
  '}\n';
};

features.forEach(feat => {
  // 1. Write the form
  const formPath = path.join(__dirname, "src", "components", "forms", feat.name + "Form.tsx");
  fs.writeFileSync(formPath, template(feat));
  console.log("Wrote " + formPath);

  // 2. Patch the page.tsx
  const pagePath = path.join(__dirname, "src", "app", feat.route, "page.tsx");
  if (fs.existsSync(pagePath)) {
    let content = fs.readFileSync(pagePath, "utf8");
    
    // Add imports if missing
    if (!content.includes("DialogTrigger")) {
      content = 'import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";\nimport { ' + feat.name + 'Form } from "@/components/forms/' + feat.name + 'Form";\n' + content;
    }
    
    // Replace the raw button with Dialog
    content = content.replace(
      /<Button className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary\/90">\s*<Plus className="mr-2 h-4 w-4" \/>\s*(Add [^<]+)\s*<\/Button>/,
      '<Dialog>\n          <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 w-full sm:w-auto">\n            <Plus className="mr-2 h-4 w-4" /> $1\n          </DialogTrigger>\n          <DialogContent className="sm:max-w-[425px]">\n            <DialogHeader>\n              <DialogTitle>$1</DialogTitle>\n            </DialogHeader>\n            <' + feat.name + 'Form />\n          </DialogContent>\n        </Dialog>'
    );

    fs.writeFileSync(pagePath, content);
    console.log("Patched " + pagePath);
  }
});
