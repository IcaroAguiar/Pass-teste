import { NextResponse, type NextRequest } from "next/server";
import { getVeiculo, updateVeiculo, deleteVeiculo } from "@/lib/veiculos-repository";

function validatePartial(body: any) {
  const errors: Record<string, string> = {};
  if (body && "capacidade" in body && (body.capacidade === null || body.capacidade === undefined)) {
    errors.capacidade = "capacidade não pode ser vazia";
  }
  if (body && "identificador" in body && !body.identificador) {
    errors.identificador = "identificador é obrigatório";
  }
  if (body && "marca" in body && !body.marca) {
    errors.marca = "marca é obrigatória";
  }
  if (body && "placa" in body && !body.placa) {
    errors.placa = "placa é obrigatória";
  }
  return errors;
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const veiculo = await getVeiculo(id);
    if (!veiculo) return NextResponse.json({ message: "Veículo não encontrado" }, { status: 404 });
    return NextResponse.json(veiculo);
  } catch (error) {
    console.error("Erro ao buscar veículo", error);
    return NextResponse.json({ message: "Erro inesperado" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const errors = validatePartial(body);
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const updated = await updateVeiculo(id, {
      ...body,
      capacidade: body.capacidade !== undefined ? Number(body.capacidade) : undefined,
      ano: body.ano !== undefined ? Number(body.ano) : undefined,
      portas: body.portas !== undefined ? Number(body.portas) : undefined,
    });
    if (!updated) return NextResponse.json({ message: "Veículo não encontrado" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Erro ao atualizar veículo", error);
    return NextResponse.json({ message: "Erro inesperado" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const deleted = await deleteVeiculo(id);
    if (!deleted) return NextResponse.json({ message: "Veículo não encontrado" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao excluir veículo", error);
    return NextResponse.json({ message: "Erro inesperado" }, { status: 500 });
  }
}
export const runtime = "nodejs";
