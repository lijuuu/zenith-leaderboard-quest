
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAccentColor } from "@/contexts/AccentColorContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Laptop, Moon, Sun } from "lucide-react";

const AppearanceSettingsTab = () => {
  const { theme, setTheme } = useTheme();
  const { accentColor, setAccentColor } = useAccentColor();
  const { toast } = useToast();
  const [selectedAccentColor, setSelectedAccentColor] = useState<string>(accentColor);

  const accentColors = [
    { value: "green", label: "Green", color: "bg-[hsl(var(--accent-green))]" },
    { value: "blue", label: "Blue", color: "bg-[hsl(var(--accent-blue))]" },
    { value: "purple", label: "Purple", color: "bg-[hsl(var(--accent-purple))]" },
    { value: "orange", label: "Orange", color: "bg-[hsl(var(--accent-orange))]" },
    { value: "red", label: "Red", color: "bg-[hsl(var(--accent-red))]" },
    { value: "teal", label: "Teal", color: "bg-[hsl(var(--accent-teal))]" },
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
      <div>
        <h3 className="text-lg font-medium mb-4">Theme</h3>
        <div className="flex flex-wrap gap-4">
          <Button
            variant="outline"
            size="lg"
            className={`flex flex-col items-center justify-center h-24 w-24 gap-2 ${
              theme === "light" ? "ring-2 ring-primary" : ""
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
              theme === "dark" ? "ring-2 ring-primary" : ""
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
              theme === "system" ? "ring-2 ring-primary" : ""
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
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium mb-4">Accent Color</h3>
        
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
                className={`flex items-center space-x-2 rounded-md border px-3 py-3 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
                  selectedAccentColor === color.value ? "ring-2 ring-primary" : ""
                }`}
              >
                <div className={`w-5 h-5 rounded-full ${color.color}`}></div>
                <span>{color.label}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>

        <Button 
          onClick={saveAccentColor} 
          className="accent-color"
          disabled={selectedAccentColor === accentColor}
        >
          Save Accent Color
        </Button>
      </div>
    </div>
  );
};

export default AppearanceSettingsTab;
