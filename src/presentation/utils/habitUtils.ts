
import { Habit } from "../../domain/entities/Habit";

export function getLastNDays(habit: Habit, days: number): { date: string; completed: boolean; isToday: boolean }[] {
  const result = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const trackingData = habit.trackingData.find(d => d.date === dateStr);
    const isToday = dateStr === getTodayString();
    
    result.push({
      date: dateStr,
      completed: trackingData?.completed || false,
      isToday
    });
  }
  
  return result;
}

export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}
