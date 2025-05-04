
import { Goal } from "../entities/goal";

export interface GoalRepository {
  getAll(userId: string): Promise<Goal[]>;
  getById(id: string): Promise<Goal | null>;
  create(goal: Omit<Goal, "id" | "createdAt">): Promise<Goal>;
  update(goal: Goal): Promise<Goal>;
  delete(id: string): Promise<boolean>;
  completeGoal(id: string): Promise<Goal>;
}
