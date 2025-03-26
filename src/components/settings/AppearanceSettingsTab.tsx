
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAccentColor } from "@/contexts/AccentColorContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Laptop, Moon, Sun, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AppearanceSettingsTab = () => {
  const { theme, setTheme } = useTheme();
  const { accentColor, setAccentColor } = useAccentColor();
  const { toast } = useToast();
  const [selectedAccentColor, setSelectedAccentColor] = useState<string>(accentColor);

  const accentColors = [
    { value: "green", label: "Green", color: "bg-[hsl(var(--accent-green))]", textColor: "text-[hsl(var(--accent-green))]" },
    { value: "blue", label: "Blue", color: "bg-[hsl(var(--accent-blue))]", textColor: "text-[hsl(var(--accent-blue))]" },
    { value: "purple", label: "Purple", color: "bg-[hsl(var(--accent-purple))]", textColor: "text-[hsl(var(--accent-purple))]" },
    { value: "orange", label: "Orange", color: "bg-[hsl(var(--accent-orange))]", textColor: "text-[hsl(var(--accent-orange))]" },
    { value: "red", label: "Red", color: "bg-[hsl(var(--accent-red))]", textColor: "text-[hsl(var(--accent-red))]" },
    { value: "teal", label: "Teal", color: "bg-[hsl(var(--accent-teal))]", textColor: "text-[hsl(var(--accent-teal))]" },
  ];

  const handleAccentColorChange = (color: string) => {
    setSelectedAccentColor(color);
  };

  const saveAccentColor = () => {
    setAccentColor(selectedAccentColor as any);
    toast({
      title: "Accent color updated",
      description: "Your accent color preference has been saved.",
    });
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>
            Choose a theme for the application interface
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button
              variant="outline"
              size="lg"
              className={`flex flex-col items-center justify-center h-24 w-24 gap-2 ${
                theme === "light" ? "ring-2 ring-[hsl(var(--accent-" + accentColor + "))]" : ""
              }`}
              onClick={() => {
                setTheme("light");
                toast({
                  title: "Theme updated",
                  description: "Light theme has been applied.",
                });
              }}
            >
              <Sun className="h-8 w-8" />
              <span>Light</span>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className={`flex flex-col items-center justify-center h-24 w-24 gap-2 ${
                theme === "dark" ? "ring-2 ring-[hsl(var(--accent-" + accentColor + "))]" : ""
              }`}
              onClick={() => {
                setTheme("dark");
                toast({
                  title: "Theme updated",
                  description: "Dark theme has been applied.",
                });
              }}
            >
              <Moon className="h-8 w-8" />
              <span>Dark</span>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className={`flex flex-col items-center justify-center h-24 w-24 gap-2 ${
                theme === "system" ? "ring-2 ring-[hsl(var(--accent-" + accentColor + "))]" : ""
              }`}
              onClick={() => {
                setTheme("system");
                toast({
                  title: "Theme updated",
                  description: "System theme preference has been applied.",
                });
              }}
            >
              <Laptop className="h-8 w-8" />
              <span>System</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Accent Color</CardTitle>
          <CardDescription>
            Choose an accent color for buttons and highlighted elements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup
            value={selectedAccentColor}
            onValueChange={handleAccentColorChange}
            className="grid grid-cols-3 gap-4"
          >
            {accentColors.map((color) => (
              <div key={color.value} className="flex items-center space-x-2">
                <RadioGroupItem value={color.value} id={`color-${color.value}`} className="sr-only" />
                <Label
                  htmlFor={`color-${color.value}`}
                  className={cn(
                    "flex items-center space-x-2 rounded-md border px-3 py-3 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors",
                    selectedAccentColor === color.value ? 
                      `border-[hsl(var(--accent-${color.value}))] bg-[hsl(var(--accent-${color.value}))]/5` : 
                      ""
                  )}
                >
                  <div className={`w-5 h-5 rounded-full ${color.color} flex items-center justify-center`}>
                    {selectedAccentColor === color.value && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </div>
                  <span className={selectedAccentColor === color.value ? color.textColor : ""}>
                    {color.label}
                  </span>
                </Label>
              </div>
            ))}
          </RadioGroup>

          <div className="pt-2">
            <Button 
              onClick={saveAccentColor} 
              className="accent-color"
              disabled={selectedAccentColor === accentColor}
            >
              Save Accent Color
            </Button>
          </div>
          
          <div className="pt-4">
            <h3 className="text-sm font-medium mb-3">Preview</h3>
            <div className="space-y-3 p-4 border rounded-md">
              <div className="flex flex-wrap gap-3">
                <Button className="accent-color">Primary Button</Button>
                <Button variant="outline" className="border-[hsl(var(--accent-${selectedAccentColor}))] text-[hsl(var(--accent-${selectedAccentColor}))]">
                  Outline Button
                </Button>
                <Button variant="ghost" className="text-[hsl(var(--accent-${selectedAccentColor}))]">
                  Ghost Button
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${accentColors.find(c => c.value === selectedAccentColor)?.color}`}></span>
                <span className={`text-[hsl(var(--accent-${selectedAccentColor}))]`}>
                  This text shows your selected accent color
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppearanceSettingsTab;
