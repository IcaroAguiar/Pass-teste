"use client"

import React from "react";
import { AlertTriangle, Plus, Info, Trash2, Paperclip, FileText, Shield } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { useTranslations } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EditableCombobox } from "@/components/ui/editable-combobox";
import { Badge } from "@/components/ui/badge";
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
  onAdd: (ocorrencia: Ocorrencia) => void;
  onRemove: (index: number) => void;
}

export function VeiculoFormOcorrencia({
  ocorrencias,
  onAdd,
  onRemove,
}: VeiculoFormOcorrenciaProps) {
  const { language } = useLanguage();
  const t = useTranslations(language);

  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState<Ocorrencia>({
    dataOcorrencia: new Date(),
    classificacao: "",
    seriedade: "",
    descricao: "",
    anexo: "",
  });

  const classificacoes = ["#1104 - Colisão", "#1104 - Quebra", "#1104 - Via"];
  const seriedades = ["#1103 - Baixa", "#1103 - Média", "#1103 - Alta"];

  const severityBadge = (level: string) => {
    const normalized = level.toLowerCase();
    if (normalized.includes("alta")) return { variant: "destructive" as const, label: "Alta" };
    if (normalized.includes("média") || normalized.includes("media")) return { variant: "secondary" as const, label: "Média" };
    return { variant: "outline" as const, label: "Baixa" };
  };

  const handleSubmit = () => {
    onAdd(form);
    setOpen(false);
    setForm({
      dataOcorrencia: new Date(),
      classificacao: "",
      seriedade: "",
      descricao: "",
      anexo: "",
    });
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("occurrenceDate")}</TableHead>
            <TableHead>{t("occurrenceClassification")}</TableHead>
            <TableHead>{t("severity")}</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ocorrencias.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-muted-foreground">
                <div className="flex items-center gap-2 text-sm">
                  <Info className="h-4 w-4" />
                  <span>{t("noRecord")}</span>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            ocorrencias.map((ocorrencia, index) => (
              <TableRow key={index}>
                <TableCell>
                  {ocorrencia.dataOcorrencia
                    ? new Date(ocorrencia.dataOcorrencia).toLocaleDateString("pt-BR")
                    : "-"}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold">{ocorrencia.classificacao}</span>
                    {ocorrencia.descricao && (
                      <span className="text-xs text-muted-foreground line-clamp-2">{ocorrencia.descricao}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {(() => {
                    const { label, variant } = severityBadge(ocorrencia.seriedade || "");
                    return <Badge variant={variant}>{label}</Badge>;
                  })()}
                </TableCell>
                <TableCell className="w-12 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => onRemove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remover</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="flex justify-end">
        <Button type="button" variant="outline" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar ocorrência
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl bg-[#0A0A0A] border-[#1A1A1A] text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
              Ocorrência
            </DialogTitle>
            <p className="text-sm text-muted-foreground">Informações Gerais</p>
          </DialogHeader>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="space-y-3 rounded-lg border border-[#1A1A1A] bg-[#0F0F0F] p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Info className="h-4 w-4 text-muted-foreground" />
                Dados Gerais
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Classificação (#1104)</label>
                  <EditableCombobox
                    value={form.classificacao}
                    onChange={(value) => setForm((prev) => ({ ...prev, classificacao: value }))}
                    options={classificacoes}
                    placeholder="Selecione ou digite"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Nível Seriedade (#1103)</label>
                  <EditableCombobox
                    value={form.seriedade}
                    onChange={(value) => setForm((prev) => ({ ...prev, seriedade: value }))}
                    options={seriedades}
                    placeholder="Selecione ou digite"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Data da Ocorrência</label>
                  <Input
                    type="date"
                    value={form.dataOcorrencia ? new Date(form.dataOcorrencia).toISOString().slice(0, 10) : ""}
                    onChange={(e) => {
                      if (!e.target.value) return;
                      setForm((prev) => ({ ...prev, dataOcorrencia: new Date(e.target.value) }));
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Registro de Ocorrência</label>
                  <Input
                    value={(form as any).registroOcorrencia || ""}
                    onChange={(e) => setForm((prev) => ({ ...prev, registroOcorrencia: e.target.value } as any))}
                    className="bg-[#0A0A0A] border-[#1A1A1A]"
                    placeholder="Informe o registro"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Descrição</label>
                <Textarea
                  value={form.descricao || ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, descricao: e.target.value }))}
                  className="bg-[#0A0A0A] border-[#1A1A1A]"
                  placeholder="Descreva a ocorrência"
                  rows={3}
                />
              </div>
            </div>

            <div className="space-y-3 rounded-lg border border-[#1A1A1A] bg-[#0F0F0F] p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Paperclip className="h-4 w-4 text-muted-foreground" />
                Anexo
              </div>
              <label className="block border border-dashed border-[#2A2A2A] rounded-lg p-6 text-center text-sm text-muted-foreground">
                Envie arquivos ou arraste aqui
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setForm((prev) => ({ ...prev, anexo: file.name }));
                  }}
                />
              </label>
              {form.anexo && (
                <div className="flex items-center gap-2 text-sm text-white">
                  <FileText className="h-4 w-4" /> {form.anexo}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="flex justify-between gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} className="border-[#1A1A1A] text-muted-foreground hover:bg-[#1A1A1A]">
              Fechar
            </Button>
            <Button onClick={handleSubmit} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Cadastrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
