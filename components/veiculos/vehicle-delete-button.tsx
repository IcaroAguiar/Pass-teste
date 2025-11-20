"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export function VehicleDeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const res = await fetch(`/api/veiculos/${id}`, { method: "DELETE" });
    setLoading(false);
    if (res.ok) {
      router.push("/veiculos");
      router.refresh();
    } else {
      alert("Não foi possível remover o veículo");
    }
  };

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-destructive" />
        <Button size="sm" variant="destructive" onClick={handleDelete} disabled={loading}>
          Confirmar
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setConfirming(false)} disabled={loading}>
          Cancelar
        </Button>
      </div>
    );
  }

  return (
    <Button variant="destructive" onClick={() => setConfirming(true)} disabled={loading}>
      Remover
    </Button>
  );
}
