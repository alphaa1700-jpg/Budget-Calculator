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
name: z.string().min(2),
  type: z.enum(["BANK", "CASH", "UPI", "OTHER"]).default("BANK"),
  currentBalance: z.coerce.number(),
  status: z.enum(["ACTIVE", "CLOSED"]).default("ACTIVE"),
});

export function AccountForm({ onSuccess, initialData }: { onSuccess?: () => void, initialData?: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({ resolver: zodResolver(formSchema), defaultValues: initialData || {} });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      let result;
      if (initialData?.id) {
        result = await updateRecord("Accounts", initialData.id, values);
      } else {
        result = await createRecord("Accounts", values);
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
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem><FormLabel>Account Name</FormLabel><FormControl><Input placeholder="e.g. Chase Checking" {...field} /></FormControl></FormItem>
        )} />
        <FormField control={form.control} name="type" render={({ field }) => (
          <FormItem><FormLabel>Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="BANK">Bank</SelectItem><SelectItem value="CASH">Cash</SelectItem><SelectItem value="UPI">UPI/Digital</SelectItem><SelectItem value="OTHER">Other</SelectItem></SelectContent></Select></FormItem>
        )} />
        <FormField control={form.control} name="currentBalance" render={({ field }) => (
          <FormItem><FormLabel>Current Balance</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl></FormItem>
        )} />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (initialData?.id ? "Update" : "Save")}
        </Button>
      </form>
    </Form>
  );
}
