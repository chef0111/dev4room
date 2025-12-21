"use client";

import { useCallback } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const switchTheme = useCallback(() => {
    setTheme(resolvedTheme === "light" ? "dark" : "light");
  }, [resolvedTheme, setTheme]);

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={switchTheme}
      aria-label="Toggle theme"
    >
      <Sun className="size-4.5 scale-100 rotate-0 text-orange-500 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute size-4.5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
