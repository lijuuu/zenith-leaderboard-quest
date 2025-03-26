
import React from 'react';
import { Sword, Trophy, Users, Clock, ArrowRight, Shield, FileCode } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ChallengeBattleInviteProps {
  challenge: {
    id: string;
    title: string;
    isPrivate: boolean;
    accessCode?: string;
    expiresIn?: string;
    participants?: number;
    difficulty?: 'easy' | 'medium' | 'hard';
  };
  onAccept: () => void;
  onDecline?: () => void;
}

const ChallengeBattleInvite: React.FC<ChallengeBattleInviteProps> = ({ 
  challenge, 
  onAccept,
  onDecline
}) => {
  return (
    <Card className="w-full max-w-md my-2 overflow-hidden border-accent-color/30 dark:bg-zinc-900/70">
      <div className="h-2 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500" />
      <CardContent className="p-4">
        <div className="flex items-center mb-2">
          {challenge.isPrivate ? (
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-500/10 mr-3">
              <Sword className="h-5 w-5 text-orange-500" />
            </div>
          ) : (
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/10 mr-3">
              <Trophy className="h-5 w-5 text-blue-500" />
            </div>
          )}
          
          <div>
            <div className="flex items-center">
              <h3 className="font-semibold">{challenge.title}</h3>
              {challenge.isPrivate && (
                <Badge variant="outline" className="ml-2 text-xs">Private Battle</Badge>
              )}
            </div>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <div className="flex items-center mr-3">
                <Users className="h-3 w-3 mr-1" />
                <span>{challenge.participants || 2}</span>
              </div>
              {challenge.difficulty && (
                <div className="flex items-center mr-3">
                  <Shield className="h-3 w-3 mr-1" />
                  <span className="capitalize">{challenge.difficulty}</span>
                </div>
              )}
              {challenge.expiresIn && (
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{challenge.expiresIn}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {challenge.isPrivate && challenge.accessCode && (
          <div className="mb-3 p-2 bg-background/50 rounded-md border text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Access Code:</span>
              <code className="font-mono bg-background/80 px-2 py-0.5 rounded">{challenge.accessCode}</code>
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center space-x-2">
            <FileCode className="h-4 w-4 text-green-500" />
            <span className="text-sm">Coding battle invitation</span>
          </div>
          
          <div className="flex space-x-2">
            {onDecline && (
              <Button variant="outline" size="sm" onClick={onDecline}>
                Decline
              </Button>
            )}
            <Button onClick={onAccept} className="accent-color" size="sm">
              Accept Challenge <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChallengeBattleInvite;
