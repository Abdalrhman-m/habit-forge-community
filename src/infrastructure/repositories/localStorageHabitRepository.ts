
import { Habit } from "../../domain/entities/habit";
import { HabitRepository } from "../../domain/interfaces/habitRepository";
import { generateId, getTodayString, toggleHabitCompletion } from "../../utils/habitUtils";

export class LocalStorageHabitRepository implements HabitRepository {
  private readonly STORAGE_KEY = 'habits';
  private readonly TEMPLATES_KEY = 'habit-templates';

  private getStorage(): Habit[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (error) {
        console.error("Error parsing habits from localStorage:", error);
        return [];
      }
    }
    return [];
  }

  private saveStorage(habits: Habit[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(habits));
  }

  async getAll(userId?: string): Promise<Habit[]> {
    const habits = this.getStorage();
    if (userId) {
      return habits.filter(habit => habit.userId === userId);
    }
    return habits;
  }

  async getById(id: string): Promise<Habit | null> {
    const habits = this.getStorage();
    const habit = habits.find(h => h.id === id);
    return habit || null;
  }

  async create(habit: Omit<Habit, "id" | "createdAt">): Promise<Habit> {
    const habits = this.getStorage();
    
    const newHabit: Habit = {
      ...habit,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    
    habits.push(newHabit);
    this.saveStorage(habits);
    
    return newHabit;
  }

  async update(habit: Habit): Promise<Habit> {
    const habits = this.getStorage();
    const index = habits.findIndex(h => h.id === habit.id);
    
    if (index >= 0) {
      habits[index] = habit;
      this.saveStorage(habits);
      return habit;
    }
    
    throw new Error(`Habit with id ${habit.id} not found`);
  }

  async delete(id: string): Promise<boolean> {
    const habits = this.getStorage();
    const filteredHabits = habits.filter(h => h.id !== id);
    
    if (filteredHabits.length !== habits.length) {
      this.saveStorage(filteredHabits);
      return true;
    }
    
    return false;
  }

  async toggleCompletion(id: string, date?: string): Promise<Habit> {
    const habits = this.getStorage();
    const habitIndex = habits.findIndex(h => h.id === id);
    
    if (habitIndex < 0) {
      throw new Error(`Habit with id ${id} not found`);
    }
    
    const updatedHabit = toggleHabitCompletion(habits[habitIndex], date);
    habits[habitIndex] = updatedHabit;
    this.saveStorage(habits);
    
    return updatedHabit;
  }

  async getHabitTemplates(): Promise<Partial<Habit>[]> {
    // Return some default templates
    return [
      { name: "Drink Water", description: "Stay hydrated throughout the day", icon: "💧" },
      { name: "Read", description: "Read for at least 20 minutes", icon: "📚" },
      { name: "Exercise", description: "Get your body moving", icon: "🏃‍♂️" },
      { name: "Meditate", description: "Practice mindfulness", icon: "🧘‍♂️" },
      { name: "Healthy Meal", description: "Focus on nutrition", icon: "🥗" },
      { name: "Journal", description: "Write down thoughts and reflections", icon: "✍️" },
      { name: "Learn a Language", description: "Practice for at least 15 minutes", icon: "🗣️" },
      { name: "Sleep Early", description: "Be in bed by 10 PM", icon: "💤" }
    ];
  }
}
