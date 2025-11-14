"use client"

import { useState, useRef } from "react";
import { Camera, X, Upload } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { useTranslations } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { VeiculoImagem } from "@/lib/types/veiculo";

interface VeiculoFormImagensProps {
  imagens: VeiculoImagem[];
  onChange: (imagens: VeiculoImagem[]) => void;
}

export function VeiculoFormImagens({
  imagens,
  onChange,
}: VeiculoFormImagensProps) {
  const { language } = useLanguage();
  const t = useTranslations(language);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newImagens: VeiculoImagem[] = Array.from(files).map((file) => ({
      url: URL.createObjectURL(file),
      nome: file.name,
      tipo: file.type,
    }));

    onChange([...imagens, ...newImagens]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeImagem = (index: number) => {
    // Limpar URL do objeto se foi criado com createObjectURL
    const imagem = imagens[index];
    if (imagem.url.startsWith("blob:")) {
      URL.revokeObjectURL(imagem.url);
    }
    const novasImagens = imagens.filter((_, i) => i !== index);
    onChange(novasImagens);
  };

  const removeAllImagens = () => {
    onChange([]);
  };

  return (
    <div className="space-y-4">
      {/* Área de Upload */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
        />
        <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-sm text-muted-foreground mb-2">
          {t("sendFilesOrDrag")}
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-4 w-4 mr-2" />
          {t("sendFiles")}
        </Button>
      </div>

      {/* Preview das Imagens */}
      {imagens.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {imagens.map((imagem, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden border border-border">
                  <img
                    src={imagem.url}
                    alt={imagem.nome || `Imagem ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImagem(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>

          {/* Checkbox para excluir todas */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="deleteAll"
              onCheckedChange={(checked) => {
                if (checked) removeAllImagens();
              }}
            />
            <Label
              htmlFor="deleteAll"
              className="text-sm font-normal cursor-pointer"
            >
              {t("deleteAllFiles")}
            </Label>
          </div>
        </div>
      )}
    </div>
  );
}

