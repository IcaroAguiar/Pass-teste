"use client"

import React from "react";
import { AlertCircle, Plus, X, Copy, FileText, Upload } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { useTranslations } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Documentacao } from "@/lib/types/veiculo";

interface VeiculoFormDocumentacaoProps {
  documentacoes: Documentacao[];
  onAdd: (doc: Documentacao) => void;
  onRemove: (index: number) => void;
  onToggleAntecipacao: (index: number) => void;
}

export function VeiculoFormDocumentacao({
  documentacoes,
  onAdd,
  onRemove,
  onToggleAntecipacao,
}: VeiculoFormDocumentacaoProps) {
  const { language } = useLanguage();
  const t = useTranslations(language);

  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState<Documentacao>({
    documento: "",
    tipo: "",
    vencimento: new Date(),
    antecipacao: false,
    dias: undefined,
  } as Documentacao);

  const resetForm = () =>
    setForm({
      documento: "",
      tipo: "",
      vencimento: new Date(),
      antecipacao: false,
      dias: undefined,
    } as Documentacao);

  const handleSubmit = () => {
    if (!form.documento || !form.tipo || !form.vencimento) return;
    onAdd(form);
    resetForm();
    setOpen(false);
  };

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
                  <Switch
                    checked={doc.antecipacao}
                    onCheckedChange={() => onToggleAntecipacao(index)}
                    aria-label="Antecipação"
                  />
                </TableCell>
                <TableCell>{doc.dias || "-"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Copy className="h-3 w-3" />
                      <span className="sr-only">Copiar</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => onRemove(index)}
                    >
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
        <Button type="button" variant="outline" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {t("addVehicle")}
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
              <FileText className="h-5 w-5" /> Documentação
            </DialogTitle>
            <p className="text-sm text-muted-foreground">Dados Gerais</p>
          </DialogHeader>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="rounded-lg border bg-card p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Documento</Label>
                  <Input
                    value={form.documento}
                    onChange={(e) => setForm((prev) => ({ ...prev, documento: e.target.value }))}
                    placeholder="Ex: Tacógrafo"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Input
                    value={form.tipo}
                    onChange={(e) => setForm((prev) => ({ ...prev, tipo: e.target.value }))}
                    placeholder="Informe o tipo"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Vencimento</Label>
                  <Input
                    type="date"
                    value={form.vencimento ? new Date(form.vencimento).toISOString().slice(0, 10) : ""}
                    onChange={(e) => {
                      if (!e.target.value) return;
                      setForm((prev) => ({ ...prev, vencimento: new Date(e.target.value) }));
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Antecipação</Label>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={form.antecipacao}
                      onCheckedChange={(checked) => setForm((prev) => ({ ...prev, antecipacao: checked }))}
                    />
                    <Input
                      type="number"
                      placeholder="Dias"
                      value={form.dias ?? ""}
                      onChange={(e) => setForm((prev) => ({ ...prev, dias: e.target.value ? Number(e.target.value) : undefined }))}
                      className="w-32"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Upload className="h-4 w-4" /> Anexo (opcional)
              </div>
              <label className="block border border-dashed rounded-lg p-6 text-center text-sm text-muted-foreground">
                Envie arquivos ou arraste aqui
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setForm((prev) => ({ ...prev, anexo: file.name } as Documentacao));
                  }}
                />
              </label>
              {form.anexo && (
                <div className="flex items-center justify-between text-sm">
                  <span>{form.anexo}</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setForm((prev) => ({ ...prev, anexo: undefined } as Documentacao))}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="flex justify-between gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Fechar
            </Button>
            <Button onClick={handleSubmit} className="bg-primary text-primary-foreground">
              Cadastrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
