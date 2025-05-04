
import { Habit } from "../../entities/habit";
import { HabitRepository } from "../../interfaces/habitRepository";

export class CreateHabitUseCase {
  constructor(private habitRepository: HabitRepository) {}
  
  async execute(habit: Omit<Habit, "id" | "createdAt">): Promise<Habit> {
    return this.habitRepository.create(habit);
  }
}
