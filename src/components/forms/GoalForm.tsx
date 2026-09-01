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
  targetAmount: z.coerce.number(),
  currentAmount: z.coerce.number(),
  targetDate: z.string(),
  priority: z.enum(["HIGH", "MEDIUM", "LOW"]).default("MEDIUM"),
  status: z.enum(["ACTIVE", "COMPLETED"]).default("ACTIVE"),
});

export function GoalForm({ onSuccess, initialData }: { onSuccess?: () => void, initialData?: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({ resolver: zodResolver(formSchema), defaultValues: initialData || {} });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      let result;
      if (initialData?.id) {
        result = await updateRecord("Goals", initialData.id, values);
      } else {
        result = await createRecord("Goals", values);
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
          <FormItem><FormLabel>Goal Name</FormLabel><FormControl><Input placeholder="e.g. Vacation" {...field} /></FormControl></FormItem>
        )} />
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="targetAmount" render={({ field }) => (
            <FormItem><FormLabel>Target Amount</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
          )} />
          <FormField control={form.control} name="currentAmount" render={({ field }) => (
            <FormItem><FormLabel>Current Saved</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
          )} />
        </div>
        <FormField control={form.control} name="targetDate" render={({ field }) => (
          <FormItem><FormLabel>Target Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl></FormItem>
        )} />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (initialData?.id ? "Update" : "Save")}
        </Button>
      </form>
    </Form>
  );
}
