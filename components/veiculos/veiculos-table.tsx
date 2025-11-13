"use client"

import { useState, useMemo, useEffect } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, MoreHorizontal, Circle } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { ptBR, enUS, es } from "date-fns/locale";
import Link from "next/link";
import { Pagination } from "./pagination";
import { Toolbar } from "./toolbar";
import { useVeiculos } from "./veiculos-context";
import { useLanguage } from "@/components/language-provider";
import { useTranslations } from "@/lib/translations";

// Dados mockados
interface Veiculo {
  id: string;
  titulo: string;
  marca: string;
  placa: string;
  capacidade: number;
  status: string;
  criadoEm: Date;
}

const mockVeiculos: Veiculo[] = Array.from({ length: 32 }, (_, i) => {
  const marcas = ["Mercedes-Benz", "Volvo", "Scania", "Volkswagen", "Iveco"];
  const statuses = ["Liberado", "Ocupado", "Manutenção"];
  const tipos = ["Van Executiva", "Micro-ônibus", "Van Turismo", "Ônibus", "Minivan"];
  const letras = ["ABC", "DEF", "GHI", "JKL", "MNO", "PQR", "STU", "VWX"];
  
  const letraIndex = Math.floor(i / 4) % letras.length;
  const numero = String(1000 + (i % 9000)).padStart(4, "0");
  
  return {
    id: String(i + 1),
    titulo: `${tipos[i % tipos.length]} ${i + 1}`,
    marca: marcas[i % marcas.length],
    placa: `${letras[letraIndex]}-${numero}`,
    capacidade: [15, 20, 30, 40, 50][i % 5],
    status: statuses[i % statuses.length],
    criadoEm: new Date(2024, 0, 15 + i),
  };
});

type SortField = keyof Veiculo;
type SortDirection = "asc" | "desc";

