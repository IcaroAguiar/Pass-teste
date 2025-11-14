"use client"

import { AlertCircle, Plus, X, Copy } from "lucide-react";
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
import type { Documentacao } from "@/lib/types/veiculo";

interface VeiculoFormDocumentacaoProps {
  documentacoes: Documentacao[];
  onAdd: () => void;
}

export function VeiculoFormDocumentacao({
  documentacoes,
  onAdd,
}: VeiculoFormDocumentacaoProps) {
  const { language } = useLanguage();
  const t = useTranslations(language);

  return (
    <div className="space-y-4">
      {documentacoes.length === 0 ? (
        <div className="flex items-center justify-center py-8 text-muted-foreground">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{t("noRecord")}</span>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("document")}</TableHead>
              <TableHead>{t("documentType")}</TableHead>
              <TableHead>{t("expiration")}</TableHead>
              <TableHead>{t("anticipation")}</TableHead>
              <TableHead>{t("days")}</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documentacoes.map((doc, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  </div>
                </TableCell>
                <TableCell>{doc.tipo}</TableCell>
                <TableCell>
                  {doc.vencimento
                    ? new Date(doc.vencimento).toLocaleDateString("pt-BR")
                    : "-"}
                </TableCell>
                <TableCell>
                  <div
                    className={`h-4 w-8 rounded-full ${
                      doc.antecipacao ? "bg-primary" : "bg-muted"
                    }`}
                  />
                </TableCell>
                <TableCell>{doc.dias || "-"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Copy className="h-3 w-3" />
                      <span className="sr-only">Copiar</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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

