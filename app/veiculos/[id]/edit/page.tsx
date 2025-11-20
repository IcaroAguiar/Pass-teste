import { notFound } from "next/navigation";
import { getVeiculo } from "@/lib/veiculos-repository";
import { VehicleEditForm } from "@/components/veiculos/vehicle-edit-form";

export const dynamic = "force-dynamic";

export default async function EditVeiculoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const veiculo = await getVeiculo(id);
  if (!veiculo) return notFound();

  return <VehicleEditForm veiculo={veiculo} />;
}
