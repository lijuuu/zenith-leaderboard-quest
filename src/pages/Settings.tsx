
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  User, Lock, Bell, Moon, Sun, Smartphone,
  Save, X, Eye, EyeOff
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";
import { getCurrentUser, updateUserProfile, setUpTwoFactorAuth } from "@/api/userApi";
import { toast } from "sonner";
import MainNavbar from "@/components/MainNavbar";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { data: user, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });
  
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    bio: "",
    website: "",
    githubProfile: "",
    location: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  // Update form data when user data is loaded
  useState(() => {
    if (user) {
      setFormData({
        ...formData,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        bio: user.bio || "",
        website: user.website || "",
        githubProfile: user.githubProfile || "",
        location: user.location || "",
      });
    }
  });
  
  // 2FA setup query
  const setup2FAMutation = useMutation({
    mutationFn: setUpTwoFactorAuth,
    onSuccess: (data) => {
      toast.success("2FA setup initiated. Scan the QR code with your authenticator app.");
      // In a real app, you would display the QR code here
      console.log("2FA setup data:", data);
    },
    onError: () => {
      toast.error("Failed to set up 2FA. Please try again.");
    },
  });
  
  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: any) => updateUserProfile(data),
    onSuccess: () => {
      toast.success("Profile updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update profile. Please try again.");
    },
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    const { currentPassword, newPassword, confirmPassword, ...profileData } = formData;
    
    updateProfileMutation.mutate(profileData);
  };
  
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords don't match!");
      return;
    }
    
    // In a real app, this would call a separate API to change the password
    toast.success("Password changed successfully!");
    
    // Reset password fields
    setFormData(prev => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
  };
  
  const handle2FASetup = () => {
    setup2FAMutation.mutate();
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground pt-16">
        <MainNavbar />
        <main className="page-container py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-1/3 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
            <div className="h-12 w-full bg-zinc-200 dark:bg-zinc-800 rounded"></div>
            <div className="h-[600px] w-full bg-zinc-200 dark:bg-zinc-800 rounded"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pt-16">
      <MainNavbar />
      
      <main className="page-container py-8">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        
        <Tabs defaultValue="profile" className="w-full">
          <div className="border-b border-zinc-200 dark:border-zinc-800 mb-6">
            <TabsList className="bg-transparent justify-start h-auto p-0 mb-[-1px]">
              <TabsTrigger 
                value="profile" 
                className="py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:border-green-500 rounded-none bg-transparent"
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger 
                value="account" 
                className="py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:border-green-500 rounded-none bg-transparent"
              >
                <Lock className="h-4 w-4 mr-2" />
                Account
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:border-green-500 rounded-none bg-transparent"
              >
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger 
                value="appearance" 
                className="py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:border-green-500 rounded-none bg-transparent"
              >
                {theme === "dark" ? (
                  <Moon className="h-4 w-4 mr-2" />
                ) : (
                  <Sun className="h-4 w-4 mr-2" />
                )}
                Appearance
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle className="text-xl">Profile Information</CardTitle>
                  <CardDescription>
                    Update your profile information visible to other users
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="relative mb-6">
                    <Avatar className="w-32 h-32">
                      <AvatarImage src={user?.profileImage || "https://i.pravatar.cc/300?img=1"} />
                      <AvatarFallback>{user?.fullName.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <Button 
                      className="absolute bottom-0 right-0 rounded-full bg-zinc-100 dark:bg-zinc-800 text-foreground hover:bg-zinc-200 dark:hover:bg-zinc-700 h-8 w-8 p-0"
                      variant="ghost"
                    >
                      <PenSquare className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="font-semibold text-lg">{user?.fullName}</h3>
                    <p className="text-muted-foreground">@{user?.username}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Edit Profile</CardTitle>
                  <CardDescription>
                    Update your personal information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="John Doe"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          placeholder="johndoe"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john.doe@example.com"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        placeholder="Tell us about yourself"
                        rows={4}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          placeholder="https://yourwebsite.com"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="githubProfile">GitHub Profile</Label>
                        <Input
                          id="githubProfile"
                          name="githubProfile"
                          value={formData.githubProfile}
                          onChange={handleInputChange}
                          placeholder="username"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="City, Country"
                      />
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 gap-2">
                        <Save className="h-4 w-4" />
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="account">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Change Password</CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type={showPassword ? "text" : "password"}
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          placeholder="••••••••"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          placeholder="••••••••"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="••••••••"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full">Update Password</Button>
                  </form>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Two-Factor Authentication</CardTitle>
                  <CardDescription>
                    Add an extra layer of security to your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h4 className="font-medium">Two-Factor Authentication</h4>
                        <p className="text-sm text-muted-foreground">
                          {user?.is2FAEnabled 
                            ? "Two-factor authentication is enabled for your account."
                            : "Protect your account with an authenticator app."
                          }
                        </p>
                      </div>
                      <Switch 
                        checked={user?.is2FAEnabled} 
                        onCheckedChange={handle2FASetup}
                      />
                    </div>
                    
                    {user?.is2FAEnabled ? (
                      <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-md">
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <Smartphone className="h-4 w-4" />
                          Authenticator App
                        </h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          You're currently using an authenticator app for two-factor authentication.
                        </p>
                        <Button variant="outline" size="sm" className="w-full">
                          Disable Two-Factor Authentication
                        </Button>
                      </div>
                    ) : setup2FAMutation.isSuccess ? (
                      <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-md">
                        <h4 className="font-medium mb-2">Scan QR Code</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Scan this QR code with your authenticator app.
                        </p>
                        <div className="flex justify-center mb-3">
                          <div className="w-48 h-48 bg-white p-2 rounded-md">
                            {/* QR code would be displayed here */}
                            <div className="w-full h-full border-2 border-dashed border-zinc-300 rounded flex items-center justify-center">
                              QR Code Placeholder
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="verificationCode">Verification Code</Label>
                          <Input
                            id="verificationCode"
                            placeholder="Enter 6-digit code"
                          />
                        </div>
                        <Button className="w-full mt-3">Verify</Button>
                      </div>
                    ) : (
                      <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-md">
                        <p className="text-sm text-muted-foreground">
                          Toggle the switch above to enable two-factor authentication for your account.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-xl text-red-500">Danger Zone</CardTitle>
                  <CardDescription>
                    Irreversible account actions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-900 rounded-md">
                      <div>
                        <h4 className="font-medium">Delete Account</h4>
                        <p className="text-sm text-muted-foreground">
                          Permanently delete your account and all associated data.
                        </p>
                      </div>
                      <Button variant="destructive" size="sm" className="flex items-center gap-2">
                        <X className="h-4 w-4" />
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Notification Preferences</CardTitle>
                <CardDescription>
                  Manage when and how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">Email Notifications</h3>
                    <Separator className="mb-4" />
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-challenges">Challenge Invites</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive emails when someone invites you to a challenge
                          </p>
                        </div>
                        <Switch id="email-challenges" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-friends">Friend Requests</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive emails for new friend requests
                          </p>
                        </div>
                        <Switch id="email-friends" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-contests">Contests & Events</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive emails about upcoming contests and events
                          </p>
                        </div>
                        <Switch id="email-contests" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-marketing">Marketing</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive emails about new features and promotions
                          </p>
                        </div>
                        <Switch id="email-marketing" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">In-App Notifications</h3>
                    <Separator className="mb-4" />
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="app-messages">Messages</Label>
                          <p className="text-sm text-muted-foreground">
                            Show notifications for new messages
                          </p>
                        </div>
                        <Switch id="app-messages" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="app-challenges">Challenges</Label>
                          <p className="text-sm text-muted-foreground">
                            Show notifications for challenge invites and updates
                          </p>
                        </div>
                        <Switch id="app-challenges" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="app-friends">Friend Activities</Label>
                          <p className="text-sm text-muted-foreground">
                            Show notifications for friend activities
                          </p>
                        </div>
                        <Switch id="app-friends" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="app-system">System Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Show system notifications and announcements
                          </p>
                        </div>
                        <Switch id="app-system" defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Appearance</CardTitle>
                <CardDescription>
                  Customize how the application looks and feels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">Theme</h3>
                    <Separator className="mb-4" />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className={`border rounded-md p-4 cursor-pointer ${
                        theme === "light" 
                          ? "border-green-500 dark:border-green-500" 
                          : "border-zinc-200 dark:border-zinc-700"
                      }`}
                        onClick={() => setTheme("light")}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Sun className="h-5 w-5" />
                            <span className="font-medium">Light</span>
                          </div>
                          {theme === "light" && (
                            <div className="w-4 h-4 rounded-full bg-green-500"></div>
                          )}
                        </div>
                        <div className="h-20 bg-white border border-zinc-200 rounded-md"></div>
                      </div>
                      
                      <div className={`border rounded-md p-4 cursor-pointer ${
                        theme === "dark" 
                          ? "border-green-500 dark:border-green-500" 
                          : "border-zinc-200 dark:border-zinc-700"
                      }`}
                        onClick={() => setTheme("dark")}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Moon className="h-5 w-5" />
                            <span className="font-medium">Dark</span>
                          </div>
                          {theme === "dark" && (
                            <div className="w-4 h-4 rounded-full bg-green-500"></div>
                          )}
                        </div>
                        <div className="h-20 bg-zinc-900 border border-zinc-700 rounded-md"></div>
                      </div>
                      
                      <div className={`border rounded-md p-4 cursor-pointer ${
                        theme === "system" 
                          ? "border-green-500 dark:border-green-500" 
                          : "border-zinc-200 dark:border-zinc-700"
                      }`}
                        onClick={() => setTheme("system")}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              <Sun className="h-5 w-5" />
                              <Moon className="h-5 w-5 -ml-1" />
                            </div>
                            <span className="font-medium">System</span>
                          </div>
                          {theme === "system" && (
                            <div className="w-4 h-4 rounded-full bg-green-500"></div>
                          )}
                        </div>
                        <div className="h-20 bg-gradient-to-r from-white to-zinc-900 border border-zinc-200 rounded-md"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Editor Preferences</h3>
                    <Separator className="mb-4" />
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="font-size">Font Size</Label>
                          <p className="text-sm text-muted-foreground">
                            Adjust the font size in the code editor
                          </p>
                        </div>
                        <div className="w-32">
                          <Input
                            id="font-size"
                            type="number"
                            defaultValue="14"
                            min="10"
                            max="24"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="tab-size">Tab Size</Label>
                          <p className="text-sm text-muted-foreground">
                            Number of spaces for indentation
                          </p>
                        </div>
                        <div className="w-32">
                          <Input
                            id="tab-size"
                            type="number"
                            defaultValue="2"
                            min="2"
                            max="8"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="word-wrap">Word Wrap</Label>
                          <p className="text-sm text-muted-foreground">
                            Wrap long lines to fit in the editor
                          </p>
                        </div>
                        <Switch id="word-wrap" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="line-numbers">Line Numbers</Label>
                          <p className="text-sm text-muted-foreground">
                            Show line numbers in the editor
                          </p>
                        </div>
                        <Switch id="line-numbers" defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Settings;
