
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HabitStats } from "@/types/habit";
import { Flame, Star, CheckCircle, Target } from "lucide-react";

interface StatsSummaryProps {
  stats: HabitStats;
}

export default function StatsSummary({ stats }: StatsSummaryProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Active Streak</CardDescription>
          <CardTitle className="text-2xl flex items-center">
            {stats.activeStreak} days
            <Flame className="ml-2 h-5 w-5 text-orange-500" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">Keep it going!</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Completion Rate</CardDescription>
          <CardTitle className="text-2xl flex items-center">
            {stats.completionRate.toFixed(0)}%
            <Target className="ml-2 h-5 w-5 text-blue-500" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">Last 30 days</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Total Habits</CardDescription>
          <CardTitle className="text-2xl flex items-center">
            {stats.totalHabits}
            <Star className="ml-2 h-5 w-5 text-yellow-500" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">Being tracked</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Total Completions</CardDescription>
          <CardTitle className="text-2xl flex items-center">
            {stats.totalCompletions}
            <CheckCircle className="ml-2 h-5 w-5 text-green-500" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">All time</p>
        </CardContent>
      </Card>
    </div>
  );
}
