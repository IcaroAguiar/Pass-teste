import { AppShell } from "@/components/layout/app-shell";
import { Toolbar } from "@/components/veiculos/toolbar";

export default function VeiculosPage() {
  return (
    <AppShell>
      <div className="flex flex-col h-full">
        <Toolbar />
        <div className="flex-1 overflow-auto p-6">
          <h1 className="text-2xl font-semibold mb-4">Veículos</h1>
          <p className="text-muted-foreground">Tabela será implementada aqui.</p>
        </div>
      </div>
    </AppShell>
  );
}

