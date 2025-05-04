
import { Habit } from "../../domain/entities/habit";
import { Goal, GoalCategory } from "../../domain/entities/goal";
import { User } from "../../domain/entities/user";
import { generateId } from "../../utils/habitUtils";

export class SuggestionService {
  // Map goal categories to habit templates
  private habitSuggestionMap: Record<GoalCategory, Partial<Habit>[]> = {
    health: [
      { name: "Drink 8 glasses of water", icon: "💧", frequency: "daily", description: "Stay hydrated throughout the day" },
      { name: "Take vitamins", icon: "💊", frequency: "daily", description: "Support your health with supplements" },
      { name: "Healthy meal prep", icon: "🥗", frequency: "weekly", description: "Prepare healthy meals ahead of time" }
    ],
    fitness: [
      { name: "30 minute workout", icon: "💪", frequency: "daily", description: "Consistent exercise for better fitness" },
      { name: "10,000 steps", icon: "🏃‍♂️", frequency: "daily", description: "Stay active throughout the day" },
      { name: "Stretch routine", icon: "🧘‍♂️", frequency: "daily", description: "Improve flexibility and prevent injuries" }
    ],
    productivity: [
      { name: "Deep work session", icon: "🎯", frequency: "daily", description: "Focused work without distractions" },
      { name: "Email zero inbox", icon: "📧", frequency: "daily", description: "Process all emails to keep inbox clean" },
      { name: "Weekly planning", icon: "📝", frequency: "weekly", description: "Plan your week in advance" }
    ],
    learning: [
      { name: "Read 20 pages", icon: "📚", frequency: "daily", description: "Build knowledge through consistent reading" },
      { name: "Learn a language", icon: "🗣️", frequency: "daily", description: "Practice for at least 15 minutes" },
      { name: "Take an online course", icon: "💻", frequency: "weekly", description: "Invest in your skills development" }
    ],
    mindfulness: [
      { name: "Morning meditation", icon: "🧘‍♂️", frequency: "daily", description: "Start your day with mindfulness" },
      { name: "Gratitude journal", icon: "✍️", frequency: "daily", description: "Write three things you're grateful for" },
      { name: "Digital detox hour", icon: "📵", frequency: "daily", description: "Take a break from screens" }
    ],
    social: [
      { name: "Call a friend", icon: "📞", frequency: "weekly", description: "Stay connected with loved ones" },
      { name: "Networking", icon: "🤝", frequency: "weekly", description: "Reach out to one professional contact" },
      { name: "Family dinner", icon: "👪", frequency: "weekly", description: "Quality time with family" }
    ],
    other: [
      { name: "Hobby time", icon: "🎨", frequency: "weekly", description: "Make time for activities you enjoy" },
      { name: "Declutter one area", icon: "🧹", frequency: "weekly", description: "Maintain a clean living space" },
      { name: "Personal finance check", icon: "💰", frequency: "weekly", description: "Review your budget and spending" }
    ]
  };

  getSuggestedHabitsForGoal(goal: Goal): Partial<Habit>[] {
    return this.habitSuggestionMap[goal.category] || [];
  }
  
  getSuggestedHabitsForUser(user: User, goals: Goal[]): Partial<Habit>[] {
    // Get habits based on user's goals
    const suggestions: Partial<Habit>[] = [];
    
    // Limit to 3 suggestions per goal category to avoid overwhelming the user
    const seenCategories = new Set<GoalCategory>();
    
    for (const goal of goals) {
      if (!seenCategories.has(goal.category)) {
        const categoryHabits = this.habitSuggestionMap[goal.category] || [];
        suggestions.push(...categoryHabits.slice(0, 2));
        seenCategories.add(goal.category);
      }
    }
    
    // If no specific goals, give some general habits
    if (suggestions.length === 0) {
      suggestions.push(
        { name: "Morning routine", icon: "🌅", frequency: "daily", description: "Start your day with intention" },
        { name: "Evening reflection", icon: "🌙", frequency: "daily", description: "Review your day before sleep" },
        { name: "Weekly planning", icon: "📝", frequency: "weekly", description: "Plan your week for better productivity" }
      );
    }
    
    return suggestions;
  }
  
  createHabitFromSuggestion(suggestion: Partial<Habit>, userId?: string): Habit {
    return {
      id: generateId(),
      name: suggestion.name || "New Habit",
      description: suggestion.description,
      icon: suggestion.icon,
      color: suggestion.color,
      frequency: suggestion.frequency || "daily",
      timeOfDay: suggestion.timeOfDay,
      reminderTime: suggestion.reminderTime,
      customDays: suggestion.customDays,
      currentStreak: 0,
      longestStreak: 0,
      createdAt: new Date().toISOString(),
      trackingData: [],
      userId
    };
  }
}
