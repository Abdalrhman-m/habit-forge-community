
import Navbar from "@/components/layout/Navbar";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import StatsSummary from "@/components/dashboard/StatsSummary";
import HabitList from "@/components/habits/HabitList";
import AddHabitDialog from "@/components/habits/AddHabitDialog";
import { useHabits } from "@/presentation/hooks/useHabits";
import { Loader2 } from "lucide-react";

export default function Index() {
  const {
    habits,
    stats,
    isLoading,
    addHabit,
    toggleHabitCompletion,
  } = useHabits();
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col space-y-6">
          <WelcomeBanner />
          
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="animate-spin h-8 w-8 mx-auto text-primary mb-4" />
              <p>Loading your habits...</p>
            </div>
          ) : (
            <>
              <StatsSummary stats={stats} />
              
              <div className="flex justify-between items-center pb-4">
                <h2 className="text-xl font-semibold">Your Habits</h2>
                <AddHabitDialog onAddHabit={addHabit} />
              </div>
              
              <HabitList habits={habits} onHabitUpdate={toggleHabitCompletion} />
              
              <div className="border-t pt-6 mt-8">
                <h2 className="text-xl font-semibold mb-4">Challenges</h2>
                <div className="bg-muted/50 rounded-lg p-6 text-center">
                  <h3 className="text-lg font-medium mb-2">Join a Challenge!</h3>
                  <p className="text-muted-foreground mb-4">
                    Join community challenges to supercharge your habit building journey.
                  </p>
                  <a href="/challenges" className="text-primary font-medium hover:underline">
                    Explore Challenges →
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
