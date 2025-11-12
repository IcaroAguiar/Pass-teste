import { Sidebar } from "@/components/layout/sidebar";
import { AppBar } from "@/components/layout/app-bar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar fixa */}
      <Sidebar />
      
      {/* Área principal */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* App Bar */}
        <AppBar />
        
        {/* Conteúdo */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

