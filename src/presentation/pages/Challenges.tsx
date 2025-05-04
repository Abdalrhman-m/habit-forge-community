
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { useChallenges } from "../hooks/useChallenges";
import ChallengesList from "../components/challenges/ChallengesList";
import CreateChallengeDialog from "../components/challenges/CreateChallengeDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2, Trophy, Users } from "lucide-react";

export default function Challenges() {
  const [activeTab, setActiveTab] = useState<"discover" | "my-challenges">("discover");
  // In a real app, you'd get the current user ID from auth
  const userId = "current-user"; 
  
  const { 
    publicChallenges, 
    userChallenges, 
    isLoading, 
    joinChallenge,
    leaveChallenge,
    createChallenge,
    refreshChallenges
  } = useChallenges(userId);
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <Trophy className="mr-2 h-6 w-6 text-yellow-500" />
                Challenges
              </h1>
              <p className="text-muted-foreground">Join challenges to build habits with others</p>
            </div>
            <CreateChallengeDialog 
              onCreateChallenge={(challenge) => createChallenge({
                ...challenge,
                creatorId: userId,
                participants: [{ 
                  userId, 
                  joinedAt: new Date().toISOString(),
                  progress: 0,
                  completedDays: []
                }]
              })}
            />
          </div>
          
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="discover" className="flex items-center">
                <Trophy className="mr-2 h-4 w-4" /> Discover
              </TabsTrigger>
              <TabsTrigger value="my-challenges" className="flex items-center">
                <Users className="mr-2 h-4 w-4" /> My Challenges
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="discover" className="mt-6">
              {isLoading ? (
                <div className="text-center py-12">
                  <Loader2 className="animate-spin h-8 w-8 mx-auto text-primary mb-4" />
                  <p>Loading challenges...</p>
                </div>
              ) : (
                <ChallengesList 
                  challenges={publicChallenges} 
                  currentUserId={userId}
                  onJoinChallenge={(challengeId) => joinChallenge(challengeId, userId)}
                  onLeaveChallenge={(challengeId) => leaveChallenge(challengeId, userId)}
                />
              )}
            </TabsContent>
            
            <TabsContent value="my-challenges" className="mt-6">
              {isLoading ? (
                <div className="text-center py-12">
                  <Loader2 className="animate-spin h-8 w-8 mx-auto text-primary mb-4" />
                  <p>Loading your challenges...</p>
                </div>
              ) : userChallenges.length === 0 ? (
                <div className="text-center py-12 bg-muted/50 rounded-lg">
                  <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No challenges joined yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Join a challenge or create your own to get started!
                  </p>
                  <Button onClick={() => setActiveTab("discover")}>
                    Discover Challenges
                  </Button>
                </div>
              ) : (
                <ChallengesList 
                  challenges={userChallenges} 
                  currentUserId={userId}
                  onJoinChallenge={(challengeId) => joinChallenge(challengeId, userId)}
                  onLeaveChallenge={(challengeId) => leaveChallenge(challengeId, userId)}
                  showCreator={false}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
