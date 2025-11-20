"use client"

import { useState, useMemo, useEffect } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, MoreHorizontal, Circle, Eye, Pencil, Trash2 } from "lucide-react";
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
import type { Veiculo } from "@/lib/types/veiculo";

type SortField = keyof Veiculo;
type SortDirection = "asc" | "desc";

export function VeiculosTable() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const t = useTranslations(language);
  const { searchTerm, filters, veiculos, status, error } = useVeiculos();
  
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
    const currentPageIds = paginatedVeiculos
      .map((v) => v.id)
      .filter((id): id is string => Boolean(id));
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
    let filtered = [...veiculos];

    // Aplicar busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((v) => {
        const identificador = v.identificador?.toLowerCase() ?? "";
        const titulo = v.titulo?.toLowerCase() ?? "";
        const marca = v.marca?.toLowerCase() ?? "";
        const placa = v.placa?.toLowerCase() ?? "";
        const id = v.id?.toLowerCase() ?? "";
        const status = v.status?.toLowerCase() ?? "";
        return (
          identificador.includes(term) ||
          titulo.includes(term) ||
          marca.includes(term) ||
          placa.includes(term) ||
          id.includes(term) ||
          status.includes(term)
        );
      });
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
  }, [searchTerm, filters, veiculos]);

  // Paginação
  const paginatedVeiculos = useMemo(() => {
    const sorted = [...filteredVeiculos].sort((a, b) => {
    if (!sortField) return 0;
    
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (sortField === "criadoEm") {
      const aDate = (aValue as Date | undefined) ?? new Date(0);
      const bDate = (bValue as Date | undefined) ?? new Date(0);
      return sortDirection === "asc"
        ? aDate.getTime() - bDate.getTime()
        : bDate.getTime() - aDate.getTime();
    }

    if (sortField === "capacidade") {
      const aNum = (aValue as number | undefined) ?? 0;
      const bNum = (bValue as number | undefined) ?? 0;
      return sortDirection === "asc"
        ? aNum - bNum
        : bNum - aNum;
    }

    const aStr = String(aValue ?? "").toLowerCase();
    const bStr = String(bValue ?? "").toLowerCase();
    
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

  const totalPages = Math.ceil(filteredVeiculos.length / pageSize || 1);

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
        {status === "loading" && (
          <div className="p-6 text-sm text-muted-foreground">Carregando veículos...</div>
        )}
        {status === "error" && (
          <div className="p-6 text-sm text-destructive">{error || "Erro ao carregar"}</div>
        )}
        {status === "idle" && veiculos.length === 0 && (
          <div className="p-6 text-sm text-muted-foreground">Nenhum veículo cadastrado ainda.</div>
        )}
        <Table className={veiculos.length === 0 ? "hidden" : ""}>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    paginatedVeiculos.length > 0 &&
                    paginatedVeiculos.every((v) => v.id ? selectedRows.has(v.id) : false)
                  }
                  onCheckedChange={toggleAllSelection}
                  aria-label="Selecionar todos"
                />
              </TableHead>
              <TableHead className="w-[120px]">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1.5 w-full justify-start -ml-3 px-3 text-sm text-white font-medium"
                  onClick={() => handleSort("identificador")}
                >
                  {t("identifier")}
                  {getSortIcon("identificador")}
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
            {paginatedVeiculos.map((veiculo) => {
              const id = veiculo.id ?? "";
              const identificador = veiculo.identificador ?? "—";
              const titulo = veiculo.titulo ?? "—";
              const placa = veiculo.placa ?? "—";
              const marca = veiculo.marca ?? "—";
              const status = veiculo.status ?? "—";
              const capacidade = veiculo.capacidade ?? 0;
              const createdAt = veiculo.criadoEm ? formatDate(veiculo.criadoEm) : "—";

              return (
              <TableRow
                key={id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => {
                  // Navegar para detalhes
                }}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedRows.has(id)}
                    onCheckedChange={() => toggleRowSelection(id)}
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Selecionar veículo ${id}`}
                  />
                </TableCell>
                <TableCell className="text-sm">{identificador}</TableCell>
                <TableCell>
                  <Link
                    href={`/veiculos/${id}`}
                    className="text-primary hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {titulo}
                  </Link>
                </TableCell>
                <TableCell>{marca}</TableCell>
                <TableCell className="text-sm">{placa}</TableCell>
                <TableCell>{capacidade} lugares</TableCell>
                <TableCell className="text-sm">{createdAt}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Circle
                      className={`h-2 w-2 opacity-60 ${
                        status === "Liberado"
                          ? "fill-green-500 text-green-500"
                          : status === "Ocupado"
                          ? "fill-red-500 text-red-500"
                          : status === "Manutenção"
                          ? "fill-yellow-500 text-yellow-500"
                          : "fill-gray-500 text-gray-500"
                      }`}
                    />
                    <span>{status}</span>
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
                      <DropdownMenuItem onClick={() => router.push(`/veiculos/${id}`)}>
                        <Eye className="mr-2 h-4 w-4" /> Ver detalhes
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push(`/veiculos/${id}/edit`)}>
                        <Pencil className="mr-2 h-4 w-4" /> Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={async () => {
                          if (!id) return;
                          const ok = confirm("Remover este veículo?");
                          if (!ok) return;
                          await fetch(`/api/veiculos/${id}`, { method: "DELETE" });
                          router.refresh();
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Remover
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
            })}
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
