
import React from "react";
import { Trophy, Users, Lock } from "lucide-react";
import { Challenge } from "@/api/types";
import { Badge } from "@/components/ui/badge";

interface ChallengesListProps {
  challenges: Challenge[];
}

const ChallengesList: React.FC<ChallengesListProps> = ({ challenges }) => {
  // Group challenges by type (public/private)
  const publicChallenges = challenges.filter(c => !c.isPrivate);
  const privateChallenges = challenges.filter(c => c.isPrivate);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium">Challenge Summary</h4>
        <div className="flex space-x-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Users className="h-3 w-3" /> 
            <span>Public: {publicChallenges.length}</span>
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Lock className="h-3 w-3" /> 
            <span>Private: {privateChallenges.length}</span>
          </Badge>
        </div>
      </div>
      
      {challenges.length === 0 ? (
        <p className="text-sm text-muted-foreground">No challenges available</p>
      ) : (
        <div className="space-y-3">
          {challenges.map((challenge) => (
            <div key={challenge.id} className="flex items-center justify-between group hover:bg-accent/5 p-2 rounded-md transition-colors">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-500" />
                <div>
                  <span className="text-sm font-medium group-hover:text-accent-color transition-colors">{challenge.title}</span>
                  {challenge.isPrivate && (
                    <Badge variant="secondary" className="ml-2 text-xs py-0">Private</Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500">
                  <Users className="h-3 w-3 inline mr-1" />
                  {challenge.participants} participants
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChallengesList;
