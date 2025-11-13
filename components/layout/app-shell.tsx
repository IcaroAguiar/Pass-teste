"use client"

import { Sidebar } from "@/components/layout/sidebar";
import { AppBar } from "@/components/layout/app-bar";
import { SidebarProvider } from "@/components/layout/sidebar-context";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        {/* Sidebar fixa */}
        <Sidebar />
        
        {/* Área principal */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* App Bar */}
          <AppBar />
          
          {/* Conteúdo */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="rounded-3xl bg-card border border-border dark:border-[#2D2E2E] overflow-hidden">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

