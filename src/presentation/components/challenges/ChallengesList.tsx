
import { Challenge } from "../../../domain/entities/challenge";
import ChallengeCard from "./ChallengeCard";

interface ChallengesListProps {
  challenges: Challenge[];
  currentUserId: string;
  onJoinChallenge: (challengeId: string) => Promise<boolean>;
  onLeaveChallenge: (challengeId: string) => Promise<boolean>;
  showCreator?: boolean;
}

export default function ChallengesList({ 
  challenges, 
  currentUserId,
  onJoinChallenge,
  onLeaveChallenge,
  showCreator = true 
}: ChallengesListProps) {
  if (challenges.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/50 rounded-lg">
        <h3 className="text-lg font-medium mb-2">No challenges available</h3>
        <p className="text-muted-foreground">
          Check back later or create your own challenge!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {challenges.map((challenge) => (
        <ChallengeCard
          key={challenge.id}
          challenge={challenge}
          currentUserId={currentUserId}
          onJoin={() => onJoinChallenge(challenge.id)}
          onLeave={() => onLeaveChallenge(challenge.id)}
          showCreator={showCreator}
        />
      ))}
    </div>
  );
}
