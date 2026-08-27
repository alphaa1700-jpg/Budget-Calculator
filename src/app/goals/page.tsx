import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { GoalForm } from "@/components/forms/GoalForm";
import { goalsRepo } from "@/lib/repositories";
import { Button } from "@/components/ui/button";
import { Plus, Target, Award, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";

export const dynamic = 'force-dynamic';

export default async function GoalsPage() {
  let goals = [];
  
  try {
    goals = await goalsRepo.getAll();
  } catch (error) {
    console.error("Failed to load data:", error);
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Savings Goals</h1>
          <p className="text-muted-foreground">Track your progress toward financial milestones.</p>
        </div>
        <Button className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" /> Create Goal
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {goals.length === 0 ? (
          <div className="col-span-1 md:col-span-2 flex flex-col items-center justify-center py-12 text-center border rounded-lg border-dashed">
            <Target className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold">No goals found</h3>
            <p className="text-muted-foreground max-w-sm mt-2">
              You haven't set any financial goals yet. Click "Create Goal" to start planning your milestones.
            </p>
          </div>
        ) : (
        goals.map((goal) => {
          const percent = Math.min((Number(goal.currentAmount) / Number(goal.targetAmount)) * 100, 100);
          const isComplete = percent >= 100;
          const isAlmostDone = percent >= 80 && !isComplete;
          
          let cardStyle = "border-border/50";
          let progressColor = "bg-primary";
          
          if (isComplete) {
            cardStyle = "border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/10";
            progressColor = "[&>div]:bg-emerald-500";
          } else if (isAlmostDone) {
            cardStyle = "border-indigo-500/30";
            progressColor = "[&>div]:bg-indigo-500";
          }

          return (
            <Card key={goal.id} className={`shadow-sm transition-all hover:shadow-md ₹{cardStyle}`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      {isComplete ? <Award className="h-6 w-6 text-emerald-500" /> : <Target className="h-5 w-5 text-muted-foreground" />}
                      {goal.name}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Target: {new Date(goal.targetDate).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                    </CardDescription>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full font-medium ₹{
                    goal.priority === 'HIGH' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' 
                    : goal.priority === 'MEDIUM' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {goal.priority}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex justify-between items-end mb-2">
                  <div className="text-3xl font-bold">
                    ₹{Number(goal.currentAmount).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground mb-1">
                    of ₹{Number(goal.targetAmount).toLocaleString()}
                  </div>
                </div>
                
                <Progress value={percent} className={`h-3 mt-4 ₹{progressColor}`} />
                
                <div className="flex justify-between text-sm mt-2 font-medium">
                  <span className={isComplete ? "text-emerald-600 dark:text-emerald-400" : ""}>{percent.toFixed(1)}%</span>
                  <span className="text-muted-foreground">
                    ₹{(Number(goal.targetAmount) - Number(goal.currentAmount)).toLocaleString()} left
                  </span>
                </div>
                
                <div className="pt-4 mt-4 border-t flex justify-end">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                    Manage <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        }))}
      </div>
    </div>
  );
}
