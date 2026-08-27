"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createRecord } from "@/app/actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
name: z.string().min(2),
  bank: z.string().min(2),
  creditLimit: z.coerce.number(),
  currentOutstanding: z.coerce.number(),
  dueDate: z.string(),
  last4: z.string().max(4),
});

export function CardForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({ resolver: zodResolver(formSchema) });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const result = await createRecord("Cards", values);
      if (result.success) {
        toast.success("Card saved!");
        form.reset();
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
          <FormItem><FormLabel>Card Name</FormLabel><FormControl><Input placeholder="e.g. Sapphire" {...field} /></FormControl></FormItem>
        )} />
        <FormField control={form.control} name="bank" render={({ field }) => (
          <FormItem><FormLabel>Bank</FormLabel><FormControl><Input placeholder="e.g. Chase" {...field} /></FormControl></FormItem>
        )} />
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="creditLimit" render={({ field }) => (
            <FormItem><FormLabel>Credit Limit</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
          )} />
          <FormField control={form.control} name="currentOutstanding" render={({ field }) => (
            <FormItem><FormLabel>Outstanding</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
          )} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="dueDate" render={({ field }) => (
            <FormItem><FormLabel>Due Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl></FormItem>
          )} />
          <FormField control={form.control} name="last4" render={({ field }) => (
            <FormItem><FormLabel>Last 4 Digits</FormLabel><FormControl><Input placeholder="1234" {...field} /></FormControl></FormItem>
          )} />
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save"}
        </Button>
      </form>
    </Form>
  );
}
