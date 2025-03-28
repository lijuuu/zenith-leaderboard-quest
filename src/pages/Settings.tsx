
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/api/userApi";
import SettingsTabs from "@/components/settings/SettingsTabs";
import LoadingFallback from "@/components/settings/LoadingFallback";
import MainNavbar from "@/components/MainNavbar";

const Settings = () => {
  const { data: user, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });

  useEffect(() => {
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen  text-white ">
      <MainNavbar />
      
      <main className="page-container py-8 pt-20">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        
        <div className="bg-zinc-800/40 border border-zinc-700/40 rounded-lg p-6">
          {isLoading ? <LoadingFallback /> : <SettingsTabs user={user!} />}
        </div>
      </main>
    </div>
  );
};

export default Settings;
