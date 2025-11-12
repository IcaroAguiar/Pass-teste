"use client"

import { useState } from "react";
import { X, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FilterType = "modo" | "status";

interface Filter {
  type: FilterType;
  label: string;
  value: string;
}

export function FilterChips() {
  const [filters, setFilters] = useState<Filter[]>([]);

  const addModoFilter = (value: string) => {
    setFilters([...filters, { type: "modo", label: `Modo: ${value}`, value }]);
  };

  const addStatusFilter = (value: string) => {
    setFilters([...filters, { type: "status", label: `Status: ${value}`, value }]);
  };

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const clearAllFilters = () => {
    setFilters([]);
  };

  const modoFilter = filters.find((f) => f.type === "modo");
  const statusFilter = filters.find((f) => f.type === "status");

  return (
    <div className="flex items-center gap-2">
      {/* Chip Modo */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={modoFilter ? "default" : "outline"}
            size="sm"
            className="h-8 gap-2"
          >
            <Filter className="h-3 w-3" />
            Modo
            {modoFilter && (
              <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                1
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56" align="start">
          <div className="space-y-2">
            <p className="text-sm font-medium">Modo</p>
            <Select
              value={modoFilter?.value || ""}
              onValueChange={(value) => {
                if (value) {
                  const newFilters = filters.filter((f) => f.type !== "modo");
                  setFilters([...newFilters, { type: "modo", label: `Modo: ${value}`, value }]);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o modo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="privativo">Privativo</SelectItem>
                <SelectItem value="compartilhado">Compartilhado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </PopoverContent>
      </Popover>

      {/* Chip Status */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={statusFilter ? "default" : "outline"}
            size="sm"
            className="h-8 gap-2"
          >
            <Filter className="h-3 w-3" />
            Status
            {statusFilter && (
              <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                1
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56" align="start">
          <div className="space-y-2">
            <p className="text-sm font-medium">Status</p>
            <Select
              value={statusFilter?.value || ""}
              onValueChange={(value) => {
                if (value) {
                  const newFilters = filters.filter((f) => f.type !== "status");
                  setFilters([...newFilters, { type: "status", label: `Status: ${value}`, value }]);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="liberado">Liberado</SelectItem>
                <SelectItem value="ocupado">Ocupado</SelectItem>
                <SelectItem value="manutencao">Manutenção</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </PopoverContent>
      </Popover>

      {/* Chips de filtros ativos */}
      {filters.map((filter, index) => (
        <Badge
          key={index}
          variant="secondary"
          className="h-8 gap-1 px-2"
        >
          {filter.label}
          <button
            onClick={() => removeFilter(index)}
            className="ml-1 rounded-full hover:bg-muted"
            aria-label={`Remover filtro ${filter.label}`}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}

      {/* Limpar todos */}
      {filters.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAllFilters}
          className="h-8 text-xs"
        >
          Limpar
        </Button>
      )}
    </div>
  );
}

