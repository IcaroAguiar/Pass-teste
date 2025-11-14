"use client"

import { useLanguage } from "@/components/language-provider";
import { useTranslations } from "@/lib/translations";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { Veiculo } from "@/lib/types/veiculo";

interface VeiculoFormDadosGeraisProps {
  formData: Partial<Veiculo>;
  onChange: (field: keyof Veiculo, value: any) => void;
  errors?: Record<string, string>;
}

export function VeiculoFormDadosGerais({
  formData,
  onChange,
  errors,
}: VeiculoFormDadosGeraisProps) {
  const { language } = useLanguage();
  const t = useTranslations(language);

  const marcas = ["Mercedes-Benz", "Volvo", "Scania", "Volkswagen", "Iveco", "Busscar"];
  const categorias = ["Ônibus", "Van", "Micro-ônibus", "Minivan"];
  const classificacoes = ["Premium", "Executivo", "Standard", "Econômico"];
  const statusOptions = ["Liberado", "Ocupado", "Manutenção"];
  const tiposPlaca = ["Mercosul", "Antiga"];
  const combustiveis = ["Diesel", "Gasolina", "Etanol", "GNV", "Elétrico"];
  const estados = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* ID - Readonly */}
        <div className="space-y-2">
          <Label htmlFor="id">{t("id")}</Label>
          <Input
            id="id"
            value={formData.id || ""}
            readOnly
            disabled
            className="bg-muted"
          />
        </div>

        {/* Criado em - Readonly */}
        <div className="space-y-2">
          <Label htmlFor="criadoEm">{t("createdOn")}</Label>
          <Input
            id="criadoEm"
            value={formData.criadoEm ? new Date(formData.criadoEm).toLocaleString("pt-BR") : ""}
            readOnly
            disabled
            className="bg-muted"
          />
        </div>

        {/* Identificador - Obrigatório */}
        <div className="space-y-2">
          <Label htmlFor="identificador">
            {t("identifier")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="identificador"
            value={formData.identificador || ""}
            onChange={(e) => onChange("identificador", e.target.value)}
            className={errors?.identificador ? "border-destructive" : ""}
          />
          {errors?.identificador && (
            <p className="text-sm text-destructive">{errors.identificador}</p>
          )}
        </div>

        {/* Companhia */}
        <div className="space-y-2">
          <Label htmlFor="companhia">{t("company")} (#180461)</Label>
          <Select
            value={formData.companhia || ""}
            onValueChange={(value) => onChange("companhia", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a companhia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inbuzios">Inbuzios Receptivo</SelectItem>
              <SelectItem value="pass">Pass Transportes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status">{t("status")} (#180451)</Label>
          <Select
            value={formData.status || ""}
            onValueChange={(value) => onChange("status", value as Veiculo["status"])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Modelo */}
        <div className="space-y-2">
          <Label htmlFor="modelo">{t("model")}</Label>
          <Input
            id="modelo"
            value={formData.modelo || ""}
            onChange={(e) => onChange("modelo", e.target.value)}
          />
        </div>

        {/* Ano */}
        <div className="space-y-2">
          <Label htmlFor="ano">{t("year")}</Label>
          <Input
            id="ano"
            type="number"
            value={formData.ano || ""}
            onChange={(e) => onChange("ano", parseInt(e.target.value) || undefined)}
          />
        </div>

        {/* Marca - Obrigatório */}
        <div className="space-y-2">
          <Label htmlFor="marca">
            {t("brand")} (#1034) <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.marca || ""}
            onValueChange={(value) => onChange("marca", value)}
          >
            <SelectTrigger className={errors?.marca ? "border-destructive" : ""}>
              <SelectValue placeholder="Selecione a marca" />
            </SelectTrigger>
            <SelectContent>
              {marcas.map((marca) => (
                <SelectItem key={marca} value={marca}>
                  {marca}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.marca && (
            <p className="text-sm text-destructive">{errors.marca}</p>
          )}
        </div>

        {/* Categoria */}
        <div className="space-y-2">
          <Label htmlFor="categoria">{t("category")} (#1106)</Label>
          <Select
            value={formData.categoria || ""}
            onValueChange={(value) => onChange("categoria", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a categoria" />
            </SelectTrigger>
            <SelectContent>
              {categorias.map((categoria) => (
                <SelectItem key={categoria} value={categoria}>
                  {categoria}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Classificação */}
        <div className="space-y-2">
          <Label htmlFor="classificacao">{t("classification")} (#1105)</Label>
          <Select
            value={formData.classificacao || ""}
            onValueChange={(value) => onChange("classificacao", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a classificação" />
            </SelectTrigger>
            <SelectContent>
              {classificacoes.map((classificacao) => (
                <SelectItem key={classificacao} value={classificacao}>
                  {classificacao}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Capacidade - Obrigatório */}
        <div className="space-y-2">
          <Label htmlFor="capacidade">
            {t("capacity")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="capacidade"
            type="number"
            value={formData.capacidade || ""}
            onChange={(e) => onChange("capacidade", parseInt(e.target.value) || 0)}
            className={errors?.capacidade ? "border-destructive" : ""}
          />
          {errors?.capacidade && (
            <p className="text-sm text-destructive">{errors.capacidade}</p>
          )}
        </div>

        {/* Portas */}
        <div className="space-y-2">
          <Label htmlFor="portas">{t("doors")}</Label>
          <Input
            id="portas"
            type="number"
            value={formData.portas || ""}
            onChange={(e) => onChange("portas", parseInt(e.target.value) || undefined)}
          />
        </div>

        {/* Buscar Estado */}
        <div className="space-y-2">
          <Label htmlFor="buscarEstado">{t("searchState")}</Label>
          <Input
            id="buscarEstado"
            placeholder="Buscar estado..."
          />
        </div>

        {/* UF */}
        <div className="space-y-2">
          <Label htmlFor="uf">{t("state")}</Label>
          <Select
            value={formData.uf || ""}
            onValueChange={(value) => onChange("uf", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o estado" />
            </SelectTrigger>
            <SelectContent>
              {estados.map((estado) => (
                <SelectItem key={estado} value={estado}>
                  {estado}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tipo de Placa */}
        <div className="space-y-2">
          <Label htmlFor="tipoPlaca">{t("licensePlateType")}</Label>
          <Select
            value={formData.tipoPlaca || ""}
            onValueChange={(value) => onChange("tipoPlaca", value as Veiculo["tipoPlaca"])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              {tiposPlaca.map((tipo) => (
                <SelectItem key={tipo} value={tipo}>
                  {tipo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Placa - Obrigatório */}
        <div className="space-y-2">
          <Label htmlFor="placa">
            {t("plate")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="placa"
            value={formData.placa || ""}
            onChange={(e) => onChange("placa", e.target.value.toUpperCase())}
            className={errors?.placa ? "border-destructive" : ""}
            maxLength={8}
          />
          {errors?.placa && (
            <p className="text-sm text-destructive">{errors.placa}</p>
          )}
        </div>

        {/* Renavam */}
        <div className="space-y-2">
          <Label htmlFor="renavam">{t("renavam")}</Label>
          <Input
            id="renavam"
            value={formData.renavam || ""}
            onChange={(e) => onChange("renavam", e.target.value)}
          />
        </div>

        {/* Chassi */}
        <div className="space-y-2">
          <Label htmlFor="chassi">{t("chassis")}</Label>
          <Input
            id="chassi"
            value={formData.chassi || ""}
            onChange={(e) => onChange("chassi", e.target.value)}
          />
        </div>

        {/* Revisão (Km) */}
        <div className="space-y-2">
          <Label htmlFor="revisaoKm">{t("revisionKm")}</Label>
          <Input
            id="revisaoKm"
            value={formData.revisaoKm || ""}
            onChange={(e) => onChange("revisaoKm", e.target.value)}
            placeholder="000.000"
          />
        </div>

        {/* Combustível */}
        <div className="space-y-2">
          <Label htmlFor="combustivel">{t("fuel")} (#1337)</Label>
          <Select
            value={formData.combustivel || ""}
            onValueChange={(value) => onChange("combustivel", value as Veiculo["combustivel"])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o combustível" />
            </SelectTrigger>
            <SelectContent>
              {combustiveis.map((combustivel) => (
                <SelectItem key={combustivel} value={combustivel}>
                  {combustivel}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Características */}
      <div className="space-y-2">
        <Label htmlFor="caracteristicas">{t("characteristics")} (#180471)</Label>
        <Input
          id="caracteristicas"
          value={formData.caracteristicas || ""}
          onChange={(e) => onChange("caracteristicas", e.target.value)}
          placeholder="Digite as características do veículo"
        />
      </div>
    </div>
  );
}

