
import React from "react";
import { Trophy, Flame } from "lucide-react";
import { UserProfile } from "@/api/types";

interface ProfileStatsProps {
  profile: UserProfile;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ profile }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <h4 className="text-sm font-medium flex items-center gap-1">
          <Trophy className="h-4 w-4 text-amber-500" /> Achievements
        </h4>
        <ul className="list-none space-y-2 mt-2">
          <li className="flex items-center justify-between">
            <span>Weekly Contests</span>
            <span>{profile?.achievements.weeklyContests}</span>
          </li>
          <li className="flex items-center justify-between">
            <span>Monthly Contests</span>
            <span>{profile?.achievements.monthlyContests}</span>
          </li>
          <li className="flex items-center justify-between">
            <span>Special Events</span>
            <span>{profile?.achievements.specialEvents}</span>
          </li>
        </ul>
      </div>
      <div>
        <h4 className="text-sm font-medium flex items-center gap-1">
          <Flame className="h-4 w-4 text-red-500" /> Stats
        </h4>
        <ul className="list-none space-y-2 mt-2">
          <li className="flex items-center justify-between">
            <span>Easy</span>
            <span>{profile?.stats.easy.solved} / {profile?.stats.easy.total}</span>
          </li>
          <li className="flex items-center justify-between">
            <span>Medium</span>
            <span>{profile?.stats.medium.solved} / {profile?.stats.medium.total}</span>
          </li>
          <li className="flex items-center justify-between">
            <span>Hard</span>
            <span>{profile?.stats.hard.solved} / {profile?.stats.hard.total}</span>
          </li>
          <li className="flex items-center justify-between text-accent-color font-semibold">
            <span>Total</span>
            <span>
              {profile?.stats.easy.solved + profile?.stats.medium.solved + profile?.stats.hard.solved} / 
              {profile?.stats.easy.total + profile?.stats.medium.total + profile?.stats.hard.total}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileStats;
