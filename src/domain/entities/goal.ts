
/**
 * Goal entity representing a user's personal goal
 */
export interface Goal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: GoalCategory;
  targetDate?: string; // ISO date string
  completed: boolean;
  createdAt: string;
}

export type GoalCategory = 
  | 'health' 
  | 'productivity' 
  | 'learning' 
  | 'fitness' 
  | 'mindfulness' 
  | 'social' 
  | 'other';
