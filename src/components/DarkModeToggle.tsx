
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

const DarkModeToggle = () => {
  // Simplified toggle that doesn't actually change theme
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {}}
      aria-label="Toggle theme"
      className="text-zinc-400 hover:text-white"
    >
      <Sun className="h-5 w-5" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default DarkModeToggle;
