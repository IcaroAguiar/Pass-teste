"use client"

import { useState, useMemo } from "react";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import { Pagination } from "./pagination";
import { Toolbar } from "./toolbar";

// Dados mockados
interface Veiculo {
  id: string;
  titulo: string;
  modo: string;
  status: string;
  criadoEm: Date;
  ultimaAlteracao: Date;
}

const mockVeiculos: Veiculo[] = Array.from({ length: 32 }, (_, i) => {
  const modos = ["Privativo", "Compartilhado"];
  const statuses = ["Liberado", "Ocupado", "Manutenção"];
  const tipos = ["Van Executiva", "Micro-ônibus", "Van Turismo", "Ônibus", "Minivan"];
  
  return {
    id: String(i + 1),
    titulo: `${tipos[i % tipos.length]} ${i + 1}`,
    modo: modos[i % modos.length],
    status: statuses[i % statuses.length],
    criadoEm: new Date(2024, 0, 15 + i),
    ultimaAlteracao: new Date(2024, 10, 1 + (i % 30)),
  };
});

type SortField = keyof Veiculo;
type SortDirection = "asc" | "desc";

export function VeiculosTable() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
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
    return format(date, "dd/MM/yyyy", { locale: ptBR });
  };

  // Paginação
  const paginatedVeiculos = useMemo(() => {
    const sorted = [...mockVeiculos].sort((a, b) => {
    if (!sortField) return 0;
    
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (sortField === "criadoEm" || sortField === "ultimaAlteracao") {
      const aDate = aValue as Date;
      const bDate = bValue as Date;
      return sortDirection === "asc"
        ? aDate.getTime() - bDate.getTime()
        : bDate.getTime() - aDate.getTime();
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
  }, [sortField, sortDirection, currentPage, pageSize]);

  const totalPages = Math.ceil(mockVeiculos.length / pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-0">
      <div className="rounded-md border border-border">
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
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-2"
                  onClick={() => handleSort("id")}
                >
                  ID
                  {sortField === "id" && (
                    <ArrowUpDown className="h-4 w-4" />
                  )}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-2"
                  onClick={() => handleSort("titulo")}
                >
                  Título
                  {sortField === "titulo" && (
                    <ArrowUpDown className="h-4 w-4" />
                  )}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-2"
                  onClick={() => handleSort("modo")}
                >
                  Modo
                  {sortField === "modo" && (
                    <ArrowUpDown className="h-4 w-4" />
                  )}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-2"
                  onClick={() => handleSort("status")}
                >
                  Status
                  {sortField === "status" && (
                    <ArrowUpDown className="h-4 w-4" />
                  )}
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-2"
                  onClick={() => handleSort("criadoEm")}
                >
                  Criado em
                  {sortField === "criadoEm" && (
                    <ArrowUpDown className="h-4 w-4" />
                  )}
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-2"
                  onClick={() => handleSort("ultimaAlteracao")}
                >
                  Última Alteração
                  {sortField === "ultimaAlteracao" && (
                    <ArrowUpDown className="h-4 w-4" />
                  )}
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
                <TableCell className="font-mono text-sm">{veiculo.id}</TableCell>
                <TableCell>
                  <Link
                    href={`/veiculos/${veiculo.id}`}
                    className="text-primary hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {veiculo.titulo}
                  </Link>
                </TableCell>
                <TableCell>{veiculo.modo}</TableCell>
                <TableCell>
                  <Badge
                    variant={veiculo.status === "Liberado" ? "default" : "secondary"}
                    className="gap-1.5"
                  >
                    {veiculo.status === "Liberado" && (
                      <span className="h-2 w-2 rounded-full bg-green-500" />
                    )}
                    {veiculo.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {formatDate(veiculo.criadoEm)}
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {formatDate(veiculo.ultimaAlteracao)}
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
              {selectedRows.size} de {mockVeiculos.length} linhas selecionadas
            </span>
          </div>
        )}
        
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={mockVeiculos.length}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  );
}

