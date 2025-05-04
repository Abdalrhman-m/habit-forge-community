
import { Challenge, ChallengeParticipant } from "../entities/challenge";

export interface ChallengeRepository {
  getAll(): Promise<Challenge[]>;
  getPublic(): Promise<Challenge[]>;
  getByUserId(userId: string): Promise<Challenge[]>;
  getById(id: string): Promise<Challenge | null>;
  create(challenge: Omit<Challenge, "id" | "createdAt">): Promise<Challenge>;
  update(challenge: Challenge): Promise<Challenge>;
  delete(id: string): Promise<boolean>;
  joinChallenge(challengeId: string, userId: string): Promise<ChallengeParticipant>;
  leaveChallenge(challengeId: string, userId: string): Promise<boolean>;
  updateProgress(challengeId: string, userId: string, date: string, completed: boolean): Promise<ChallengeParticipant>;
}
