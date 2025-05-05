
import { HabitUseCases } from "../../application/usecases/HabitUseCases";
import { HabitRepository } from "../../domain/repositories/HabitRepository";
import { LocalStorageHabitRepository } from "../repositories/LocalStorageHabitRepository";

// Simple dependency injection container
class Container {
  private static habitRepository: HabitRepository;
  private static habitUseCases: HabitUseCases;
  
  static getHabitRepository(): HabitRepository {
    if (!this.habitRepository) {
      this.habitRepository = new LocalStorageHabitRepository();
    }
    return this.habitRepository;
  }
  
  static getHabitUseCases(): HabitUseCases {
    if (!this.habitUseCases) {
      this.habitUseCases = new HabitUseCases(this.getHabitRepository());
    }
    return this.habitUseCases;
  }
}

export default Container;
