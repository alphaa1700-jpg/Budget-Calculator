// @ts-nocheck
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createRecord, updateRecord } from "@/app/actions";
import { toast } from "sonner"; 

const expenseSchema = z.object({
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  date: z.date({
    required_error: "A date is required.",
  }),
  categoryId: z.string().min(1, "Please select a category"),
  description: z.string().optional(),
  merchant: z.string().optional(),
  type: z.enum(["EXPENSE", "INCOME"]),
  accountId: z.string().default("default_account"), 
});

export type ExpenseFormValues = z.infer<typeof expenseSchema>;

interface ExpenseFormProps {
  initialData?: any;
  onSuccess?: () => void;
  categories?: { id: string; name: string }[];
  transactionType?: "EXPENSE" | "INCOME";
}

export function ExpenseForm({ onSuccess, categories = [], transactionType = "EXPENSE", initialData }: ExpenseFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultCategories = categories.length > 0 ? categories : [
    { id: "cat-groceries", name: "Groceries" },
    { id: "cat-dining", name: "Dining Out" },
    { id: "cat-transport", name: "Transportation" },
    { id: "cat-utilities", name: "Utilities" },
    { id: "cat-shopping", name: "Shopping" },
    { id: "cat-entertainment", name: "Entertainment" },
  ];

  // Parse the date properly to avoid format() crashes
  const parsedDefaultValues = initialData ? {
    ...initialData,
    date: initialData.date ? new Date(initialData.date) : new Date(),
    amount: Number(initialData.amount)
  } : {
    amount: 0,
    description: "",
    merchant: "",
    categoryId: "",
    type: transactionType,
    accountId: "default_account",
    date: new Date(),
  };

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: parsedDefaultValues,
  });

  async function onSubmit(data: ExpenseFormValues) {
    setIsSubmitting(true);
    try {
      let result;
      const dataToSave = { ...data, date: data.date.toISOString() };
      
      if (initialData?.id) {
        result = await updateRecord("Transactions", initialData.id, dataToSave);
      } else {
        result = await createRecord("Transactions", dataToSave);
      }
      
      if (result.success) {
        toast.success(initialData?.id ? "Updated successfully" : "Added successfully");
        if (!initialData?.id) form.reset();
        if (onSuccess) onSuccess();
      } else {
        toast.error(result.error || "Failed");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      ₹
                    </div>
                    <Input type="number" step="0.01" className="pl-7" placeholder="0.00" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value && !isNaN(field.value.getTime()) ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {defaultCategories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                  {!defaultCategories.some(c => c.id === field.value) && field.value && (
                    <SelectItem value={field.value}>Unknown Category</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="merchant"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Merchant</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Target, Amazon" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Input placeholder="Optional notes" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            initialData?.id ? "Update Transaction" : (transactionType === "INCOME" ? "Save Income" : "Save Expense")
          )}
        </Button>
      </form>
    </Form>
  );
}
