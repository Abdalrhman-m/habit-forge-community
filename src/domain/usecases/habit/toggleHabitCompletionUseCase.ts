
import { Habit } from "../../entities/habit";
import { HabitRepository } from "../../interfaces/habitRepository";

export class ToggleHabitCompletionUseCase {
  constructor(private habitRepository: HabitRepository) {}
  
  async execute(habitId: string, date?: string): Promise<Habit> {
    return this.habitRepository.toggleCompletion(habitId, date);
  }
}
