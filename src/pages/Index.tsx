
import Navbar from "@/components/layout/Navbar";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import StatsSummary from "@/components/dashboard/StatsSummary";
import HabitList from "@/components/habits/HabitList";
import AddHabitDialog from "@/components/habits/AddHabitDialog";
import { useHabits } from "../presentation/hooks/useHabits";

export default function Index() {
  const { 
    habits, 
    stats, 
    loading, 
    addHabit, 
    toggleHabitCompletion 
  } = useHabits();
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-muted-foreground">Loading habits...</p>
          </div>
        ) : (
          <div className="flex flex-col space-y-6">
            <WelcomeBanner />
            
            <StatsSummary stats={stats} />
            
            <div className="flex justify-between items-center pb-4">
              <h2 className="text-xl font-semibold">Your Habits</h2>
              <AddHabitDialog onAddHabit={addHabit} />
            </div>
            
            <HabitList 
              habits={habits} 
              onHabitUpdate={toggleHabitCompletion} 
            />
            
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
        )}
      </main>
    </div>
  );
}
