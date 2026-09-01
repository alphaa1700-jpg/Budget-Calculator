"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function MagicExpenseLogger() {
  const [input, setInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function handleLog(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/expenses/magic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });

      if (!res.ok) throw new Error("Failed to parse expense");

      const data = await res.json();
      toast.success(`Logged ₹${data.amount} for ${data.categoryName}`);
      setInput("");
      router.refresh();
    } catch (err) {
      toast.error("Could not understand that. Try '500 for groceries'");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleLog} className="relative w-full max-w-md hidden md:flex items-center">
      <div className="relative w-full group">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-indigo-500">
          <Sparkles className="h-4 w-4" />
        </div>
        <Input
          type="text"
          className="pl-9 pr-20 py-2 h-10 w-full bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800 focus-visible:ring-indigo-500 rounded-full transition-all"
          placeholder="Magic Log: e.g. '450 for uber'"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isSubmitting}
        />
        <div className="absolute inset-y-0 right-1 flex items-center">
          <Button 
            type="submit" 
            size="sm" 
            className="h-8 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-3"
            disabled={!input.trim() || isSubmitting}
          >
            {isSubmitting ? <Loader2 className="h-3 w-3 animate-spin" /> : "Log"}
          </Button>
        </div>
      </div>
    </form>
  );
}