export function VeiculosTable() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const t = useTranslations(language);
  const { searchTerm, filters } = useVeiculos();
  
  const dateLocale = language === "pt" ? ptBR : language === "en" ? enUS : es;
  
  // Estado da paginação local (não na URL)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const urlSortField = searchParams.get("sortField") as SortField | null;
  const urlSortDirection = (searchParams.get("sortDirection") as SortDirection) || "asc";

  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<SortField | null>(urlSortField);
  const [sortDirection, setSortDirection] = useState<SortDirection>(urlSortDirection);

  const updateURL = (updates: Record<string, string | number>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, String(value));
      } else {
        params.delete(key);
      }
    });
    router.push(`?${params.toString()}`);
  };

  const handleSort = (field: SortField) => {
    const newDirection = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDirection);
    updateURL({ sortField: field, sortDirection: newDirection });
  };

  const getSortIcon = (field: SortField) => {
    if (sortField === field) {
      return sortDirection === "asc" ? (
        <ArrowUp className="h-3 w-3" />
      ) : (
        <ArrowDown className="h-3 w-3" />
      );
    }
    return <ArrowUpDown className="h-3 w-3 opacity-50" />;
  };

  const toggleRowSelection = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const toggleAllSelection = () => {
    const currentPageIds = paginatedVeiculos.map((v) => v.id);
    const allCurrentSelected = currentPageIds.every((id) => selectedRows.has(id));
    
    const newSelected = new Set(selectedRows);
    if (allCurrentSelected) {
      currentPageIds.forEach((id) => newSelected.delete(id));
    } else {
      currentPageIds.forEach((id) => newSelected.add(id));
    }
    setSelectedRows(newSelected);
  };

  const formatDate = (date: Date) => {
    return format(date, "dd/MM/yyyy", { locale: dateLocale });
  };

  // Filtros e busca
  const filteredVeiculos = useMemo(() => {
    let filtered = [...mockVeiculos];

    // Aplicar busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (v) =>
          v.titulo.toLowerCase().includes(term) ||
          v.marca.toLowerCase().includes(term) ||
          v.placa.toLowerCase().includes(term) ||
          v.id.toLowerCase().includes(term) ||
          v.status.toLowerCase().includes(term)
      );
    }

    // Aplicar filtros
    filters.forEach((filter) => {
      if (filter.type === "status") {
        const statusMap: Record<string, string> = {
          liberado: "Liberado",
          ocupado: "Ocupado",
          manutencao: "Manutenção",
        };
        filtered = filtered.filter((v) => v.status === statusMap[filter.value]);
      }
      if (filter.type === "capacidade") {
        const capacidade = parseInt(filter.value);
        filtered = filtered.filter((v) => v.capacidade === capacidade);
      }
    });

    return filtered;
  }, [searchTerm, filters]);

  // Paginação
  const paginatedVeiculos = useMemo(() => {
    const sorted = [...filteredVeiculos].sort((a, b) => {
    if (!sortField) return 0;
    
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (sortField === "criadoEm") {
      const aDate = aValue as Date;
      const bDate = bValue as Date;
      return sortDirection === "asc"
        ? aDate.getTime() - bDate.getTime()
        : bDate.getTime() - aDate.getTime();
    }

    if (sortField === "capacidade") {
      const aNum = aValue as number;
      const bNum = bValue as number;
      return sortDirection === "asc"
        ? aNum - bNum
        : bNum - aNum;
    }

    const aStr = String(aValue).toLowerCase();
    const bStr = String(bValue).toLowerCase();
    
    if (sortDirection === "asc") {
      return aStr < bStr ? -1 : aStr > bStr ? 1 : 0;
    } else {
      return aStr > bStr ? -1 : aStr < bStr ? 1 : 0;
    }
    });

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return sorted.slice(start, end);
  }, [filteredVeiculos, sortField, sortDirection, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredVeiculos.length / pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  // Resetar página quando filtros ou busca mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  return (
    <div className="space-y-0">
      <div className="rounded-2xl border border-border dark:border-[#2D2E2E] overflow-hidden">
        <Toolbar />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    paginatedVeiculos.length > 0 &&
                    paginatedVeiculos.every((v) => selectedRows.has(v.id))
                  }
                  onCheckedChange={toggleAllSelection}
                  aria-label="Selecionar todos"
                />
              </TableHead>
              <TableHead className="w-[90px]">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1.5 w-full justify-start -ml-3 px-3 text-sm text-white font-medium"
                  onClick={() => handleSort("id")}
                >
                  {t("identifier")}
                  {getSortIcon("id")}
                </Button>
              </TableHead>
              <TableHead className="w-[160px]">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1.5 w-full justify-start -ml-3 px-3 text-sm text-white font-medium"
                  onClick={() => handleSort("titulo")}
                >
                  {t("title")}
                  {getSortIcon("titulo")}
                </Button>
              </TableHead>
              <TableHead className="w-[130px]">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1.5 w-full justify-start -ml-3 px-3 text-sm text-white font-medium"
                  onClick={() => handleSort("marca")}
                >
                  {t("brand")}
                  {getSortIcon("marca")}
                </Button>
              </TableHead>
              <TableHead className="w-[110px]">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1.5 w-full justify-start -ml-3 px-3 text-sm text-white font-medium"
                  onClick={() => handleSort("placa")}
                >
                  {t("plate")}
                  {getSortIcon("placa")}
                </Button>
              </TableHead>
              <TableHead className="w-[110px]">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1.5 w-full justify-start -ml-3 px-3 text-sm text-white font-medium"
                  onClick={() => handleSort("capacidade")}
                >
                  {t("capacity")}
                  {getSortIcon("capacidade")}
                </Button>
              </TableHead>
              <TableHead className="w-[120px]">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1.5 w-full justify-start -ml-3 px-3 text-sm text-white font-medium"
                  onClick={() => handleSort("criadoEm")}
                >
                  {t("createdAt")}
                  {getSortIcon("criadoEm")}
                </Button>
              </TableHead>
              <TableHead className="w-[120px]">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1.5 w-full justify-start -ml-3 px-3 text-sm text-white font-medium"
                  onClick={() => handleSort("status")}
                >
                  {t("status")}
                  {getSortIcon("status")}
                </Button>
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedVeiculos.map((veiculo) => (
              <TableRow
                key={veiculo.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => {
                  // Navegar para detalhes
                }}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedRows.has(veiculo.id)}
                    onCheckedChange={() => toggleRowSelection(veiculo.id)}
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Selecionar veículo ${veiculo.id}`}
                  />
                </TableCell>
                <TableCell className="text-sm">{veiculo.id}</TableCell>
                <TableCell>
                  <Link
                    href={`/veiculos/${veiculo.id}`}
                    className="text-primary hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {veiculo.titulo}
                  </Link>
                </TableCell>
                <TableCell>{veiculo.marca}</TableCell>
                <TableCell className="text-sm">{veiculo.placa}</TableCell>
                <TableCell>{veiculo.capacidade} lugares</TableCell>
                <TableCell className="text-sm">
                  {formatDate(veiculo.criadoEm)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Circle
                      className={`h-2 w-2 opacity-60 ${
                        veiculo.status === "Liberado"
                          ? "fill-green-500 text-green-500"
                          : veiculo.status === "Ocupado"
                          ? "fill-red-500 text-red-500"
                          : veiculo.status === "Manutenção"
                          ? "fill-yellow-500 text-yellow-500"
                          : "fill-gray-500 text-gray-500"
                      }`}
                    />
                    <span>{veiculo.status}</span>
                  </div>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Abrir menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Remover
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Contador de seleção e Paginação */}
      <div className="space-y-0">
        {selectedRows.size > 0 && (
          <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/50">
            <span className="text-sm text-muted-foreground">
              {selectedRows.size} de {filteredVeiculos.length} linhas selecionadas
            </span>
          </div>
        )}
        
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={filteredVeiculos.length}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  );
}

