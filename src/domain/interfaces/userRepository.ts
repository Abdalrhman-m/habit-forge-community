
import { User } from "../entities/user";

export interface UserRepository {
  getCurrentUser(): Promise<User | null>;
  getUserById(id: string): Promise<User | null>;
  updateUser(user: User): Promise<User>;
  updatePreferences(userId: string, preferences: Partial<User["preferences"]>): Promise<User>;
}
