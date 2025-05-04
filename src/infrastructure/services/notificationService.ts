
import { Habit } from "../../domain/entities/habit";

export class NotificationService {
  private readonly PERMISSION_ASKED_KEY = 'notification-permission-asked';
  
  constructor() {
    // Initialize notifications if supported
    this.init();
  }
  
  private init() {
    // Check if browser supports notifications
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications");
      return;
    }
    
    // Check if we already asked for permission
    const permissionAsked = localStorage.getItem(this.PERMISSION_ASKED_KEY);
    if (!permissionAsked && Notification.permission !== "denied") {
      this.requestPermission();
    }
  }
  
  private async requestPermission(): Promise<boolean> {
    try {
      const permission = await Notification.requestPermission();
      localStorage.setItem(this.PERMISSION_ASKED_KEY, 'true');
      return permission === "granted";
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return false;
    }
  }
  
  async sendHabitReminder(habit: Habit): Promise<boolean> {
    if (Notification.permission !== "granted") {
      const granted = await this.requestPermission();
      if (!granted) return false;
    }
    
    try {
      new Notification("Habit Reminder", {
        body: `Time to complete your habit: ${habit.name}`,
        icon: "/favicon.ico"
      });
      return true;
    } catch (error) {
      console.error("Error sending notification:", error);
      return false;
    }
  }
  
  async sendStreakReminder(habit: Habit): Promise<boolean> {
    if (Notification.permission !== "granted") {
      const granted = await this.requestPermission();
      if (!granted) return false;
    }
    
    try {
      new Notification("Don't Break Your Streak!", {
        body: `You're on a ${habit.currentStreak} day streak for ${habit.name}. Don't forget to complete it today!`,
        icon: "/favicon.ico"
      });
      return true;
    } catch (error) {
      console.error("Error sending notification:", error);
      return false;
    }
  }
}
