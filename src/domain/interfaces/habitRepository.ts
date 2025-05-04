
import { Habit } from "../entities/habit";

export interface HabitRepository {
  getAll(userId?: string): Promise<Habit[]>;
  getById(id: string): Promise<Habit | null>;
  create(habit: Omit<Habit, "id" | "createdAt">): Promise<Habit>;
  update(habit: Habit): Promise<Habit>;
  delete(id: string): Promise<boolean>;
  toggleCompletion(id: string, date?: string): Promise<Habit>;
  getHabitTemplates(): Promise<Partial<Habit>[]>;
}
