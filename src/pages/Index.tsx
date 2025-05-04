
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import StatsSummary from "@/components/dashboard/StatsSummary";
import HabitList from "@/components/habits/HabitList";
import AddHabitDialog from "@/components/habits/AddHabitDialog";
import { Habit } from "@/types/habit";
import { getMockHabits, generateHabitStats } from "@/utils/habitUtils";
import { useToast } from "@/components/ui/use-toast";

export default function Index() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    // Load habits from localStorage or use mock data
    const savedHabits = localStorage.getItem("habits");
    if (savedHabits) {
      try {
        setHabits(JSON.parse(savedHabits));
      } catch (error) {
        console.error("Error parsing habits from localStorage:", error);
        setHabits(getMockHabits());
      }
    } else {
      // Use mock data for demonstration
      setHabits(getMockHabits());
    }
  }, []);
  
  // Save habits to localStorage whenever they change
  useEffect(() => {
    if (habits.length > 0) {
      localStorage.setItem("habits", JSON.stringify(habits));
    }
  }, [habits]);
  
  const handleAddHabit = (newHabit: Habit) => {
    setHabits(prevHabits => [...prevHabits, newHabit]);
    toast({
      title: "New habit created!",
      description: `"${newHabit.name}" has been added to your habits.`,
    });
  };
  
  const handleHabitUpdate = (updatedHabit: Habit) => {
    setHabits(prevHabits => 
      prevHabits.map(habit => 
        habit.id === updatedHabit.id ? updatedHabit : habit
      )
    );
  };
  
  const stats = generateHabitStats(habits);
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col space-y-6">
          <WelcomeBanner />
          
          <StatsSummary stats={stats} />
          
          <div className="flex justify-between items-center pb-4">
            <h2 className="text-xl font-semibold">Your Habits</h2>
            <AddHabitDialog onAddHabit={handleAddHabit} />
          </div>
          
          <HabitList habits={habits} onHabitUpdate={handleHabitUpdate} />
          
          <div className="border-t pt-6 mt-8">
            <h2 className="text-xl font-semibold mb-4">Challenges</h2>
            <div className="bg-muted/50 rounded-lg p-6 text-center">
              <h3 className="text-lg font-medium mb-2">Coming Soon!</h3>
              <p className="text-muted-foreground">
                Join community challenges to supercharge your habit building journey.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
