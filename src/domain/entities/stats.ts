
/**
 * Stats entity representing user and habit statistics
 */
export interface HabitStats {
  totalHabits: number;
  activeStreak: number;
  completionRate: number;
  totalCompletions: number;
}

export interface UserStats extends HabitStats {
  challengesJoined: number;
  challengesCompleted: number;
  totalGoals: number;
  completedGoals: number;
}
