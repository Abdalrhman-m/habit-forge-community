
import { Habit, HabitStats } from '../types/habit';

/**
 * Generate a unique ID for a new habit
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayString(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

/**
 * Calculate the current streak for a habit
 */
export function calculateStreak(habit: Habit): number {
  const sortedDates = [...habit.trackingData]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  let streak = 0;
  const today = getTodayString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toISOString().split('T')[0];
  
  // Check if today is completed
  const todayCompleted = sortedDates.find(d => d.date === today)?.completed;
  
  // Start counting from yesterday if today isn't yet completed
  let currentDate = todayCompleted ? today : yesterdayString;
  
  for (const entry of sortedDates) {
    if (entry.date === currentDate && entry.completed) {
      streak += 1;
      const prevDate = new Date(currentDate);
      prevDate.setDate(prevDate.getDate() - 1);
      currentDate = prevDate.toISOString().split('T')[0];
    } else if (entry.date === currentDate && !entry.completed) {
      break;
    } else if (entry.date < currentDate) {
      // We found a gap, streak is broken
      break;
    }
  }
  
  return streak;
}

/**
 * Get the last n days for a habit (for streak visualization)
 */
export function getLastNDays(habit: Habit, days: number): { date: string; completed: boolean; isToday: boolean }[] {
  const result = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const trackingData = habit.trackingData.find(d => d.date === dateStr);
    const isToday = dateStr === getTodayString();
    
    result.push({
      date: dateStr,
      completed: trackingData?.completed || false,
      isToday
    });
  }
  
  return result;
}

/**
 * Toggle the completion status for a habit on a specific date
 */
export function toggleHabitCompletion(habit: Habit, date?: string): Habit {
  const targetDate = date || getTodayString();
  
  const updatedTrackingData = [...habit.trackingData];
  const existingIndex = updatedTrackingData.findIndex(d => d.date === targetDate);
  
  if (existingIndex >= 0) {
    // Toggle existing entry
    updatedTrackingData[existingIndex] = {
      ...updatedTrackingData[existingIndex],
      completed: !updatedTrackingData[existingIndex].completed
    };
  } else {
    // Add new completed entry
    updatedTrackingData.push({
      date: targetDate,
      completed: true
    });
  }
  
  // Recalculate streak
  const updatedHabit = {
    ...habit,
    trackingData: updatedTrackingData
  };
  
  const currentStreak = calculateStreak(updatedHabit);
  
  return {
    ...updatedHabit,
    currentStreak,
    longestStreak: Math.max(currentStreak, habit.longestStreak)
  };
}

/**
 * Calculate completion rate for the past 30 days
 */
export function calculateCompletionRate(habit: Habit): number {
  const last30Days = getLastNDays(habit, 30);
  const completed = last30Days.filter(day => day.completed).length;
  return (completed / 30) * 100;
}

/**
 * Generate aggregate stats for all habits
 */
export function generateHabitStats(habits: Habit[]): HabitStats {
  if (!habits.length) {
    return {
      totalHabits: 0,
      activeStreak: 0,
      completionRate: 0,
      totalCompletions: 0
    };
  }
  
  const totalHabits = habits.length;
  const activeStreak = Math.max(...habits.map(h => h.currentStreak));
  const totalCompletions = habits.reduce((acc, habit) => {
    return acc + habit.trackingData.filter(d => d.completed).length;
  }, 0);
  
  // Average completion rate across all habits
  const completionRates = habits.map(h => calculateCompletionRate(h));
  const completionRate = completionRates.reduce((acc, rate) => acc + rate, 0) / totalHabits;
  
  return {
    totalHabits,
    activeStreak,
    completionRate,
    totalCompletions
  };
}

/**
 * Mock data for demo purposes
 */
export function getMockHabits(): Habit[] {
  const today = getTodayString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toISOString().split('T')[0];
  
  return [
    {
      id: "habit-1",
      name: "Morning Meditation",
      description: "10 minutes of mindful meditation",
      icon: "🧘‍♂️",
      color: "#4CAF50",
      frequency: "daily",
      timeOfDay: "morning",
      currentStreak: 5,
      longestStreak: 14,
      createdAt: "2023-04-01T00:00:00.000Z",
      trackingData: [
        { date: today, completed: true },
        { date: yesterdayString, completed: true },
        { date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().split('T')[0], completed: true },
        { date: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString().split('T')[0], completed: true },
        { date: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString().split('T')[0], completed: true }
      ]
    },
    {
      id: "habit-2",
      name: "Read 20 Pages",
      description: "Reading habit for continuous learning",
      icon: "📚",
      color: "#2196F3",
      frequency: "daily",
      timeOfDay: "evening",
      currentStreak: 2,
      longestStreak: 7,
      createdAt: "2023-04-15T00:00:00.000Z",
      trackingData: [
        { date: today, completed: true },
        { date: yesterdayString, completed: true },
        { date: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString().split('T')[0], completed: true }
      ]
    },
    {
      id: "habit-3",
      name: "Workout",
      description: "30 minutes exercise routine",
      icon: "💪",
      color: "#FF5722",
      frequency: "custom",
      customDays: [1, 3, 5], // Mon, Wed, Fri
      timeOfDay: "morning",
      currentStreak: 3,
      longestStreak: 8,
      createdAt: "2023-03-10T00:00:00.000Z",
      trackingData: [
        { date: today, completed: false },
        { date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().split('T')[0], completed: true },
        { date: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString().split('T')[0], completed: true },
        { date: new Date(new Date().setDate(new Date().getDate() - 6)).toISOString().split('T')[0], completed: true }
      ]
    }
  ];
}
