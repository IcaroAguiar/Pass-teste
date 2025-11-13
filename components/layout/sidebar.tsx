"use client"

import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarNav } from "@/components/navigation/sidebar-nav";
import { useSidebar } from "@/components/layout/sidebar-context";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const { isCollapsed } = useSidebar();

  return (
    <aside
      className={cn(
        "border-r border-border bg-card flex flex-col transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Cabeçalho */}
      <div className={cn(
        "h-16 flex items-center border-b border-border shrink-0 transition-all duration-300",
        isCollapsed ? "justify-center px-0" : "px-6"
      )}>
        {isCollapsed ? (
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-sm font-semibold">P</span>
          </div>
        ) : (
          <h1 className="text-xl font-semibold text-foreground">
            Pass
          </h1>
        )}
      </div>
      
      {/* Navegação */}
      <ScrollArea className="flex-1">
        <div className={cn(
          "transition-all duration-300",
          isCollapsed ? "p-2" : "p-4"
        )}>
          <SidebarNav isCollapsed={isCollapsed} />
        </div>
      </ScrollArea>
    </aside>
  );
}

