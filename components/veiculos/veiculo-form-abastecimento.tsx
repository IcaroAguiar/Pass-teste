"use client"

import React from "react";
import { Fuel, Plus, AlertCircle, FileText, Upload, X } from "lucide-react";
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
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Abastecimento } from "@/lib/types/veiculo";

interface VeiculoFormAbastecimentoProps {
  abastecimentos: Abastecimento[];
  onAdd: (abastecimento: Abastecimento) => void;
}

export function VeiculoFormAbastecimento({
  abastecimentos,
  onAdd,
}: VeiculoFormAbastecimentoProps) {
  const { language } = useLanguage();
  const t = useTranslations(language);

  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState<Abastecimento>({
    dataAbastecimento: new Date(),
    fornecedor: "",
    combustivel: "",
    litros: 0,
    valor: 0,
    kmRevisao: undefined,
    kmParada: undefined,
    comprovante: "",
  });

  const combustiveis = ["Diesel", "Gasolina", "Etanol", "GNV", "Elétrico"];

  const totalLitros = abastecimentos.reduce((sum, ab) => sum + (ab.litros || 0), 0);
  const totalValor = abastecimentos.reduce((sum, ab) => sum + (ab.valor || 0), 0);

  const resetForm = () =>
    setForm({
      dataAbastecimento: new Date(),
      fornecedor: "",
      combustivel: "",
      litros: 0,
      valor: 0,
      kmRevisao: undefined,
      kmParada: undefined,
      comprovante: "",
    });

  const handleSubmit = () => {
    if (!form.fornecedor || !form.combustivel || !form.dataAbastecimento) return;
    onAdd(form);
    resetForm();
    setOpen(false);
  };

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
        <Button type="button" variant="outline" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {t("addVehicle")}
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
              <Fuel className="h-5 w-5" /> Abastecimento
            </DialogTitle>
            <p className="text-sm text-muted-foreground">Dados Gerais</p>
          </DialogHeader>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="rounded-lg border bg-card p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Posto de Combustível (#18098)</Label>
                  <Input
                    value={form.fornecedor}
                    onChange={(e) => setForm((prev) => ({ ...prev, fornecedor: e.target.value }))}
                    placeholder="Informe o posto"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Combustível (#1337)</Label>
                  <Input
                    list="combustiveis-ab"
                    value={form.combustivel}
                    onChange={(e) => setForm((prev) => ({ ...prev, combustivel: e.target.value }))}
                    placeholder="Selecione ou digite"
                  />
                  <datalist id="combustiveis-ab">
                    {combustiveis.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>
                <div className="space-y-2">
                  <Label>KM para Revisão</Label>
                  <Input
                    type="number"
                    value={form.kmRevisao ?? ""}
                    onChange={(e) => setForm((prev) => ({ ...prev, kmRevisao: e.target.value ? Number(e.target.value) : undefined }))}
                    placeholder="Ex: 30000"
                  />
                </div>
                <div className="space-y-2">
                  <Label>KM de Parada</Label>
                  <Input
                    type="number"
                    value={form.kmParada ?? ""}
                    onChange={(e) => setForm((prev) => ({ ...prev, kmParada: e.target.value ? Number(e.target.value) : undefined }))}
                    placeholder="Informe o KM"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Quantidade de Litros</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={form.litros}
                    onChange={(e) => setForm((prev) => ({ ...prev, litros: Number(e.target.value) || 0 }))}
                    placeholder="0,00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Valor Total</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={form.valor}
                    onChange={(e) => setForm((prev) => ({ ...prev, valor: Number(e.target.value) || 0 }))}
                    placeholder="0,00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Data de Abastecimento</Label>
                  <Input
                    type="date"
                    value={form.dataAbastecimento.toISOString().slice(0, 10)}
                    onChange={(e) => {
                      if (!e.target.value) return;
                      setForm((prev) => ({ ...prev, dataAbastecimento: new Date(e.target.value) }));
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <FileText className="h-4 w-4" /> Comprovante
              </div>
              <label className="block border border-dashed rounded-lg p-6 text-center text-sm text-muted-foreground">
                Envie arquivos ou arraste aqui
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setForm((prev) => ({ ...prev, comprovante: file.name }));
                  }}
                />
              </label>
              {form.comprovante && (
                <div className="flex items-center justify-between text-sm">
                  <span>{form.comprovante}</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setForm((prev) => ({ ...prev, comprovante: "" }))}>
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
