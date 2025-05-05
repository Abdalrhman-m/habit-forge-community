
export type HabitFrequency = 'daily' | 'weekly' | 'custom';

export interface HabitTrackingDate {
  date: string; // ISO date string: YYYY-MM-DD
  completed: boolean;
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  frequency: HabitFrequency;
  timeOfDay?: string;
  reminderTime?: string;
  customDays?: number[]; // 0-6, where 0 is Sunday
  currentStreak: number;
  longestStreak: number;
  createdAt: string;
  trackingData: HabitTrackingDate[];
}

export interface HabitStats {
  totalHabits: number;
  activeStreak: number;
  completionRate: number;
  totalCompletions: number;
}
