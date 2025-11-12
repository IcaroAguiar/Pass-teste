"use client"

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "@/components/navigation/sidebar-nav";

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-border bg-[#101214] flex flex-col">
      {/* Cabeçalho */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <h1 className="text-xl font-semibold text-foreground">Pass</h1>
      </div>
      
      {/* Navegação */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          <SidebarNav />
        </div>
      </ScrollArea>
    </aside>
  );
}

