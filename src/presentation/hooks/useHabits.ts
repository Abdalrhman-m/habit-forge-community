
import { useState, useEffect } from 'react';
import { Habit, HabitStats } from '../../domain/entities/Habit';
import Container from '../../infrastructure/di/container';
import { useToast } from '@/components/ui/use-toast';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [stats, setStats] = useState<HabitStats>({
    totalHabits: 0,
    activeStreak: 0,
    completionRate: 0,
    totalCompletions: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  const habitUseCases = Container.getHabitUseCases();
  
  useEffect(() => {
    loadHabits();
  }, []);
  
  const loadHabits = async () => {
    setLoading(true);
    try {
      const loadedHabits = await habitUseCases.getHabits();
      setHabits(loadedHabits);
      setStats(habitUseCases.getHabitStats(loadedHabits));
    } catch (error) {
      console.error('Error loading habits:', error);
      toast({
        title: 'Error',
        description: 'Failed to load habits',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const addHabit = async (newHabit: Habit) => {
    try {
      const addedHabit = await habitUseCases.addHabit(newHabit);
      setHabits(prevHabits => [...prevHabits, addedHabit]);
      setStats(habitUseCases.getHabitStats([...habits, addedHabit]));
      toast({
        title: 'New habit created!',
        description: `"${newHabit.name}" has been added to your habits.`,
      });
      return addedHabit;
    } catch (error) {
      console.error('Error adding habit:', error);
      toast({
        title: 'Error',
        description: 'Failed to add habit',
      });
      throw error;
    }
  };
  
  const updateHabit = async (updatedHabit: Habit) => {
    try {
      const result = await habitUseCases.updateHabit(updatedHabit);
      setHabits(prevHabits => 
        prevHabits.map(habit => 
          habit.id === updatedHabit.id ? result : habit
        )
      );
      setStats(habitUseCases.getHabitStats(habits.map(habit => 
        habit.id === updatedHabit.id ? result : habit
      )));
      return result;
    } catch (error) {
      console.error('Error updating habit:', error);
      toast({
        title: 'Error',
        description: 'Failed to update habit',
      });
      throw error;
    }
  };
  
  const toggleHabitCompletion = async (habitId: string, date?: string) => {
    try {
      const updatedHabit = await habitUseCases.toggleHabitCompletion(habitId, date);
      setHabits(prevHabits => 
        prevHabits.map(habit => 
          habit.id === habitId ? updatedHabit : habit
        )
      );
      setStats(habitUseCases.getHabitStats(habits.map(habit => 
        habit.id === habitId ? updatedHabit : habit
      )));
      
      const isCompleted = updatedHabit.trackingData.find(
        d => d.date === (date || new Date().toISOString().split('T')[0])
      )?.completed;
      
      toast({
        title: isCompleted
          ? `${updatedHabit.name} completed!`
          : `${updatedHabit.name} marked incomplete.`,
        description: isCompleted
          ? `Current streak: ${updatedHabit.currentStreak} days`
          : "",
      });
      
      return updatedHabit;
    } catch (error) {
      console.error('Error toggling habit completion:', error);
      toast({
        title: 'Error',
        description: 'Failed to update habit completion status',
      });
      throw error;
    }
  };

  return {
    habits,
    stats,
    loading,
    addHabit,
    updateHabit,
    toggleHabitCompletion
  };
}
