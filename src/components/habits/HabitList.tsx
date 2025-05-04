
import { useState } from "react";
import { Habit } from "@/types/habit";
import HabitCard from "./HabitCard";

interface HabitListProps {
  habits: Habit[];
  onHabitUpdate: (updatedHabit: Habit) => void;
}

export default function HabitList({ habits, onHabitUpdate }: HabitListProps) {
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  
  const filteredHabits = habits.filter(habit => {
    const today = new Date().toISOString().split("T")[0];
    const todayCompleted = habit.trackingData.some(
      data => data.date === today && data.completed
    );
    
    if (filter === "all") return true;
    if (filter === "completed") return todayCompleted;
    if (filter === "active") return !todayCompleted;
    return true;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex space-x-2 pb-2">
        <button
          onClick={() => setFilter("all")}
          className={`text-sm px-3 py-1 rounded-full transition-colors ${
            filter === "all" 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted hover:bg-muted/80"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("active")}
          className={`text-sm px-3 py-1 rounded-full transition-colors ${
            filter === "active" 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted hover:bg-muted/80"
          }`}
        >
          Not Completed
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`text-sm px-3 py-1 rounded-full transition-colors ${
            filter === "completed" 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted hover:bg-muted/80"
          }`}
        >
          Completed
        </button>
      </div>
      
      {filteredHabits.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">
            {filter === "all" 
              ? "You don't have any habits yet. Create your first habit!" 
              : filter === "active" 
                ? "All habits completed for today. Great job!" 
                : "No completed habits yet today."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHabits.map(habit => (
            <HabitCard 
              key={habit.id} 
              habit={habit} 
              onHabitUpdate={onHabitUpdate} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
