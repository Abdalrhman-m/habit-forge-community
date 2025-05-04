
/**
 * Core Habit entity representing a habit that a user wants to track
 */
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
  goalId?: string; // Reference to a goal this habit is related to
  userId?: string; // Owner of this habit
}
