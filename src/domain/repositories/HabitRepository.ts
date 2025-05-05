
import { Habit, HabitStats } from '../entities/Habit';

export interface HabitRepository {
  getHabits(): Promise<Habit[]>;
  saveHabits(habits: Habit[]): Promise<void>;
  getHabitById(id: string): Promise<Habit | undefined>;
  addHabit(habit: Habit): Promise<Habit>;
  updateHabit(habit: Habit): Promise<Habit>;
  toggleHabitCompletion(habitId: string, date?: string): Promise<Habit>;
  getHabitStats(habits: Habit[]): HabitStats;
}
