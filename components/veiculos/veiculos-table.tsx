"use client"

import { useState } from "react";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
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

// Dados mockados
interface Veiculo {
  id: string;
  titulo: string;
  modo: string;
  status: string;
  criadoEm: Date;
  ultimaAlteracao: Date;
}

const mockVeiculos: Veiculo[] = [
  {
    id: "1",
    titulo: "Van Executiva",
    modo: "Privativo",
    status: "Liberado",
    criadoEm: new Date("2024-01-15"),
    ultimaAlteracao: new Date("2024-11-10"),
  },
  {
    id: "2",
    titulo: "Micro-ônibus",
    modo: "Compartilhado",
    status: "Ocupado",
    criadoEm: new Date("2024-02-20"),
    ultimaAlteracao: new Date("2024-11-11"),
  },
  {
    id: "3",
    titulo: "Van Turismo",
    modo: "Privativo",
    status: "Liberado",
    criadoEm: new Date("2024-03-10"),
    ultimaAlteracao: new Date("2024-11-09"),
  },
];

type SortField = keyof Veiculo;
type SortDirection = "asc" | "desc";

export function VeiculosTable() {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
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
    if (selectedRows.size === mockVeiculos.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(mockVeiculos.map((v) => v.id)));
    }
  };

  const formatDate = (date: Date) => {
    return format(date, "dd/MM/yyyy", { locale: ptBR });
  };

  const sortedVeiculos = [...mockVeiculos].sort((a, b) => {
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

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedRows.size === mockVeiculos.length}
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
            {sortedVeiculos.map((veiculo) => (
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

      {/* Contador de seleção */}
      {selectedRows.size > 0 && (
        <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/50">
          <span className="text-sm text-muted-foreground">
            {selectedRows.size} de {mockVeiculos.length} linhas selecionadas
          </span>
        </div>
      )}
    </div>
  );
}

