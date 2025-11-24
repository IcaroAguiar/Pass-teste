"use client"

import { useEffect, useMemo, useState } from "react";
import { Car, Camera, FileText, AlertTriangle, Fuel, Hash, CarFront, Wrench, FileCheck, ChevronRight, Tag } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EditableCombobox } from "@/components/ui/editable-combobox";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { VeiculoFormDescricao } from "./veiculo-form-descricao";
import { VeiculoFormImagens } from "./veiculo-form-imagens";
import { VeiculoFormDocumentacao } from "./veiculo-form-documentacao";
import { VeiculoFormOcorrencia } from "./veiculo-form-ocorrencia";
import { VeiculoFormAbastecimento } from "./veiculo-form-abastecimento";
import type { Veiculo, Documentacao, Ocorrencia } from "@/lib/types/veiculo";
import type { Abastecimento } from "@/lib/types/veiculo";

interface VeiculoFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (veiculo: Veiculo) => Promise<void> | void;
  onDelete?: (id: string) => Promise<void> | void;
  mode?: "create" | "edit";
  veiculo?: Veiculo;
}

export function VeiculoFormModal({
  open,
  onOpenChange,
  onSave,
  onDelete,
  mode = "create",
  veiculo,
}: VeiculoFormModalProps) {
  const { language } = useLanguage();
  const t = useTranslations(language);

  const marcas = ["Mercedes-Benz", "Volvo", "Scania", "Volkswagen", "Iveco", "Busscar"];
  const categorias = ["Ônibus", "Van", "Micro-ônibus", "Minivan"];
  const classificacoes = ["Premium", "Executivo", "Standard", "Econômico"];
  const statusOptions = ["Liberado", "Ocupado", "Manutenção"];
  const tiposPlaca = ["Mercosul", "Antiga"];
  const combustiveis = ["Diesel", "Gasolina", "Etanol", "GNV", "Elétrico"];
  const ufs = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];

  const sampleDocumentacoes: Documentacao[] = useMemo(
    () => [
      {
        documento: "Tacógrafo",
        tipo: "Tacógrafo",
        vencimento: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45),
        antecipacao: true,
        dias: 15,
      },
      {
        documento: "CRLV 2025",
        tipo: "Licenciamento",
        vencimento: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
        antecipacao: false,
        dias: undefined,
      },
    ],
    []
  );

  const sampleOcorrencias: Ocorrencia[] = useMemo(
    () => [
      {
        dataOcorrencia: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20),
        classificacao: "Colisão lateral",
        seriedade: "Alta",
        descricao: "Dano superficial na porta traseira esquerda durante manobra em garagem.",
        anexo: undefined,
      },
      {
        dataOcorrencia: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
        classificacao: "Reclamação passageiro",
        seriedade: "Média",
        descricao: "Atraso de 10 minutos no embarque causado por tráfego intenso.",
        anexo: undefined,
      },
    ],
    []
  );

  const sampleAbastecimentos: Abastecimento[] = useMemo(
    () => [
      {
        dataAbastecimento: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        fornecedor: "Posto Atlântico",
        combustivel: "Diesel",
        litros: 45.5,
        valor: 389.9,
        kmRevisao: 28000,
        kmParada: 27500,
        comprovante: "nota-123.pdf",
      },
      {
        dataAbastecimento: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12),
        fornecedor: "Shell BR-101",
        combustivel: "GNV",
        litros: 30,
        valor: 210.0,
        kmRevisao: 30000,
        kmParada: 26800,
        comprovante: "cupom-987.jpg",
      },
    ],
    []
  );

  const formatPlaca = (value: string) => {
    const clean = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (clean.length <= 3) return clean;
    return `${clean.slice(0,3)}-${clean.slice(3,7)}`.slice(0,8);
  };

  const formatRenavam = (value: string) => value.replace(/\D/g, "").slice(0,11);
  const formatChassi = (value: string) => value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0,17);
  const formatKm = (value: string) => value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  const emptyForm: Partial<Veiculo> = useMemo(() => ({
    imagens: [],
    documentacoes: [],
    ocorrencias: [],
    abastecimentos: [],
  }), []);

  const [formData, setFormData] = useState<Partial<Veiculo>>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState("informacoes");

  const normalizeArrays = (data?: Partial<Veiculo>): Partial<Veiculo> => ({
    ...(data || {}),
    imagens: Array.isArray(data?.imagens) ? data?.imagens : [],
    documentacoes: Array.isArray(data?.documentacoes) ? data?.documentacoes : [],
    ocorrencias: Array.isArray(data?.ocorrencias) ? data?.ocorrencias : [],
    abastecimentos: Array.isArray(data?.abastecimentos) ? data?.abastecimentos : [],
  });

  useEffect(() => {
    if (open) {
      const base = veiculo
        ? normalizeArrays(veiculo)
        : {
            ...emptyForm,
            documentacoes: sampleDocumentacoes,
            ocorrencias: sampleOcorrencias,
            abastecimentos: sampleAbastecimentos,
          };
      setFormData(base);
      setErrors({});
      setActiveTab("informacoes");
    }
  }, [open, veiculo, emptyForm, sampleDocumentacoes, sampleOcorrencias, sampleAbastecimentos]);

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

  const tabs = ["informacoes", "documentacao", "detalhes", "imagens-documentos", "ocorrencias", "abastecimentos"];
  const isLastTab = activeTab === tabs[tabs.length - 1];

  const handleContinue = async () => {
    if (isLastTab) {
      // Na última aba, validar e salvar
    if (!validate()) {
      return;
    }

    const payload: Veiculo = {
      ...(veiculo || {}),
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
      criadoEm: veiculo?.criadoEm || formData.criadoEm || new Date(),
      imagens: formData.imagens || [],
      documentacoes: formData.documentacoes || [],
      ocorrencias: formData.ocorrencias || [],
      abastecimentos: formData.abastecimentos || [],
    };

    await onSave(payload);
    handleClose(false);
    } else {
      // Nas outras abas, avançar para a próxima
      const currentIndex = tabs.indexOf(activeTab);
      if (currentIndex < tabs.length - 1) {
        setActiveTab(tabs[currentIndex + 1]);
      }
    }
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      setFormData(veiculo ? normalizeArrays(veiculo) : emptyForm);
      setErrors({});
      setActiveTab("informacoes");
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => handleClose(open)}>
      <DialogContent className="max-w-4xl max-h-[70vh] h-auto flex flex-col p-0 bg-[#0A0A0A] border-[#1A1A1A]">
        {/* Header fixo */}
        <DialogHeader className="border-b border-[#1A1A1A] pb-3 px-6 pt-4 shrink-0 bg-[#0A0A0A]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Car className="h-5 w-5 text-muted-foreground" />
              <div>
                <DialogTitle className="text-xl font-semibold text-white">
                  {mode === "edit" ? "Editar veículo" : t("vehicle")}
                </DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {mode === "edit" && (veiculo?.titulo || veiculo?.identificador)
                    ? veiculo?.titulo || veiculo?.identificador
                    : "Gerencie informações do veículo"}
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Área de conteúdo com abas */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#0A0A0A]">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
            {/* Barra de abas */}
            <div className="border-b border-[#1A1A1A] px-6 shrink-0 bg-[#0A0A0A]">
              <TabsList className="w-full justify-start h-auto bg-transparent p-0">
                <TabsTrigger 
                  value="informacoes" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none text-muted-foreground data-[state=active]:text-white px-4 py-2"
                >
                  Informações
                </TabsTrigger>
                <TabsTrigger 
                  value="documentacao" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none text-muted-foreground data-[state=active]:text-white px-4 py-2"
                >
                  Documentação
                </TabsTrigger>
                <TabsTrigger 
                  value="detalhes" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none text-muted-foreground data-[state=active]:text-white px-4 py-2"
                >
                  Detalhes
                </TabsTrigger>
                <TabsTrigger 
                  value="imagens-documentos" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none text-muted-foreground data-[state=active]:text-white px-4 py-2"
                >
                  Imagens & Documentos
                </TabsTrigger>
                <TabsTrigger 
                  value="ocorrencias" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none text-muted-foreground data-[state=active]:text-white px-4 py-2"
                >
                  {t("occurrence")}
                </TabsTrigger>
                <TabsTrigger 
                  value="abastecimentos" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none text-muted-foreground data-[state=active]:text-white px-4 py-2"
                >
                  {t("refueling")}
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Área de conteúdo com scroll */}
            <div className="flex-1 overflow-y-auto px-6 py-4 bg-[#0A0A0A]">
              {/* Aba 1: Informações */}
              <TabsContent value="informacoes" className="mt-0 space-y-3">
                {/* Seção: Identificação */}
                <div className="space-y-3 p-3 rounded-lg border border-[#1A1A1A] bg-[#0F0F0F]">
                  <div className="flex items-center gap-2 mb-3">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold text-white">Identificação</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="id" className="text-muted-foreground">{t("id")}</Label>
                      <Input
                        id="id"
                        value={formData.id || ""}
                        readOnly
                        disabled
                        className="bg-[#1A1A1A] border-[#1A1A1A] text-muted-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="criadoEm" className="text-muted-foreground">{t("createdOn")}</Label>
                      <Input
                        id="criadoEm"
                        value={formData.criadoEm ? new Date(formData.criadoEm).toLocaleString("pt-BR") : ""}
                        readOnly
                        disabled
                        className="bg-[#1A1A1A] border-[#1A1A1A] text-muted-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="identificador" className="text-muted-foreground">
                        {t("identifier")} <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="identificador"
                        value={formData.identificador || ""}
                        onChange={(e) => handleChange("identificador", e.target.value)}
                        className={errors?.identificador ? "border-destructive" : "bg-[#0A0A0A] border-[#1A1A1A] text-white"}
                      />
                      {errors?.identificador && (
                        <p className="text-sm text-destructive">{errors.identificador}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companhia" className="text-muted-foreground">{t("company")}</Label>
                      <EditableCombobox
                        value={formData.companhia || ""}
                        onChange={(value) => handleChange("companhia", value)}
                        options={["Inbuzios Receptivo", "Pass Transportes"]}
                        placeholder="Digite ou selecione"
                        className="bg-[#0A0A0A] border-[#1A1A1A] text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status" className="text-muted-foreground">{t("status")}</Label>
                      <EditableCombobox
                        value={formData.status || ""}
                        onChange={(value) => handleChange("status", value)}
                        options={statusOptions}
                        placeholder="Digite ou selecione"
                        className="bg-[#0A0A0A] border-[#1A1A1A] text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Seção: Informações do Veículo */}
                <div className="space-y-3 p-3 rounded-lg border border-[#1A1A1A] bg-[#0F0F0F]">
                  <div className="flex items-center gap-2 mb-3">
                    <CarFront className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold text-white">Informações do Veículo</h3>
              </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="marca" className="text-muted-foreground">
                        {t("brand")} <span className="text-destructive">*</span>
                      </Label>
                      <EditableCombobox
                        value={formData.marca || ""}
                        onChange={(value) => handleChange("marca", value)}
                        options={marcas}
                        placeholder="Digite ou selecione"
                        className={errors?.marca ? "border-destructive bg-[#0A0A0A] border-[#1A1A1A] text-white" : "bg-[#0A0A0A] border-[#1A1A1A] text-white"}
                      />
                      {errors?.marca && (
                        <p className="text-sm text-destructive">{errors.marca}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="modelo" className="text-muted-foreground">{t("model")}</Label>
                      <Input
                        id="modelo"
                        value={formData.modelo || ""}
                        onChange={(e) => handleChange("modelo", e.target.value)}
                        className="bg-[#0A0A0A] border-[#1A1A1A] text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ano" className="text-muted-foreground">{t("year")}</Label>
                      <Input
                        id="ano"
                        type="number"
                        value={formData.ano || ""}
                        onChange={(e) => handleChange("ano", parseInt(e.target.value) || undefined)}
                        className="bg-[#0A0A0A] border-[#1A1A1A] text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="categoria" className="text-muted-foreground">{t("category")}</Label>
                      <EditableCombobox
                        value={formData.categoria || ""}
                        onChange={(value) => handleChange("categoria", value)}
                        options={categorias}
                        placeholder="Digite ou selecione"
                        className="bg-[#0A0A0A] border-[#1A1A1A] text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="classificacao" className="text-muted-foreground">{t("classification")}</Label>
                      <EditableCombobox
                        value={formData.classificacao || ""}
                        onChange={(value) => handleChange("classificacao", value)}
                        options={classificacoes}
                        placeholder="Digite ou selecione"
                        className="bg-[#0A0A0A] border-[#1A1A1A] text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="capacidade" className="text-muted-foreground">
                        {t("capacity")} <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="capacidade"
                        type="number"
                        value={formData.capacidade || ""}
                        onChange={(e) => handleChange("capacidade", parseInt(e.target.value) || 0)}
                        className={errors?.capacidade ? "border-destructive bg-[#0A0A0A] border-[#1A1A1A] text-white" : "bg-[#0A0A0A] border-[#1A1A1A] text-white"}
                      />
                      {errors?.capacidade && (
                        <p className="text-sm text-destructive">{errors.capacidade}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="portas" className="text-muted-foreground">{t("doors")}</Label>
                      <Input
                        id="portas"
                        type="number"
                        value={formData.portas || ""}
                        onChange={(e) => handleChange("portas", parseInt(e.target.value) || undefined)}
                        className="bg-[#0A0A0A] border-[#1A1A1A] text-white"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Aba 2: Documentação */}
              <TabsContent value="documentacao" className="mt-0 space-y-3">
                {/* Seção: Documentação Veicular */}
                <div className="space-y-3 p-3 rounded-lg border border-[#1A1A1A] bg-[#0F0F0F]">
                  <div className="flex items-center gap-2 mb-3">
                    <FileCheck className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold text-white">Documentação Veicular</h3>
              </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="placa" className="text-muted-foreground">
                        {t("plate")} <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="placa"
                        value={formData.placa || ""}
                        onChange={(e) => handleChange("placa", formatPlaca(e.target.value))}
                        className={errors?.placa ? "border-destructive bg-[#0A0A0A] border-[#1A1A1A] text-white" : "bg-[#0A0A0A] border-[#1A1A1A] text-white"}
                        maxLength={8}
                        placeholder="AAA-0A00"
                      />
                      {errors?.placa && (
                        <p className="text-sm text-destructive">{errors.placa}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tipoPlaca" className="text-muted-foreground">{t("licensePlateType")}</Label>
                      <EditableCombobox
                        value={formData.tipoPlaca || ""}
                        onChange={(value) => handleChange("tipoPlaca", value)}
                        options={tiposPlaca}
                        placeholder="Digite ou selecione"
                        className="bg-[#0A0A0A] border-[#1A1A1A] text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="renavam" className="text-muted-foreground">{t("renavam")}</Label>
                      <Input
                        id="renavam"
                        value={formData.renavam || ""}
                        onChange={(e) => handleChange("renavam", formatRenavam(e.target.value))}
                        className="bg-[#0A0A0A] border-[#1A1A1A] text-white"
                        placeholder="Somente números"
                        inputMode="numeric"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="chassi" className="text-muted-foreground">{t("chassis")}</Label>
                      <Input
                        id="chassi"
                        value={formData.chassi || ""}
                        onChange={(e) => handleChange("chassi", formatChassi(e.target.value))}
                        className="bg-[#0A0A0A] border-[#1A1A1A] text-white"
                        placeholder="17 caracteres"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="uf" className="text-muted-foreground">{t("state")}</Label>
                      <EditableCombobox
                        value={formData.uf || ""}
                        onChange={(value) => handleChange("uf", value.toUpperCase())}
                        options={ufs}
                        placeholder="Digite ou selecione"
                        className="bg-[#0A0A0A] border-[#1A1A1A] text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Seção: Manutenção e Combustível */}
                <div className="space-y-3 p-3 rounded-lg border border-[#1A1A1A] bg-[#0F0F0F]">
                  <div className="flex items-center gap-2 mb-3">
                    <Wrench className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold text-white">Manutenção e Combustível</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="revisaoKm" className="text-muted-foreground">{t("revisionKm")}</Label>
                      <Input
                        id="revisaoKm"
                        value={formData.revisaoKm || ""}
                        onChange={(e) => handleChange("revisaoKm", formatKm(e.target.value))}
                        placeholder="000.000"
                        className="bg-[#0A0A0A] border-[#1A1A1A] text-white"
                        inputMode="numeric"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="combustivel" className="text-muted-foreground">{t("fuel")}</Label>
                      <EditableCombobox
                        value={formData.combustivel || ""}
                        onChange={(value) => handleChange("combustivel", value)}
                        options={combustiveis}
                        placeholder="Digite ou selecione"
                        className="bg-[#0A0A0A] border-[#1A1A1A] text-white"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Aba 3: Detalhes */}
              <TabsContent value="detalhes" className="mt-0 space-y-3">
                {/* Seção: Características */}
                <div className="space-y-3 p-3 rounded-lg border border-[#1A1A1A] bg-[#0F0F0F]">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold text-white">{t("characteristics")}</h3>
                  </div>
                  <div className="space-y-2">
                    <Input
                      id="caracteristicas"
                      value={formData.caracteristicas || ""}
                      onChange={(e) => handleChange("caracteristicas", e.target.value)}
                      placeholder="Digite as características do veículo"
                      className="bg-[#0A0A0A] border-[#1A1A1A] text-white"
                    />
                  </div>
                </div>
                
                {/* Seção: Descrição */}
                <div className="space-y-3 p-3 rounded-lg border border-[#1A1A1A] bg-[#0F0F0F]">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold text-white">{t("description")}</h3>
                  </div>
              <VeiculoFormDescricao
                formData={formData}
                onChange={handleChange}
              />
                </div>
              </TabsContent>

              {/* Aba 2: Imagens & Documentos */}
              <TabsContent value="imagens-documentos" className="mt-0 space-y-3">
                {/* Seção: Imagens */}
                <div className="space-y-3 p-3 rounded-lg border border-[#1A1A1A] bg-[#0F0F0F]">
                  <div className="flex items-center gap-2 mb-3">
                <Camera className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold text-white">{t("vehicleImages")}</h3>
              </div>
              <VeiculoFormImagens
                imagens={formData.imagens || []}
                onChange={(imagens) => handleChange("imagens", imagens)}
              />
                </div>
                
                {/* Seção: Documentação */}
                <div className="space-y-3 p-3 rounded-lg border border-[#1A1A1A] bg-[#0F0F0F]">
                  <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold text-white">{t("documentation")}</h3>
              </div>
              <VeiculoFormDocumentacao
                documentacoes={formData.documentacoes || []}
                onAdd={() => {
                  const novaDoc: Documentacao = {
                    documento: "Tacografo",
                    tipo: "Tacografo",
                    vencimento: new Date(),
                    antecipacao: false,
                    dias: undefined,
                  };
                  handleChange("documentacoes", [...(formData.documentacoes || []), novaDoc]);
                }}
                onRemove={(idx) => {
                  const next = [...(formData.documentacoes || [])];
                  next.splice(idx, 1);
                  handleChange("documentacoes", next);
                }}
                onToggleAntecipacao={(idx) => {
                  const next = [...(formData.documentacoes || [])];
                  next[idx] = {
                    ...next[idx],
                    antecipacao: !next[idx].antecipacao,
                  };
                  handleChange("documentacoes", next);
                }}
              />
                </div>
              </TabsContent>

              {/* Aba 3: Ocorrências */}
              <TabsContent value="ocorrencias" className="mt-0">
                <div className="space-y-3 p-3 rounded-lg border border-[#1A1A1A] bg-[#0F0F0F]">
                  <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold text-white">{t("occurrence")}</h3>
              </div>
              <VeiculoFormOcorrencia
                ocorrencias={formData.ocorrencias || []}
                onAdd={() => {
                  const novaOcorrencia: Ocorrencia = {
                    dataOcorrencia: new Date(),
                    classificacao: "Classificação",
                    seriedade: "Alta",
                    descricao: "",
                  };
                  handleChange("ocorrencias", [...(formData.ocorrencias || []), novaOcorrencia]);
                }}
                onRemove={(idx) => {
                  const next = [...(formData.ocorrencias || [])];
                  next.splice(idx, 1);
                  handleChange("ocorrencias", next);
                }}
              />
                </div>
              </TabsContent>

              {/* Aba 4: Abastecimentos */}
              <TabsContent value="abastecimentos" className="mt-0">
                <div className="space-y-3 p-3 rounded-lg border border-[#1A1A1A] bg-[#0F0F0F]">
                  <div className="flex items-center gap-2 mb-3">
                <Fuel className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold text-white">{t("refueling")}</h3>
              </div>
              <VeiculoFormAbastecimento
                abastecimentos={formData.abastecimentos || []}
                onAdd={(ab) => {
                  handleChange("abastecimentos", [...(formData.abastecimentos || []), ab]);
                }}
                onRemove={(idx) => {
                  const next = [...(formData.abastecimentos || [])];
                  next.splice(idx, 1);
                  handleChange("abastecimentos", next);
                }}
              />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Footer fixo */}
        <DialogFooter className="border-t border-[#1A1A1A] px-6 py-3 shrink-0 bg-[#0A0A0A]">
          {mode === "edit" && veiculo?.id && onDelete && (
            <Button
              type="button"
              variant="outline"
              className="border-[#1A1A1A] text-destructive hover:text-destructive hover:bg-[#1A1A1A]"
              onClick={() => onDelete(veiculo.id!)}
            >
              Excluir
            </Button>
          )}
          <div className="ml-auto flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => handleClose(false)}
              className="border-[#1A1A1A] text-muted-foreground hover:bg-[#1A1A1A] hover:text-white"
            >
              {t("close")}
            </Button>
            <Button 
              onClick={handleContinue}
              className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
            >
              {isLastTab ? (mode === "edit" ? "Salvar" : t("register")) : "Continuar"}
              {!isLastTab && <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
