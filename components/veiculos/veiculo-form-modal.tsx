"use client"

import { useState } from "react";
import { Car, Info, MoreVertical, X, ChevronDown, ChevronUp, List, Camera, FileText, AlertTriangle, Fuel } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { useTranslations } from "@/lib/translations";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { VeiculoFormDadosGerais } from "./veiculo-form-dados-gerais";
import { VeiculoFormDescricao } from "./veiculo-form-descricao";
import { VeiculoFormImagens } from "./veiculo-form-imagens";
import { VeiculoFormDocumentacao } from "./veiculo-form-documentacao";
import { VeiculoFormOcorrencia } from "./veiculo-form-ocorrencia";
import { VeiculoFormAbastecimento } from "./veiculo-form-abastecimento";
import type { Veiculo } from "@/lib/types/veiculo";

interface VeiculoFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (veiculo: Veiculo) => void;
}

export function VeiculoFormModal({
  open,
  onOpenChange,
  onSave,
}: VeiculoFormModalProps) {
  const { language } = useLanguage();
  const t = useTranslations(language);

  const [formData, setFormData] = useState<Partial<Veiculo>>({
    imagens: [],
    documentacoes: [],
    ocorrencias: [],
    abastecimentos: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [openSections, setOpenSections] = useState({
    dadosGerais: true,
    descricao: true,
    imagens: true,
    documentacao: true,
    ocorrencia: true,
    abastecimento: true,
  });

  const handleChange = (field: keyof Veiculo, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.identificador?.trim()) {
      newErrors.identificador = t("requiredField");
    }

    if (!formData.marca?.trim()) {
      newErrors.marca = t("requiredField");
    }

    if (!formData.placa?.trim()) {
      newErrors.placa = t("requiredField");
    }

    if (!formData.capacidade || formData.capacidade <= 0) {
      newErrors.capacidade = t("requiredField");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      return;
    }

    const novoVeiculo: Veiculo = {
      identificador: formData.identificador!,
      marca: formData.marca!,
      placa: formData.placa!,
      capacidade: formData.capacidade!,
      titulo: formData.titulo,
      modelo: formData.modelo,
      ano: formData.ano,
      tipoPlaca: formData.tipoPlaca,
      portas: formData.portas,
      renavam: formData.renavam,
      chassi: formData.chassi,
      revisaoKm: formData.revisaoKm,
      combustivel: formData.combustivel,
      estado: formData.estado,
      uf: formData.uf,
      companhia: formData.companhia,
      categoria: formData.categoria,
      classificacao: formData.classificacao,
      status: formData.status,
      caracteristicas: formData.caracteristicas,
      descricao: formData.descricao,
      criadoEm: new Date(),
      imagens: formData.imagens || [],
      documentacoes: formData.documentacoes || [],
      ocorrencias: formData.ocorrencias || [],
      abastecimentos: formData.abastecimentos || [],
    };

    onSave(novoVeiculo);
    handleClose(false);
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      setFormData({
        imagens: [],
        documentacoes: [],
        ocorrencias: [],
        abastecimentos: [],
      });
      setErrors({});
    }
    onOpenChange(open);
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={(open) => handleClose(open)}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Car className="h-5 w-5 text-muted-foreground" />
              <div>
                <DialogTitle className="text-xl font-semibold">
                  {t("vehicle")}
                </DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("generalInformation")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Info className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Seção 1: Dados Gerais */}
          <Collapsible
            open={openSections.dadosGerais}
            onOpenChange={() => toggleSection("dadosGerais")}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 border rounded-lg hover:bg-accent transition-colors">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{t("generalData")}</span>
              </div>
              {openSections.dadosGerais ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 border-x border-b rounded-b-lg">
              <VeiculoFormDadosGerais
                formData={formData}
                onChange={handleChange}
                errors={errors}
              />
            </CollapsibleContent>
          </Collapsible>

          {/* Seção 2: Descrição */}
          <Collapsible
            open={openSections.descricao}
            onOpenChange={() => toggleSection("descricao")}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 border rounded-lg hover:bg-accent transition-colors">
              <div className="flex items-center gap-2">
                <List className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{t("description")}</span>
              </div>
              {openSections.descricao ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 border-x border-b rounded-b-lg">
              <VeiculoFormDescricao
                formData={formData}
                onChange={handleChange}
              />
            </CollapsibleContent>
          </Collapsible>

          {/* Seção 3: Imagens */}
          <Collapsible
            open={openSections.imagens}
            onOpenChange={() => toggleSection("imagens")}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 border rounded-lg hover:bg-accent transition-colors">
              <div className="flex items-center gap-2">
                <Camera className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{t("vehicleImages")}</span>
              </div>
              {openSections.imagens ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 border-x border-b rounded-b-lg">
              <VeiculoFormImagens
                imagens={formData.imagens || []}
                onChange={(imagens) => handleChange("imagens", imagens)}
              />
            </CollapsibleContent>
          </Collapsible>

          {/* Seção 4: Documentação */}
          <Collapsible
            open={openSections.documentacao}
            onOpenChange={() => toggleSection("documentacao")}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 border rounded-lg hover:bg-accent transition-colors">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{t("documentation")}</span>
              </div>
              {openSections.documentacao ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 border-x border-b rounded-b-lg">
              <VeiculoFormDocumentacao
                documentacoes={formData.documentacoes || []}
                onAdd={() => {
                  // TODO: Abrir modal de adicionar documentação
                  console.log("Adicionar documentação");
                }}
              />
            </CollapsibleContent>
          </Collapsible>

          {/* Seção 5: Ocorrência */}
          <Collapsible
            open={openSections.ocorrencia}
            onOpenChange={() => toggleSection("ocorrencia")}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 border rounded-lg hover:bg-accent transition-colors">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{t("occurrence")}</span>
              </div>
              {openSections.ocorrencia ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 border-x border-b rounded-b-lg">
              <VeiculoFormOcorrencia
                ocorrencias={formData.ocorrencias || []}
                onAdd={() => {
                  // TODO: Abrir modal de adicionar ocorrência
                  console.log("Adicionar ocorrência");
                }}
              />
            </CollapsibleContent>
          </Collapsible>

          {/* Seção 6: Abastecimento */}
          <Collapsible
            open={openSections.abastecimento}
            onOpenChange={() => toggleSection("abastecimento")}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 border rounded-lg hover:bg-accent transition-colors">
              <div className="flex items-center gap-2">
                <Fuel className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{t("refueling")}</span>
              </div>
              {openSections.abastecimento ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 border-x border-b rounded-b-lg">
              <VeiculoFormAbastecimento
                abastecimentos={formData.abastecimentos || []}
                onAdd={() => {
                  // TODO: Abrir modal de adicionar abastecimento
                  console.log("Adicionar abastecimento");
                }}
              />
            </CollapsibleContent>
          </Collapsible>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)}>
            {t("close")}
          </Button>
          <Button onClick={handleSave}>
            {t("register")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

