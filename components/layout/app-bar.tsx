"use client"

import { Breadcrumb } from "@/components/app-bar/breadcrumb";
import { GlobalSearch } from "@/components/app-bar/global-search";
import { GlobalActions } from "@/components/app-bar/global-actions";

export function AppBar() {
  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-6">
      <div className="flex items-center gap-4 flex-1">
        <Breadcrumb />
      </div>
      
      <div className="flex items-center gap-4">
        <GlobalSearch />
        <GlobalActions />
      </div>
    </header>
  );
}

