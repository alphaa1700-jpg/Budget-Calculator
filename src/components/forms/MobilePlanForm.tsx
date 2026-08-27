// @ts-nocheck
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
provider: z.string().min(2),
  phone: z.string().min(2),
  cost: z.coerce.number(),
  dataLimit: z.string(),
  renewalDate: z.string(),
  status: z.string().default("ACTIVE"),
});

export function MobilePlanForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({ resolver: zodResolver(formSchema) });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const result = await createRecord("MobilePlans", values);
      if (result.success) {
        toast.success("MobilePlan saved!");
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
        <FormField control={form.control} name="provider" render={({ field }) => (
          <FormItem><FormLabel>Provider</FormLabel><FormControl><Input placeholder="e.g. Verizon" {...field} /></FormControl></FormItem>
        )} />
        <FormField control={form.control} name="phone" render={({ field }) => (
          <FormItem><FormLabel>Device/Plan Name</FormLabel><FormControl><Input placeholder="e.g. iPhone 15" {...field} /></FormControl></FormItem>
        )} />
        <FormField control={form.control} name="cost" render={({ field }) => (
          <FormItem><FormLabel>Monthly Cost</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl></FormItem>
        )} />
        <FormField control={form.control} name="dataLimit" render={({ field }) => (
          <FormItem><FormLabel>Data Limit</FormLabel><FormControl><Input placeholder="e.g. Unlimited or 5GB" {...field} /></FormControl></FormItem>
        )} />
        <FormField control={form.control} name="renewalDate" render={({ field }) => (
          <FormItem><FormLabel>Next Renewal</FormLabel><FormControl><Input type="date" {...field} /></FormControl></FormItem>
        )} />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save"}
        </Button>
      </form>
    </Form>
  );
}
