
import { Habit, HabitStats } from '../../domain/entities/Habit';
import { HabitRepository } from '../../domain/repositories/HabitRepository';

export class HabitUseCases {
  constructor(private habitRepository: HabitRepository) {}

  async getHabits(): Promise<Habit[]> {
    return this.habitRepository.getHabits();
  }

  async addHabit(habit: Habit): Promise<Habit> {
    return this.habitRepository.addHabit(habit);
  }

  async updateHabit(habit: Habit): Promise<Habit> {
    return this.habitRepository.updateHabit(habit);
  }

  async toggleHabitCompletion(habitId: string, date?: string): Promise<Habit> {
    return this.habitRepository.toggleHabitCompletion(habitId, date);
  }

  getHabitStats(habits: Habit[]): HabitStats {
    return this.habitRepository.getHabitStats(habits);
  }

  async getHabitById(id: string): Promise<Habit | undefined> {
    return this.habitRepository.getHabitById(id);
  }
}
