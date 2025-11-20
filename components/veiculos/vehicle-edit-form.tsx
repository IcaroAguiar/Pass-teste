"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Veiculo } from "@/lib/types/veiculo"

interface VehicleEditFormProps {
  veiculo: Veiculo
}

export function VehicleEditForm({ veiculo }: VehicleEditFormProps) {
  const router = useRouter()
  const [form, setForm] = useState<Veiculo>({ ...veiculo })
  const [loading, setLoading] = useState(false)

  const handleChange = (field: keyof Veiculo, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!veiculo.id) return
    setLoading(true)
    const res = await fetch(`/api/veiculos/${veiculo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    setLoading(false)
    if (res.ok) {
      router.push(`/veiculos/${veiculo.id}`)
      router.refresh()
    } else {
      alert("Não foi possível salvar")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Editar Veículo</h1>
        <p className="text-sm text-muted-foreground">Atualize os dados principais.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Identificador" value={form.identificador} onChange={(v) => handleChange("identificador", v)} required />
        <Field label="Título" value={form.titulo || ""} onChange={(v) => handleChange("titulo", v)} />
        <Field label="Marca" value={form.marca} onChange={(v) => handleChange("marca", v)} required />
        <Field label="Modelo" value={form.modelo || ""} onChange={(v) => handleChange("modelo", v)} />
        <Field label="Placa" value={form.placa} onChange={(v) => handleChange("placa", v.toUpperCase())} required />
        <Field label="Capacidade" value={form.capacidade?.toString() || ""} onChange={(v) => handleChange("capacidade", Number(v) || 0)} />
        <Field label="Status" value={form.status || ""} onChange={(v) => handleChange("status", v)} />
        <Field label="Categoria" value={form.categoria || ""} onChange={(v) => handleChange("categoria", v)} />
      </div>

      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          Salvar
        </Button>
      </div>
    </form>
  )
}

function Field({ label, value, onChange, required }: { label: string; value: string; onChange: (v: string) => void; required?: boolean }) {
  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} required={required} />
    </div>
  )
}
