"use client"

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import type { Veiculo } from "@/lib/types/veiculo";

type StatusState = "idle" | "loading" | "error";

type FilterType = "capacidade" | "status";

interface Filter {
  type: FilterType;
  label: string;
  value: string;
}

interface VeiculosContextType {
  veiculos: Veiculo[];
  status: StatusState;
  error?: string;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filters: Filter[];
  setFilters: (filters: Filter[]) => void;
  refreshData: () => void;
  addVeiculo: (veiculo: Veiculo) => Promise<void>;
  updateVeiculo: (id: string, veiculo: Partial<Veiculo>) => Promise<void>;
  deleteVeiculo: (id: string) => Promise<void>;
}

const VeiculosContext = createContext<VeiculosContextType | undefined>(undefined);

export function VeiculosProvider({ children }: { children: ReactNode }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Filter[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [status, setStatus] = useState<StatusState>("idle");
  const [error, setError] = useState<string | undefined>();

  const fetchVeiculos = useCallback(async () => {
    setStatus("loading");
    setError(undefined);
    try {
      const res = await fetch("/api/veiculos", { cache: "no-store" });
      if (!res.ok) {
        throw new Error(`Falha ao carregar veículos (${res.status})`);
      }
      const data = (await res.json()) as Veiculo[];
      const parsed = data.map((item) => ({
        ...item,
        criadoEm: item.criadoEm ? new Date(item.criadoEm) : undefined,
      }));
      setVeiculos(parsed);
      setStatus("idle");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro ao carregar veículos");
      setStatus("error");
    }
  }, []);

  const refreshData = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const addVeiculo = async (veiculo: Veiculo) => {
    const res = await fetch("/api/veiculos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(veiculo),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.message || "Não foi possível criar o veículo");
    }
    const created = (await res.json()) as Veiculo;
    setVeiculos((prev) => [{ ...created, criadoEm: created.criadoEm ? new Date(created.criadoEm) : undefined }, ...prev]);
  };

  const updateVeiculo = async (id: string, veiculo: Partial<Veiculo>) => {
    const res = await fetch(`/api/veiculos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(veiculo),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.message || "Não foi possível atualizar o veículo");
    }
    const updated = (await res.json()) as Veiculo;
    setVeiculos((prev) => prev.map((v) => (v.id === id ? { ...updated, criadoEm: updated.criadoEm ? new Date(updated.criadoEm) : undefined } : v)));
  };

  const deleteVeiculo = async (id: string) => {
    const res = await fetch(`/api/veiculos/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.message || "Não foi possível remover o veículo");
    }
    setVeiculos((prev) => prev.filter((v) => v.id !== id));
  };

  useEffect(() => {
    fetchVeiculos();
  }, [fetchVeiculos, refreshKey]);

  return (
    <VeiculosContext.Provider
      value={{
        veiculos,
        status,
        error,
        searchTerm,
        setSearchTerm,
        filters,
        setFilters,
        refreshData,
        addVeiculo,
        updateVeiculo,
        deleteVeiculo,
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
