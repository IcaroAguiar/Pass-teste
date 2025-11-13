"use client"

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/app-bar/breadcrumb";
import { GlobalSearch } from "@/components/app-bar/global-search";
import { GlobalActions } from "@/components/app-bar/global-actions";
import { useSidebar } from "@/components/layout/sidebar-context";
import { useLanguage } from "@/components/language-provider";
import { useTranslations } from "@/lib/translations";

export function AppBar() {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const { language } = useLanguage();
  const t = useTranslations(language);

  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-6 rounded-b-3xl">
      <div className="flex items-center gap-4 flex-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          aria-label={isCollapsed ? t("expandMenu") : t("collapseMenu")}
          className="h-8 w-8"
        >
          {isCollapsed ? (
            <PanelLeftOpen className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </Button>
        <Breadcrumb />
      </div>
      
      <div className="flex items-center gap-4">
        <GlobalSearch />
        <GlobalActions />
      </div>
    </header>
  );
}

