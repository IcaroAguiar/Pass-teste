"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { VehicleDeleteButton } from "@/components/veiculos/vehicle-delete-button"
import type { Veiculo } from "@/lib/types/veiculo"

interface VehicleDetailProps {
  veiculo: Veiculo
}

export function VehicleDetail({ veiculo }: VehicleDetailProps) {
  const router = useRouter()

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Veículo #{veiculo.id || veiculo.identificador}</p>
          <h1 className="text-2xl font-semibold">{veiculo.titulo || veiculo.identificador}</h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => router.push(`/veiculos/${veiculo.id}/edit`)}
          >
            Editar
          </Button>
          {veiculo.id && <VehicleDeleteButton id={veiculo.id} />}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <Field label="Identificador" value={veiculo.identificador} />
          <Field label="Marca" value={veiculo.marca} />
          <Field label="Modelo" value={veiculo.modelo} />
          <Field label="Placa" value={veiculo.placa} />
          <Field label="Capacidade" value={veiculo.capacidade?.toString()} />
          <Field label="Status" value={veiculo.status} />
          <Field label="Categoria" value={veiculo.categoria} />
          <Field label="Classificação" value={veiculo.classificacao} />
          <Field label="Ano" value={veiculo.ano?.toString()} />
          <Field label="Criado em" value={veiculo.criadoEm ? new Date(veiculo.criadoEm).toLocaleDateString("pt-BR") : "-"} />
        </CardContent>
      </Card>
    </div>
  )
}

function Field({ label, value }: { label: string; value?: string | number }) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value || "-"}</p>
    </div>
  )
}
