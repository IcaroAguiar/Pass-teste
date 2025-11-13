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
          <div className="h-8 w-8 rounded-md bg-[#262626] flex items-center justify-center">
            <span className="text-white text-base font-semibold leading-none">P</span>
          </div>
        ) : (
          <h1 className="text-xl font-semibold text-white">
            Pass
          </h1>
        )}
      </div>
      
      {/* Navegação */}
      <ScrollArea className="flex-1">
        <div className={cn(
          "transition-all duration-300 flex flex-col items-center",
          isCollapsed ? "p-2" : "p-4"
        )}>
          <SidebarNav isCollapsed={isCollapsed} />
        </div>
      </ScrollArea>
    </aside>
  );
}

