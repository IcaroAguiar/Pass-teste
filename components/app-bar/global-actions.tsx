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
import { useLanguage } from "@/components/language-provider";
import { useTranslations } from "@/lib/translations";

export function GlobalActions() {
  const { language, setLanguage, languageName } = useLanguage();
  const t = useTranslations(language);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLanguageChange = (newLanguage: "pt" | "en" | "es") => {
    setLanguage(newLanguage);
  };

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    
    if (!document.startViewTransition) {
      setTheme(nextTheme);
      return;
    }

    document.startViewTransition(() => {
      setTheme(nextTheme);
    });
  };

  return (
    <div className="flex items-center gap-2">
      {/* Seletor de idioma */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-2" aria-label={t("selectLanguage")}>
            <Globe className="h-5 w-5" />
            <span>{languageName}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem 
            onSelect={() => handleLanguageChange("pt")}
            className={language === "pt" ? "bg-accent" : ""}
          >
            Português
          </DropdownMenuItem>
          <DropdownMenuItem 
            onSelect={() => handleLanguageChange("en")}
            className={language === "en" ? "bg-accent" : ""}
          >
            English
          </DropdownMenuItem>
          <DropdownMenuItem 
            onSelect={() => handleLanguageChange("es")}
            className={language === "es" ? "bg-accent" : ""}
          >
            Español
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Botão de tema - toggle direto */}
      <Button 
        variant="ghost" 
        size="icon"
        onClick={toggleTheme}
        aria-label={t("toggleTheme")}
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
            <span>{t("profile")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
