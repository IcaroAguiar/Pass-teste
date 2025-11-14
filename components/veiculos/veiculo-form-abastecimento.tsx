"use client"

import { Fuel, Plus, AlertCircle } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { useTranslations } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Abastecimento } from "@/lib/types/veiculo";

interface VeiculoFormAbastecimentoProps {
  abastecimentos: Abastecimento[];
  onAdd: () => void;
}

export function VeiculoFormAbastecimento({
  abastecimentos,
  onAdd,
}: VeiculoFormAbastecimentoProps) {
  const { language } = useLanguage();
  const t = useTranslations(language);

  const totalLitros = abastecimentos.reduce((sum, ab) => sum + (ab.litros || 0), 0);
  const totalValor = abastecimentos.reduce((sum, ab) => sum + (ab.valor || 0), 0);

  return (
    <div className="space-y-4">
      {abastecimentos.length === 0 ? (
        <div className="flex items-center justify-center py-8 text-muted-foreground">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{t("noRecord")}</span>
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("refuelingDate")}</TableHead>
                <TableHead>{t("supplier")}</TableHead>
                <TableHead>{t("fuel")}</TableHead>
                <TableHead>{t("liters")}</TableHead>
                <TableHead>{t("value")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {abastecimentos.map((abastecimento, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {abastecimento.dataAbastecimento
                      ? new Date(abastecimento.dataAbastecimento).toLocaleDateString("pt-BR")
                      : "-"}
                  </TableCell>
                  <TableCell>{abastecimento.fornecedor}</TableCell>
                  <TableCell>{abastecimento.combustivel}</TableCell>
                  <TableCell>{abastecimento.litros.toFixed(2)}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(abastecimento.valor)}
                  </TableCell>
                </TableRow>
              ))}
              {/* Linha de totais */}
              <TableRow className="font-medium">
                <TableCell colSpan={3}>
                  <div className="flex items-center gap-2">
                    <span>{t("total")}</span>
                  </div>
                </TableCell>
                <TableCell>{totalLitros.toFixed(2)}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(totalValor)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </>
      )}

      <div className="flex justify-center">
        <Button type="button" variant="outline" onClick={onAdd}>
          <Plus className="h-4 w-4 mr-2" />
          {t("addVehicle")}
        </Button>
      </div>
    </div>
  );
}

