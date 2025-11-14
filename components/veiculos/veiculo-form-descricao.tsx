"use client"

import { useLanguage } from "@/components/language-provider";
import { useTranslations } from "@/lib/translations";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Veiculo } from "@/lib/types/veiculo";

interface VeiculoFormDescricaoProps {
  formData: Partial<Veiculo>;
  onChange: (field: keyof Veiculo, value: any) => void;
}

export function VeiculoFormDescricao({
  formData,
  onChange,
}: VeiculoFormDescricaoProps) {
  const { language } = useLanguage();
  const t = useTranslations(language);

  return (
    <div className="space-y-2">
      <Label htmlFor="descricao">{t("description")}</Label>
      <Textarea
        id="descricao"
        value={formData.descricao || ""}
        onChange={(e) => onChange("descricao", e.target.value)}
        placeholder="Digite a descrição do veículo"
        className="min-h-[100px] resize-y"
      />
    </div>
  );
}

