// @ts-nocheck
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createRecord, updateRecord } from "@/app/actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
date: z.string(),
  store: z.string().min(2),
  amount: z.coerce.number(),
  category: z.string().min(2),
  notes: z.string().optional(),
});

export function GroceryForm({ onSuccess, initialData }: { onSuccess?: () => void, initialData?: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({ resolver: zodResolver(formSchema), defaultValues: initialData || {} });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      let result;
      if (initialData?.id) {
        result = await updateRecord("Grocery", initialData.id, values);
      } else {
        result = await createRecord("Grocery", values);
      }
      if (result.success) {
        toast.success(initialData?.id ? "Updated successfully!" : "Saved successfully!");
        if (!initialData?.id) form.reset();
        if (onSuccess) onSuccess();
      } else {
        toast.error("Error: " + result.error);
      }
    } catch (e) {
      toast.error("Failed to save");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="store" render={({ field }) => (
          <FormItem><FormLabel>Store</FormLabel><FormControl><Input placeholder="e.g. Costco" {...field} /></FormControl></FormItem>
        )} />
        <FormField control={form.control} name="amount" render={({ field }) => (
          <FormItem><FormLabel>Amount</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl></FormItem>
        )} />
        <FormField control={form.control} name="date" render={({ field }) => (
          <FormItem><FormLabel>Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl></FormItem>
        )} />
        <FormField control={form.control} name="category" render={({ field }) => (
          <FormItem><FormLabel>Sub-Category</FormLabel><FormControl><Input placeholder="e.g. Meat/Produce" {...field} /></FormControl></FormItem>
        )} />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (initialData?.id ? "Update" : "Save")}
        </Button>
      </form>
    </Form>
  );
}
