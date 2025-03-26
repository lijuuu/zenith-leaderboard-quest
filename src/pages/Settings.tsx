
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/api/userApi";
import Navbar from "@/components/Navbar";
import SettingsTabs from "@/components/settings/SettingsTabs";
import LoadingFallback from "@/components/settings/LoadingFallback";

const Settings = () => {
  const { data: user, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground pt-16">
        <Navbar />
        <main className="page-container py-8">
          <LoadingFallback />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pt-16">
      <Navbar />
      
      <main className="page-container py-8">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        <SettingsTabs user={user!} />
      </main>
    </div>
  );
};

export default Settings;
