
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Challenge } from "../../../domain/entities/challenge";
import { Progress } from "@/components/ui/progress";
import { format, differenceInDays, parseISO } from "date-fns";
import { Users, Trophy, Calendar } from "lucide-react";

interface ChallengeCardProps {
  challenge: Challenge;
  currentUserId: string;
  onJoin: () => Promise<boolean>;
  onLeave: () => Promise<boolean>;
  showCreator?: boolean;
}

export default function ChallengeCard({ 
  challenge, 
  currentUserId,
  onJoin,
  onLeave,
  showCreator = true 
}: ChallengeCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const isCreator = challenge.creatorId === currentUserId;
  const isParticipant = challenge.participants.some(p => p.userId === currentUserId);
  const startDate = parseISO(challenge.startDate);
  const endDate = parseISO(challenge.endDate);
  const daysLeft = Math.max(0, differenceInDays(endDate, new Date()));
  const totalDays = differenceInDays(endDate, startDate) + 1;
  const daysElapsed = totalDays - daysLeft;
  
  const userProgress = isParticipant ? 
    challenge.participants.find(p => p.userId === currentUserId)?.progress || 0 : 0;
  
  const participantCount = challenge.participants.length;
  
  const handleJoin = async () => {
    setIsLoading(true);
    try {
      await onJoin();
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLeave = async () => {
    setIsLoading(true);
    try {
      await onLeave();
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">{challenge.title}</h3>
            {showCreator && !isCreator && (
              <div className="text-sm text-muted-foreground">Created by User-{challenge.creatorId.substring(0, 6)}</div>
            )}
          </div>
          <Trophy className="h-5 w-5 text-yellow-500" />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{challenge.description}</p>
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            {format(startDate, "MMM d")} - {format(endDate, "MMM d, yyyy")}
          </div>
          <div className="flex items-center">
            <Users className="h-3.5 w-3.5 mr-1" />
            {participantCount} participant{participantCount !== 1 ? 's' : ''}
          </div>
        </div>
        
        {isParticipant && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Your progress</span>
              <span>{userProgress}%</span>
            </div>
            <Progress value={userProgress} className="h-2" />
          </div>
        )}
        
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Challenge progress</span>
            <span>{totalDays > 0 ? Math.round((daysElapsed / totalDays) * 100) : 0}%</span>
          </div>
          <Progress 
            value={totalDays > 0 ? Math.round((daysElapsed / totalDays) * 100) : 0} 
            className="h-2" 
          />
        </div>
      </CardContent>
      
      <CardFooter>
        {isParticipant ? (
          <Button 
            variant="outline" 
            onClick={handleLeave} 
            disabled={isLoading || isCreator} 
            className="w-full"
          >
            {isLoading ? "Processing..." : isCreator ? "You're the creator" : "Leave Challenge"}
          </Button>
        ) : (
          <Button 
            onClick={handleJoin} 
            disabled={isLoading} 
            className="w-full"
          >
            {isLoading ? "Joining..." : "Join Challenge"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
