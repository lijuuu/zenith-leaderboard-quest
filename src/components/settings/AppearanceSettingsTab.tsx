
import React from "react";
import { Moon, Sun } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/contexts/ThemeContext";

const AppearanceSettingsTab: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
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
  );
};

export default AppearanceSettingsTab;
