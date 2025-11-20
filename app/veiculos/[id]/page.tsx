import { notFound } from "next/navigation";
import { getVeiculo } from "@/lib/veiculos-repository";
import { VehicleDetail } from "@/components/veiculos/vehicle-detail";

export const dynamic = "force-dynamic";

export default async function VeiculoDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const veiculo = await getVeiculo(id);
  if (!veiculo) return notFound();

  return <VehicleDetail veiculo={veiculo} />;
}
