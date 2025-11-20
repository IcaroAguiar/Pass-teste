import { NextResponse } from "next/server";
import { listVeiculos, createVeiculo } from "@/lib/veiculos-repository";

function validatePayload(body: any) {
  const errors: Record<string, string> = {};
  if (!body?.identificador) errors.identificador = "identificador é obrigatório";
  if (!body?.marca) errors.marca = "marca é obrigatória";
  if (!body?.placa) errors.placa = "placa é obrigatória";
  if (body?.capacidade === undefined || body?.capacidade === null) {
    errors.capacidade = "capacidade é obrigatória";
  }
  return errors;
}

export async function GET() {
  try {
    const veiculos = await listVeiculos();
    return NextResponse.json(veiculos);
  } catch (error) {
    console.error("Erro ao listar veículos", error);
    return NextResponse.json({ message: "Erro inesperado" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const errors = validatePayload(body);
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const novo = await createVeiculo({
      ...body,
      capacidade: Number(body.capacidade),
      ano: body.ano ? Number(body.ano) : undefined,
      portas: body.portas ? Number(body.portas) : undefined,
    });

    return NextResponse.json(novo, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar veículo", error);
    return NextResponse.json({ message: "Erro inesperado" }, { status: 500 });
  }
}
export const runtime = "nodejs";
