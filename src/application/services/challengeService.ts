
import { Challenge } from "../../domain/entities/challenge";
import { ChallengeRepository } from "../../domain/interfaces/challengeRepository";
import { JoinChallengeUseCase } from "../../domain/usecases/challenge/joinChallengeUseCase";

export class ChallengeService {
  private joinChallengeUseCase: JoinChallengeUseCase;
  
  constructor(private challengeRepository: ChallengeRepository) {
    this.joinChallengeUseCase = new JoinChallengeUseCase(challengeRepository);
  }
  
  async getAllChallenges(): Promise<Challenge[]> {
    return this.challengeRepository.getAll();
  }
  
  async getPublicChallenges(): Promise<Challenge[]> {
    return this.challengeRepository.getPublic();
  }
  
  async getUserChallenges(userId: string): Promise<Challenge[]> {
    return this.challengeRepository.getByUserId(userId);
  }
  
  async getChallengeById(id: string): Promise<Challenge | null> {
    return this.challengeRepository.getById(id);
  }
  
  async createChallenge(challenge: Omit<Challenge, "id" | "createdAt">): Promise<Challenge> {
    return this.challengeRepository.create(challenge);
  }
  
  async joinChallenge(challengeId: string, userId: string): Promise<boolean> {
    await this.joinChallengeUseCase.execute(challengeId, userId);
    return true;
  }
  
  async leaveChallenge(challengeId: string, userId: string): Promise<boolean> {
    return this.challengeRepository.leaveChallenge(challengeId, userId);
  }
  
  async updateChallengeProgress(challengeId: string, userId: string, date: string, completed: boolean): Promise<boolean> {
    await this.challengeRepository.updateProgress(challengeId, userId, date, completed);
    return true;
  }
}
