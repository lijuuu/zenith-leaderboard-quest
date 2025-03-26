
import { useTheme } from "@/contexts/ThemeContext";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "dark" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-zinc-800 group-[.toaster]:text-white group-[.toaster]:border-zinc-700 group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-zinc-400",
          actionButton:
            "group-[.toast]:bg-green-500 group-[.toast]:text-white",
          cancelButton:
            "group-[.toast]:bg-zinc-700 group-[.toast]:text-zinc-200",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
