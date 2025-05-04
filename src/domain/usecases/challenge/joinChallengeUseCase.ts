
import { ChallengeParticipant } from "../../entities/challenge";
import { ChallengeRepository } from "../../interfaces/challengeRepository";

export class JoinChallengeUseCase {
  constructor(private challengeRepository: ChallengeRepository) {}
  
  async execute(challengeId: string, userId: string): Promise<ChallengeParticipant> {
    return this.challengeRepository.joinChallenge(challengeId, userId);
  }
}
