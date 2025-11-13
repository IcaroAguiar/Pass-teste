"use client"

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
import { useVeiculos } from "./veiculos-context";

export function FilterChips() {
  const { filters, setFilters } = useVeiculos();

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const clearAllFilters = () => {
    setFilters([]);
  };

  const capacidadeFilter = filters.find((f) => f.type === "capacidade");
  const statusFilter = filters.find((f) => f.type === "status");

  return (
    <div className="flex items-center gap-2">
      {/* Chip Capacidade */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={capacidadeFilter ? "default" : "outline"}
            size="sm"
            className="h-10 gap-2"
          >
            <Filter className="h-3 w-3" />
            Capacidade
            {capacidadeFilter && (
              <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                1
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56" align="start">
          <div className="space-y-2">
            <p className="text-sm font-medium">Capacidade</p>
            <Select
              value={capacidadeFilter?.value || ""}
              onValueChange={(value) => {
                const newFilters = filters.filter((f) => f.type !== "capacidade");
                if (value) {
                  setFilters([...newFilters, { type: "capacidade", label: `Capacidade: ${value} lugares`, value }]);
                } else {
                  setFilters(newFilters);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a capacidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 lugares</SelectItem>
                <SelectItem value="20">20 lugares</SelectItem>
                <SelectItem value="30">30 lugares</SelectItem>
                <SelectItem value="40">40 lugares</SelectItem>
                <SelectItem value="50">50 lugares</SelectItem>
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
            className="h-10 gap-2"
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
                const newFilters = filters.filter((f) => f.type !== "status");
                if (value) {
                  setFilters([...newFilters, { type: "status", label: `Status: ${value}`, value }]);
                } else {
                  setFilters(newFilters);
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

