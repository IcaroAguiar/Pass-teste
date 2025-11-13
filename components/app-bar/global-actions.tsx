"use client"

import { useState, useEffect } from "react";
import { Globe, User, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function GlobalActions() {
  const [selectedLanguage, setSelectedLanguage] = useState("Português");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (!mounted || typeof document === "undefined") {
      return;
    }

    const html = document.documentElement;
    const nextTheme = theme === "dark" ? "light" : "dark";

    const cleanup = () => {
      html.classList.remove("theme-transitioning");
    };

    const runThemeUpdate = () => {
      setTheme(nextTheme);
    };

    html.classList.add("theme-transitioning");

    if (!document.startViewTransition) {
      runThemeUpdate();
      window.setTimeout(cleanup, 320);
      return;
    }

    const transition = document.startViewTransition(() => {
      runThemeUpdate();
    });

    transition.finished.finally(cleanup);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Seletor de idioma */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-2" aria-label="Selecionar idioma">
            <Globe className="h-5 w-5" />
            <span>{selectedLanguage}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setSelectedLanguage("Português")}>
            Português
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSelectedLanguage("English")}>
            English
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSelectedLanguage("Español")}>
            Español
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Botão de tema - toggle direto */}
      <Button 
        variant="ghost" 
        size="icon"
        onClick={toggleTheme}
        aria-label="Alternar tema"
      >
        {mounted ? (
          theme === "dark" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )
        ) : (
          <Sun className="h-5 w-5" />
        )}
      </Button>

      {/* Avatar/Perfil */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarFallback>IA</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
