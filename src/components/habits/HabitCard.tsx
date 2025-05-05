
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Habit } from "../../domain/entities/Habit";
import { getLastNDays } from "../../presentation/utils/habitUtils";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

interface HabitCardProps {
  habit: Habit;
  onHabitUpdate: (habitId: string, date?: string) => Promise<Habit>;
}

export default function HabitCard({ habit, onHabitUpdate }: HabitCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  const lastSevenDays = getLastNDays(habit, 7);
  const todayCompleted = lastSevenDays.find(day => day.isToday)?.completed;
  
  const handleToggleComplete = async () => {
    setIsUpdating(true);
    
    try {
      await onHabitUpdate(habit.id);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update habit status",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <Card className="habit-card overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="text-2xl">{habit.icon}</div>
            <h3 className="font-medium">{habit.name}</h3>
          </div>
          <div className="text-sm font-medium text-muted-foreground">
            {habit.currentStreak} day streak
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {habit.description && (
          <p className="text-sm text-muted-foreground mb-4">{habit.description}</p>
        )}
        
        <div className="flex justify-between items-center mb-1">
          <div className="text-xs text-muted-foreground">Last 7 days</div>
          <div className="text-xs text-muted-foreground">Today</div>
        </div>
        
        <div className="flex justify-between items-center gap-1.5">
          {lastSevenDays.map((day, i) => (
            <div 
              key={day.date}
              className={`streak-dot ${day.completed ? 'streak-dot-complete' : 'streak-dot-incomplete'} ${day.isToday ? 'streak-dot-today' : ''}`}
              title={`${new Date(day.date).toLocaleDateString()}: ${day.completed ? 'Completed' : 'Not completed'}`}
            />
          ))}
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleToggleComplete} 
          disabled={isUpdating} 
          variant={todayCompleted ? "outline" : "default"} 
          className="w-full"
        >
          {isUpdating ? (
            <span className="animate-pulse">Updating...</span>
          ) : todayCompleted ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Completed
            </>
          ) : (
            "Mark Complete"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
