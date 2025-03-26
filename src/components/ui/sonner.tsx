
import { useTheme } from "@/contexts/ThemeContext";
import { useAccentColor } from "@/contexts/AccentColorContext";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "dark" } = useTheme();
  const { accentColor } = useAccentColor();
  
  // Construct class names for dynamic styling
  const actionButtonClass = `group-[.toast]:bg-${accentColor}-500 group-[.toast]:text-white`;

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-zinc-800 group-[.toaster]:text-white group-[.toaster]:border-zinc-700 group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-zinc-400",
          actionButton: actionButtonClass,
          cancelButton:
            "group-[.toast]:bg-zinc-700 group-[.toast]:text-zinc-200",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
