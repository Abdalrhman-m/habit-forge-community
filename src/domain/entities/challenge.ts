
/**
 * Challenge entity representing a community challenge
 */
import { Habit } from "./habit";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  category: ChallengeCategory;
  isPublic: boolean;
  participants: ChallengeParticipant[];
  habitTemplate?: Partial<Habit>;
  createdAt: string;
}

export interface ChallengeParticipant {
  userId: string;
  joinedAt: string;
  progress: number; // 0-100 percentage
  completedDays: string[]; // Array of ISO date strings
}

export type ChallengeCategory = 
  | 'health' 
  | 'productivity' 
  | 'learning' 
  | 'fitness' 
  | 'mindfulness' 
  | 'social' 
  | 'other';
