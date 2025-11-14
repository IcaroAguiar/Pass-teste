"use client"

import { createContext, useContext, useState, ReactNode } from "react";
import type { Veiculo } from "@/lib/types/veiculo";

type FilterType = "capacidade" | "status";

interface Filter {
  type: FilterType;
  label: string;
  value: string;
}

interface VeiculosContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filters: Filter[];
  setFilters: (filters: Filter[]) => void;
  refreshData: () => void;
  addVeiculo: (veiculo: Veiculo) => void;
}

const VeiculosContext = createContext<VeiculosContextType | undefined>(undefined);

export function VeiculosProvider({ children }: { children: ReactNode }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Filter[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshData = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const addVeiculo = (veiculo: Veiculo) => {
    // Mock: adicionar veículo localmente
    // No futuro, aqui seria a chamada à API POST /api/veiculos
    console.log("Adicionando veículo:", veiculo);
    // Por enquanto apenas log, mas aqui seria a lógica de adicionar
    // Em produção, faria: await fetch('/api/veiculos', { method: 'POST', body: JSON.stringify(veiculo) })
  };

  return (
    <VeiculosContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        filters,
        setFilters,
        refreshData,
        addVeiculo,
      }}
    >
      {children}
    </VeiculosContext.Provider>
  );
}

export function useVeiculos() {
  const context = useContext(VeiculosContext);
  if (context === undefined) {
    throw new Error("useVeiculos must be used within a VeiculosProvider");
  }
  return context;
}

