
import React, { useState } from "react";
import { UserProfile } from "@/api/types";
import { useToast } from "@/hooks/use-toast";
import { 
  Edit, 
  Copy, 
  CheckCircle, 
  ShieldAlert,
  UserPlus,
  UserMinus,
  Loader2,
  Github,
  Link as LinkIcon,
  MapPin
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface ProfileHeaderProps {
  profile: UserProfile;
  username?: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile, username }) => {
  const { toast } = useToast();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    setLoading(true);
    
    // Simulate follow/unfollow action
    setTimeout(() => {
      setIsFollowing(!isFollowing);
      setLoading(false);
      
      toast({
        title: isFollowing ? "Unfollowed" : "Followed",
        description: isFollowing 
          ? `You have unfollowed @${username}`
          : `You are now following @${username}`,
      });
    }, 500);
  };
  
  const copyProfileLink = () => {
    const profileLink = window.location.href;
    navigator.clipboard.writeText(profileLink);
    toast({
      title: "Copied!",
      description: "Profile link copied to clipboard",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Avatar className="h-24 w-24 border-2 border-accent-color/20">
          <AvatarImage src={profile?.profileImage || `https://avatar.vercel.sh/${username}.png`} alt={profile?.fullName} />
          <AvatarFallback>{profile?.fullName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <div>
            <h3 className="text-lg font-semibold">{profile?.username}</h3>
            <div className="flex items-center space-x-2">
              {profile?.isVerified && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Verified Account</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {profile?.isBanned && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <ShieldAlert className="h-4 w-4 text-red-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Banned Account</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{profile?.bio || "No bio available"}</p>
          
          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
            {profile?.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{profile.location}</span>
              </div>
            )}
            
            {profile?.website && (
              <div className="flex items-center gap-1">
                <LinkIcon className="h-3 w-3" />
                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="hover:text-accent-color transition-colors">
                  {new URL(profile.website).hostname}
                </a>
              </div>
            )}
            
            {profile?.githubProfile && (
              <div className="flex items-center gap-1">
                <Github className="h-3 w-3" />
                <a href={`https://github.com/${profile.githubProfile}`} target="_blank" rel="noopener noreferrer" className="hover:text-accent-color transition-colors">
                  {profile.githubProfile}
                </a>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={copyProfileLink}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy profile link</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleFollow} 
              disabled={loading}
              className={isFollowing ? "bg-accent/10" : ""}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isFollowing ? (
                <>
                  <UserMinus className="mr-2 h-4 w-4" /> Unfollow
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" /> Follow
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="bg-accent/5 rounded-lg p-4 text-center">
          <h4 className="text-sm font-medium">Problems Solved</h4>
          <p className="text-2xl font-bold">{profile?.problemsSolved}</p>
        </div>
        <div className="bg-accent/5 rounded-lg p-4 text-center">
          <h4 className="text-sm font-medium">Current Streak</h4>
          <p className="text-2xl font-bold">{profile?.dayStreak} days</p>
        </div>
        <div className="bg-accent/5 rounded-lg p-4 text-center">
          <h4 className="text-sm font-medium">Ranking</h4>
          <p className="text-2xl font-bold">#{profile?.ranking}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
