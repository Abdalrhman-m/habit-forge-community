
import { useState, useEffect, useCallback } from 'react';
import { Habit } from '../../domain/entities/habit';
import { HabitService } from '../../application/services/habitService';
import { LocalStorageHabitRepository } from '../../infrastructure/repositories/localStorageHabitRepository';
import { HabitStats } from '../../domain/entities/stats';
import { generateHabitStats } from '../../utils/habitUtils';
import { useToast } from "@/components/ui/use-toast";

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [stats, setStats] = useState<HabitStats>({
    totalHabits: 0,
    activeStreak: 0,
    completionRate: 0,
    totalCompletions: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  
  // Initialize repositories and services
  const habitRepository = new LocalStorageHabitRepository();
  const habitService = new HabitService(habitRepository);
  
  const loadHabits = useCallback(async () => {
    setIsLoading(true);
    try {
      const loadedHabits = await habitService.getAllHabits();
      setHabits(loadedHabits);
      setStats(generateHabitStats(loadedHabits));
    } catch (error) {
      console.error("Error loading habits:", error);
      toast({
        title: "Error",
        description: "Failed to load habits. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [habitService, toast]);
  
  useEffect(() => {
    loadHabits();
  }, [loadHabits]);
  
  const addHabit = async (newHabit: Omit<Habit, "id" | "createdAt" | "currentStreak" | "longestStreak" | "trackingData">) => {
    try {
      const habit = await habitService.createHabit(newHabit);
      setHabits(prev => [...prev, habit]);
      setStats(generateHabitStats([...habits, habit]));
      toast({
        title: "Success",
        description: `"${habit.name}" has been added to your habits.`,
      });
      return habit;
    } catch (error) {
      console.error("Error adding habit:", error);
      toast({
        title: "Error",
        description: "Failed to add habit. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const updateHabit = async (updatedHabit: Habit) => {
    try {
      const habit = await habitService.updateHabit(updatedHabit);
      setHabits(prev => prev.map(h => h.id === habit.id ? habit : h));
      setStats(generateHabitStats(habits.map(h => h.id === habit.id ? habit : h)));
      return habit;
    } catch (error) {
      console.error("Error updating habit:", error);
      toast({
        title: "Error",
        description: "Failed to update habit. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const toggleHabitCompletion = async (habitId: string, date?: string) => {
    try {
      const updatedHabit = await habitService.toggleHabitCompletion(habitId, date);
      setHabits(prev => prev.map(h => h.id === habitId ? updatedHabit : h));
      setStats(generateHabitStats(habits.map(h => h.id === habitId ? updatedHabit : h)));
      
      const isCompleted = updatedHabit.trackingData.find(d => 
        d.date === (date || new Date().toISOString().split('T')[0])
      )?.completed;
      
      toast({
        title: isCompleted ? `${updatedHabit.name} completed!` : `${updatedHabit.name} marked incomplete.`,
        description: isCompleted ? `Current streak: ${updatedHabit.currentStreak} days` : "",
      });
      
      return updatedHabit;
    } catch (error) {
      console.error("Error toggling habit completion:", error);
      toast({
        title: "Error",
        description: "Failed to update habit. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const deleteHabit = async (habitId: string) => {
    try {
      const success = await habitService.deleteHabit(habitId);
      if (success) {
        const updatedHabits = habits.filter(h => h.id !== habitId);
        setHabits(updatedHabits);
        setStats(generateHabitStats(updatedHabits));
        toast({
          title: "Success",
          description: "Habit deleted successfully.",
        });
      }
      return success;
    } catch (error) {
      console.error("Error deleting habit:", error);
      toast({
        title: "Error",
        description: "Failed to delete habit. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const getHabitTemplates = async () => {
    try {
      return await habitService.getHabitTemplates();
    } catch (error) {
      console.error("Error getting habit templates:", error);
      return [];
    }
  };
  
  return {
    habits,
    stats,
    isLoading,
    addHabit,
    updateHabit,
    toggleHabitCompletion,
    deleteHabit,
    getHabitTemplates,
    refreshHabits: loadHabits
  };
};
