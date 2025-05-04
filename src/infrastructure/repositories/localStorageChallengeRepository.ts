
import { Challenge, ChallengeParticipant } from "../../domain/entities/challenge";
import { ChallengeRepository } from "../../domain/interfaces/challengeRepository";
import { generateId } from "../../utils/habitUtils";

export class LocalStorageChallengeRepository implements ChallengeRepository {
  private readonly STORAGE_KEY = 'challenges';

  private getStorage(): Challenge[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (error) {
        console.error("Error parsing challenges from localStorage:", error);
        return [];
      }
    }
    return [];
  }

  private saveStorage(challenges: Challenge[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(challenges));
  }

  async getAll(): Promise<Challenge[]> {
    return this.getStorage();
  }

  async getPublic(): Promise<Challenge[]> {
    const challenges = this.getStorage();
    return challenges.filter(challenge => challenge.isPublic);
  }

  async getByUserId(userId: string): Promise<Challenge[]> {
    const challenges = this.getStorage();
    return challenges.filter(challenge => 
      challenge.creatorId === userId || 
      challenge.participants.some(p => p.userId === userId)
    );
  }

  async getById(id: string): Promise<Challenge | null> {
    const challenges = this.getStorage();
    const challenge = challenges.find(c => c.id === id);
    return challenge || null;
  }

  async create(challenge: Omit<Challenge, "id" | "createdAt">): Promise<Challenge> {
    const challenges = this.getStorage();
    
    const newChallenge: Challenge = {
      ...challenge,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    
    challenges.push(newChallenge);
    this.saveStorage(challenges);
    
    return newChallenge;
  }

  async update(challenge: Challenge): Promise<Challenge> {
    const challenges = this.getStorage();
    const index = challenges.findIndex(c => c.id === challenge.id);
    
    if (index >= 0) {
      challenges[index] = challenge;
      this.saveStorage(challenges);
      return challenge;
    }
    
    throw new Error(`Challenge with id ${challenge.id} not found`);
  }

  async delete(id: string): Promise<boolean> {
    const challenges = this.getStorage();
    const filteredChallenges = challenges.filter(c => c.id !== id);
    
    if (filteredChallenges.length !== challenges.length) {
      this.saveStorage(filteredChallenges);
      return true;
    }
    
    return false;
  }

  async joinChallenge(challengeId: string, userId: string): Promise<ChallengeParticipant> {
    const challenges = this.getStorage();
    const challengeIndex = challenges.findIndex(c => c.id === challengeId);
    
    if (challengeIndex < 0) {
      throw new Error(`Challenge with id ${challengeId} not found`);
    }
    
    const challenge = challenges[challengeIndex];
    
    // Check if user is already a participant
    if (challenge.participants.some(p => p.userId === userId)) {
      const existingParticipant = challenge.participants.find(p => p.userId === userId)!;
      return existingParticipant;
    }
    
    // Add new participant
    const newParticipant: ChallengeParticipant = {
      userId,
      joinedAt: new Date().toISOString(),
      progress: 0,
      completedDays: []
    };
    
    challenge.participants.push(newParticipant);
    this.saveStorage(challenges);
    
    return newParticipant;
  }

  async leaveChallenge(challengeId: string, userId: string): Promise<boolean> {
    const challenges = this.getStorage();
    const challengeIndex = challenges.findIndex(c => c.id === challengeId);
    
    if (challengeIndex < 0) {
      return false;
    }
    
    const challenge = challenges[challengeIndex];
    
    // Filter out the user from participants
    const originalLength = challenge.participants.length;
    challenge.participants = challenge.participants.filter(p => p.userId !== userId);
    
    if (challenge.participants.length !== originalLength) {
      this.saveStorage(challenges);
      return true;
    }
    
    return false;
  }

  async updateProgress(challengeId: string, userId: string, date: string, completed: boolean): Promise<ChallengeParticipant> {
    const challenges = this.getStorage();
    const challengeIndex = challenges.findIndex(c => c.id === challengeId);
    
    if (challengeIndex < 0) {
      throw new Error(`Challenge with id ${challengeId} not found`);
    }
    
    const challenge = challenges[challengeIndex];
    const participantIndex = challenge.participants.findIndex(p => p.userId === userId);
    
    if (participantIndex < 0) {
      throw new Error(`User ${userId} is not a participant in challenge ${challengeId}`);
    }
    
    const participant = challenge.participants[participantIndex];
    
    if (completed) {
      // Add the date if not already in the completed days
      if (!participant.completedDays.includes(date)) {
        participant.completedDays.push(date);
      }
    } else {
      // Remove the date if it exists
      participant.completedDays = participant.completedDays.filter(d => d !== date);
    }
    
    // Calculate progress based on date range
    const startDate = new Date(challenge.startDate);
    const endDate = new Date(challenge.endDate);
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    participant.progress = Math.min(100, Math.round((participant.completedDays.length / totalDays) * 100));
    
    challenge.participants[participantIndex] = participant;
    this.saveStorage(challenges);
    
    return participant;
  }
}
