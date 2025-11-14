"use client"

import { AlertTriangle, Plus } from "lucide-react";
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
import type { Ocorrencia } from "@/lib/types/veiculo";

interface VeiculoFormOcorrenciaProps {
  ocorrencias: Ocorrencia[];
  onAdd: () => void;
}

export function VeiculoFormOcorrencia({
  ocorrencias,
  onAdd,
}: VeiculoFormOcorrenciaProps) {
  const { language } = useLanguage();
  const t = useTranslations(language);

  return (
    <div className="space-y-4">
      {ocorrencias.length === 0 ? (
        <div className="flex items-center justify-center py-8 text-muted-foreground">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <span>{t("noRecord")}</span>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("occurrenceDate")}</TableHead>
              <TableHead>{t("occurrenceClassification")}</TableHead>
              <TableHead>{t("severity")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ocorrencias.map((ocorrencia, index) => (
              <TableRow key={index}>
                <TableCell>
                  {ocorrencia.dataOcorrencia
                    ? new Date(ocorrencia.dataOcorrencia).toLocaleDateString("pt-BR")
                    : "-"}
                </TableCell>
                <TableCell>{ocorrencia.classificacao}</TableCell>
                <TableCell>{ocorrencia.seriedade}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <div className="flex justify-end">
        <Button type="button" variant="outline" onClick={onAdd}>
          <Plus className="h-4 w-4 mr-2" />
          {t("addVehicle")}
        </Button>
      </div>
    </div>
  );
}

