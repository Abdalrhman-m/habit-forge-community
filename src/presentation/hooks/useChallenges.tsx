
import { useState, useEffect, useCallback } from 'react';
import { Challenge } from '../../domain/entities/challenge';
import { ChallengeService } from '../../application/services/challengeService';
import { LocalStorageChallengeRepository } from '../../infrastructure/repositories/localStorageChallengeRepository';
import { useToast } from "@/components/ui/use-toast";

export const useChallenges = (userId?: string) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [publicChallenges, setPublicChallenges] = useState<Challenge[]>([]);
  const [userChallenges, setUserChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  
  // Initialize repositories and services
  const challengeRepository = new LocalStorageChallengeRepository();
  const challengeService = new ChallengeService(challengeRepository);
  
  const loadChallenges = useCallback(async () => {
    setIsLoading(true);
    try {
      const [allChallenges, publicChallenges] = await Promise.all([
        challengeService.getAllChallenges(),
        challengeService.getPublicChallenges()
      ]);
      
      setChallenges(allChallenges);
      setPublicChallenges(publicChallenges);
      
      if (userId) {
        const userChallenges = await challengeService.getUserChallenges(userId);
        setUserChallenges(userChallenges);
      }
    } catch (error) {
      console.error("Error loading challenges:", error);
      toast({
        title: "Error",
        description: "Failed to load challenges. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [challengeService, userId, toast]);
  
  useEffect(() => {
    loadChallenges();
  }, [loadChallenges]);
  
  const createChallenge = async (challenge: Omit<Challenge, "id" | "createdAt">) => {
    try {
      const newChallenge = await challengeService.createChallenge(challenge);
      setChallenges(prev => [...prev, newChallenge]);
      
      if (newChallenge.isPublic) {
        setPublicChallenges(prev => [...prev, newChallenge]);
      }
      
      if (userId && (newChallenge.creatorId === userId || newChallenge.participants.some(p => p.userId === userId))) {
        setUserChallenges(prev => [...prev, newChallenge]);
      }
      
      toast({
        title: "Success",
        description: `Challenge "${newChallenge.title}" created successfully!`,
      });
      
      return newChallenge;
    } catch (error) {
      console.error("Error creating challenge:", error);
      toast({
        title: "Error",
        description: "Failed to create challenge. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const joinChallenge = async (challengeId: string, currentUserId: string) => {
    try {
      const success = await challengeService.joinChallenge(challengeId, currentUserId);
      
      if (success) {
        // Refresh challenges to get updated data
        await loadChallenges();
        
        toast({
          title: "Success",
          description: "You've joined the challenge!",
        });
      }
      
      return success;
    } catch (error) {
      console.error("Error joining challenge:", error);
      toast({
        title: "Error",
        description: "Failed to join challenge. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const leaveChallenge = async (challengeId: string, currentUserId: string) => {
    try {
      const success = await challengeService.leaveChallenge(challengeId, currentUserId);
      
      if (success) {
        // Refresh challenges to get updated data
        await loadChallenges();
        
        toast({
          title: "Success",
          description: "You've left the challenge.",
        });
      }
      
      return success;
    } catch (error) {
      console.error("Error leaving challenge:", error);
      toast({
        title: "Error",
        description: "Failed to leave challenge. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  return {
    challenges,
    publicChallenges,
    userChallenges,
    isLoading,
    createChallenge,
    joinChallenge,
    leaveChallenge,
    refreshChallenges: loadChallenges
  };
};
