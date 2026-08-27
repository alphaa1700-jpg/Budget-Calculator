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
  estimatedCost: z.coerce.number(),
  targetYear: z.string(),
  status: z.enum(["PLANNING", "IN_PROGRESS", "ON_TRACK", "COMPLETED"]).default("PLANNING"),
  notes: z.string().optional(),
});

export function FuturePlanForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({ resolver: zodResolver(formSchema) });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const result = await createRecord("FuturePlans", values);
      if (result.success) {
        toast.success("FuturePlan saved!");
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
          <FormItem><FormLabel>Plan Name</FormLabel><FormControl><Input placeholder="e.g. Buy a House" {...field} /></FormControl></FormItem>
        )} />
        <FormField control={form.control} name="estimatedCost" render={({ field }) => (
          <FormItem><FormLabel>Estimated Cost</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
        )} />
        <FormField control={form.control} name="targetYear" render={({ field }) => (
          <FormItem><FormLabel>Target Year</FormLabel><FormControl><Input placeholder="e.g. 2030" {...field} /></FormControl></FormItem>
        )} />
        <FormField control={form.control} name="status" render={({ field }) => (
          <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="PLANNING">Planning</SelectItem><SelectItem value="IN_PROGRESS">In Progress</SelectItem><SelectItem value="ON_TRACK">On Track</SelectItem><SelectItem value="COMPLETED">Completed</SelectItem></SelectContent></Select></FormItem>
        )} />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save"}
        </Button>
      </form>
    </Form>
  );
}
