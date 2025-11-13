"use client"

import { createContext, useContext, useState, ReactNode } from "react";

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
}

const VeiculosContext = createContext<VeiculosContextType | undefined>(undefined);

export function VeiculosProvider({ children }: { children: ReactNode }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Filter[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshData = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <VeiculosContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        filters,
        setFilters,
        refreshData,
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

