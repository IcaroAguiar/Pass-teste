"use client"

import { Search, RefreshCw, Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FilterChips } from "@/components/veiculos/filter-chips";
import { useVeiculos } from "./veiculos-context";
import { useRouter } from "next/navigation";

export function Toolbar() {
  const { searchTerm, setSearchTerm, refreshData } = useVeiculos();
  const router = useRouter();

  const handleExport = (format: "csv" | "xlsx" | "json") => {
    // Implementar exportação
    console.log(`Exportando como ${format}`);
    // Por enquanto apenas log, mas aqui seria a lógica de exportação
  };

  const handleAdd = () => {
    router.push("/veiculos/novo");
  };

  return (
    <div className="border-b border-border bg-card rounded-t-2xl dark:border-b-[#2D2E2E]">
      <div className="flex items-center justify-between px-6 py-4 gap-4 border-x border-t border-border dark:border-[#2D2E2E]">
        {/* Lado esquerdo: Seleção em massa, busca local, filtros */}
        <div className="flex items-center gap-4 flex-1">
          {/* Busca local */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Filtros */}
          <FilterChips />
        </div>

        {/* Lado direito: Ações */}
        <div className="flex items-center gap-2">
          {/* Atualizar */}
          <Button 
            variant="ghost" 
            size="icon" 
            aria-label="Atualizar"
            onClick={refreshData}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>

          {/* Export */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Exportar">
                <Download className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport("csv")}>
                Exportar como CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("xlsx")}>
                Exportar como XLSX
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("json")}>
                Exportar como JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Separator orientation="vertical" className="h-6" />

          {/* Adicionar */}
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar
          </Button>
        </div>
      </div>
    </div>
  );
}

