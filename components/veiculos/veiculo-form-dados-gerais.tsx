"use client"

import { useLanguage } from "@/components/language-provider";
import { useTranslations } from "@/lib/translations";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

  const formatPlaca = (value: string) => {
    const clean = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (clean.length <= 3) return clean;
    return `${clean.slice(0,3)}-${clean.slice(3,7)}`.slice(0,8);
  };

  const formatRenavam = (value: string) => value.replace(/\D/g, "").slice(0,11);

  const formatChassi = (value: string) => value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0,17);

  const formatKm = (value: string) => {
    const digits = value.replace(/\D/g, "");
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

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
          <Input
            id="companhia"
            list="companhias-sugeridas"
            value={formData.companhia || ""}
            placeholder="Digite ou selecione"
            onChange={(e) => onChange("companhia", e.target.value)}
          />
          <datalist id="companhias-sugeridas">
            <option value="Inbuzios Receptivo" />
            <option value="Pass Transportes" />
          </datalist>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status">{t("status")} (#180451)</Label>
          <Input
            id="status"
            list="status-sugeridos"
            value={formData.status || ""}
            placeholder="Digite ou selecione"
            onChange={(e) => onChange("status", e.target.value as Veiculo["status"])}
          />
          <datalist id="status-sugeridos">
            {statusOptions.map((status) => (
              <option key={status} value={status} />
            ))}
          </datalist>
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
          <Input
            id="marca"
            list="marcas-sugeridas"
            value={formData.marca || ""}
            placeholder="Digite ou selecione"
            onChange={(e) => onChange("marca", e.target.value)}
            className={errors?.marca ? "border-destructive" : ""}
          />
          <datalist id="marcas-sugeridas">
            {marcas.map((marca) => (
              <option key={marca} value={marca} />
            ))}
          </datalist>
          {errors?.marca && (
            <p className="text-sm text-destructive">{errors.marca}</p>
          )}
        </div>

        {/* Categoria */}
        <div className="space-y-2">
          <Label htmlFor="categoria">{t("category")} (#1106)</Label>
          <Input
            id="categoria"
            list="categorias-sugeridas"
            value={formData.categoria || ""}
            placeholder="Digite ou selecione"
            onChange={(e) => onChange("categoria", e.target.value)}
          />
          <datalist id="categorias-sugeridas">
            {categorias.map((categoria) => (
              <option key={categoria} value={categoria} />
            ))}
          </datalist>
        </div>

        {/* Classificação */}
        <div className="space-y-2">
          <Label htmlFor="classificacao">{t("classification")} (#1105)</Label>
          <Input
            id="classificacao"
            list="classificacoes-sugeridas"
            value={formData.classificacao || ""}
            placeholder="Digite ou selecione"
            onChange={(e) => onChange("classificacao", e.target.value)}
          />
          <datalist id="classificacoes-sugeridas">
            {classificacoes.map((classificacao) => (
              <option key={classificacao} value={classificacao} />
            ))}
          </datalist>
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
          <Input
            id="uf"
            list="ufs-sugeridas"
            value={formData.uf || ""}
            placeholder="Digite ou selecione"
            onChange={(e) => onChange("uf", e.target.value.toUpperCase())}
            maxLength={2}
          />
          <datalist id="ufs-sugeridas">
            {estados.map((estado) => (
              <option key={estado} value={estado} />
            ))}
          </datalist>
        </div>

        {/* Tipo de Placa */}
        <div className="space-y-2">
          <Label htmlFor="tipoPlaca">{t("licensePlateType")}</Label>
          <Input
            id="tipoPlaca"
            list="tipos-placa"
            value={formData.tipoPlaca || ""}
            placeholder="Digite ou selecione"
            onChange={(e) => onChange("tipoPlaca", e.target.value as Veiculo["tipoPlaca"])}
          />
          <datalist id="tipos-placa">
            {tiposPlaca.map((tipo) => (
              <option key={tipo} value={tipo} />
            ))}
          </datalist>
        </div>

        {/* Placa - Obrigatório */}
        <div className="space-y-2">
          <Label htmlFor="placa">
            {t("plate")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="placa"
            value={formData.placa || ""}
            onChange={(e) => onChange("placa", formatPlaca(e.target.value))}
            className={errors?.placa ? "border-destructive" : ""}
            maxLength={8}
            placeholder="AAA-0A00"
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
            onChange={(e) => onChange("renavam", formatRenavam(e.target.value))}
            placeholder="Somente números"
            inputMode="numeric"
          />
        </div>

        {/* Chassi */}
        <div className="space-y-2">
          <Label htmlFor="chassi">{t("chassis")}</Label>
          <Input
            id="chassi"
            value={formData.chassi || ""}
            onChange={(e) => onChange("chassi", formatChassi(e.target.value))}
            placeholder="17 caracteres"
          />
        </div>

        {/* Revisão (Km) */}
        <div className="space-y-2">
          <Label htmlFor="revisaoKm">{t("revisionKm")}</Label>
          <Input
            id="revisaoKm"
            value={formData.revisaoKm || ""}
            onChange={(e) => onChange("revisaoKm", formatKm(e.target.value))}
            placeholder="000.000"
            inputMode="numeric"
          />
        </div>

        {/* Combustível */}
        <div className="space-y-2">
          <Label htmlFor="combustivel">{t("fuel")} (#1337)</Label>
          <Input
            id="combustivel"
            list="combustiveis-sugeridos"
            value={formData.combustivel || ""}
            placeholder="Digite ou selecione"
            onChange={(e) => onChange("combustivel", e.target.value as Veiculo["combustivel"])}
          />
          <datalist id="combustiveis-sugeridos">
            {combustiveis.map((combustivel) => (
              <option key={combustivel} value={combustivel} />
            ))}
          </datalist>
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
