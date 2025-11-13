import { Suspense } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { VeiculosTable } from "@/components/veiculos/veiculos-table";

function VeiculosTableWrapper() {
  return (
    <Suspense fallback={<div className="p-6">Carregando...</div>}>
      <VeiculosTable />
    </Suspense>
  );
}

export default function VeiculosPage() {
  return (
    <AppShell>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Veículos</h1>
        <VeiculosTableWrapper />
      </div>
    </AppShell>
  );
}

