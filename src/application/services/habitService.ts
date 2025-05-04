
import { Habit } from "../../domain/entities/habit";
import { HabitRepository } from "../../domain/interfaces/habitRepository";
import { CreateHabitUseCase } from "../../domain/usecases/habit/createHabitUseCase";
import { ToggleHabitCompletionUseCase } from "../../domain/usecases/habit/toggleHabitCompletionUseCase";
import { calculateStreak } from "../../utils/habitUtils";

export class HabitService {
  private createHabitUseCase: CreateHabitUseCase;
  private toggleHabitCompletionUseCase: ToggleHabitCompletionUseCase;
  
  constructor(private habitRepository: HabitRepository) {
    this.createHabitUseCase = new CreateHabitUseCase(habitRepository);
    this.toggleHabitCompletionUseCase = new ToggleHabitCompletionUseCase(habitRepository);
  }
  
  async getAllHabits(userId?: string): Promise<Habit[]> {
    return this.habitRepository.getAll(userId);
  }
  
  async getHabitById(id: string): Promise<Habit | null> {
    return this.habitRepository.getById(id);
  }
  
  async createHabit(habit: Omit<Habit, "id" | "createdAt" | "currentStreak" | "longestStreak" | "trackingData">): Promise<Habit> {
    const newHabit: Omit<Habit, "id" | "createdAt"> = {
      ...habit,
      currentStreak: 0,
      longestStreak: 0,
      trackingData: []
    };
    
    return this.createHabitUseCase.execute(newHabit);
  }
  
  async toggleHabitCompletion(habitId: string, date?: string): Promise<Habit> {
    return this.toggleHabitCompletionUseCase.execute(habitId, date);
  }
  
  async updateHabit(habit: Habit): Promise<Habit> {
    return this.habitRepository.update(habit);
  }
  
  async deleteHabit(habitId: string): Promise<boolean> {
    return this.habitRepository.delete(habitId);
  }
  
  async getHabitTemplates(): Promise<Partial<Habit>[]> {
    return this.habitRepository.getHabitTemplates();
  }

  calculateStreakStats(habit: Habit): { currentStreak: number; longestStreak: number } {
    const currentStreak = calculateStreak(habit);
    const longestStreak = Math.max(currentStreak, habit.longestStreak);
    
    return { currentStreak, longestStreak };
  }
}
