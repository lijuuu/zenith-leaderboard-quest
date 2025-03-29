
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Laptop, Moon, Sun, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AppearanceSettingsTab = () => {
  const { toast } = useToast();
  const [selectedAccentColor, setSelectedAccentColor] = useState<string>("green");

  const accentColors = [
    { value: "green", label: "Green", color: "bg-green-500", textColor: "text-green-500" },
    { value: "blue", label: "Blue", color: "bg-blue-500", textColor: "text-blue-500" },
    { value: "purple", label: "Purple", color: "bg-purple-500", textColor: "text-purple-500" },
    { value: "orange", label: "Orange", color: "bg-orange-500", textColor: "text-orange-500" },
    { value: "red", label: "Red", color: "bg-red-500", textColor: "text-red-500" },
    { value: "teal", label: "Teal", color: "bg-teal-500", textColor: "text-teal-500" },
  ];

  const handleAccentColorChange = (color: string) => {
    setSelectedAccentColor(color);
  };

  const saveAccentColor = () => {
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
              className="flex flex-col items-center justify-center h-24 w-24 gap-2 ring-2 ring-green-500"
              onClick={() => {
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
              className="flex flex-col items-center justify-center h-24 w-24 gap-2"
              onClick={() => {
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
              className="flex flex-col items-center justify-center h-24 w-24 gap-2"
              onClick={() => {
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
                      `border-${color.value}-500 bg-${color.value}-500/5` : 
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
              className="bg-green-500 text-white hover:bg-green-600"
              disabled={selectedAccentColor === "green"}
            >
              Save Accent Color
            </Button>
          </div>
          
          <div className="pt-4">
            <h3 className="text-sm font-medium mb-3">Preview</h3>
            <div className="space-y-3 p-4 border rounded-md">
              <div className="flex flex-wrap gap-3">
                <Button className="bg-green-500 text-white hover:bg-green-600">Primary Button</Button>
                <Button variant="outline" className="border-green-500 text-green-500">
                  Outline Button
                </Button>
                <Button variant="ghost" className="text-green-500">
                  Ghost Button
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${accentColors.find(c => c.value === selectedAccentColor)?.color}`}></span>
                <span className={accentColors.find(c => c.value === selectedAccentColor)?.textColor}>
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
