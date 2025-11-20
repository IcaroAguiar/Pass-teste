import type { Veiculo } from "@/lib/types/veiculo";
import { query } from "./db";

type VeiculoRow = {
  id: string;
  identificador: string;
  titulo: string | null;
  marca: string;
  modelo: string | null;
  ano: number | null;
  placa: string;
  tipo_placa: string | null;
  capacidade: number;
  portas: number | null;
  renavam: string | null;
  chassi: string | null;
  revisao_km: string | null;
  combustivel: string | null;
  estado: string | null;
  uf: string | null;
  companhia: string | null;
  categoria: string | null;
  classificacao: string | null;
  status: string | null;
  caracteristicas: string | null;
  descricao: string | null;
  imagens: any | null;
  documentacoes: any | null;
  ocorrencias: any | null;
  abastecimentos: any | null;
  criado_em: Date;
  atualizado_em: Date;
};

const columnMap: Record<keyof Veiculo, string> = {
  id: "id",
  identificador: "identificador",
  titulo: "titulo",
  marca: "marca",
  modelo: "modelo",
  ano: "ano",
  placa: "placa",
  tipoPlaca: "tipo_placa",
  capacidade: "capacidade",
  portas: "portas",
  renavam: "renavam",
  chassi: "chassi",
  revisaoKm: "revisao_km",
  combustivel: "combustivel",
  estado: "estado",
  uf: "uf",
  companhia: "companhia",
  categoria: "categoria",
  classificacao: "classificacao",
  status: "status",
  caracteristicas: "caracteristicas",
  descricao: "descricao",
  criadoEm: "criado_em",
  imagens: "imagens",
  documentacoes: "documentacoes",
  ocorrencias: "ocorrencias",
  abastecimentos: "abastecimentos",
};

let schemaReady = false;

async function ensureSchema() {
  if (schemaReady) return;
  await query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
  await query(`
    CREATE TABLE IF NOT EXISTS veiculos (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      identificador TEXT NOT NULL,
      titulo TEXT,
      marca TEXT NOT NULL,
      modelo TEXT,
      ano INTEGER,
      placa TEXT NOT NULL,
      tipo_placa TEXT,
      capacidade INTEGER NOT NULL,
      portas INTEGER,
      renavam TEXT,
      chassi TEXT,
      revisao_km TEXT,
      combustivel TEXT,
      estado TEXT,
      uf TEXT,
      companhia TEXT,
      categoria TEXT,
      classificacao TEXT,
      status TEXT,
      caracteristicas TEXT,
      descricao TEXT,
      imagens JSONB,
      documentacoes JSONB,
      ocorrencias JSONB,
      abastecimentos JSONB,
      criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
      atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
  schemaReady = true;
}

function mapRowToVeiculo(row: VeiculoRow): Veiculo {
  return {
    id: row.id,
    identificador: row.identificador,
    titulo: row.titulo ?? undefined,
    marca: row.marca,
    modelo: row.modelo ?? undefined,
    ano: row.ano ?? undefined,
    placa: row.placa,
    tipoPlaca: (row.tipo_placa as Veiculo["tipoPlaca"] | null) ?? undefined,
    capacidade: row.capacidade,
    portas: row.portas ?? undefined,
    renavam: row.renavam ?? undefined,
    chassi: row.chassi ?? undefined,
    revisaoKm: row.revisao_km ?? undefined,
    combustivel: (row.combustivel as Veiculo["combustivel"] | null) ?? undefined,
    estado: row.estado ?? undefined,
    uf: row.uf ?? undefined,
    companhia: row.companhia ?? undefined,
    categoria: row.categoria ?? undefined,
    classificacao: row.classificacao ?? undefined,
    status: (row.status as Veiculo["status"] | null) ?? undefined,
    caracteristicas: row.caracteristicas ?? undefined,
    descricao: row.descricao ?? undefined,
    criadoEm: row.criado_em,
    imagens: (row.imagens as Veiculo["imagens"]) ?? [],
    documentacoes: (row.documentacoes as Veiculo["documentacoes"]) ?? [],
    ocorrencias: (row.ocorrencias as Veiculo["ocorrencias"]) ?? [],
    abastecimentos: (row.abastecimentos as Veiculo["abastecimentos"]) ?? [],
  };
}

function sanitizeVeiculoPayload(payload: Partial<Veiculo>) {
  const allowed: Partial<Veiculo> = {};
  (Object.keys(columnMap) as (keyof Veiculo)[]).forEach((key) => {
    if (key in payload && payload[key] !== undefined) {
      // @ts-expect-error dynamic assign
      allowed[key] = payload[key];
    }
  });
  return allowed;
}

export async function listVeiculos(): Promise<Veiculo[]> {
  await ensureSchema();
  const { rows } = await query<VeiculoRow>(`SELECT * FROM veiculos ORDER BY criado_em DESC`);
  return rows.map(mapRowToVeiculo);
}

export async function getVeiculo(id: string): Promise<Veiculo | null> {
  await ensureSchema();
  const { rows } = await query<VeiculoRow>(`SELECT * FROM veiculos WHERE id = $1`, [id]);
  if (!rows[0]) return null;
  return mapRowToVeiculo(rows[0]);
}

export async function createVeiculo(data: Partial<Veiculo>): Promise<Veiculo> {
  await ensureSchema();
  const payload = sanitizeVeiculoPayload(data);

  const result = await query<VeiculoRow>(
    `INSERT INTO veiculos (
      identificador, titulo, marca, modelo, ano, placa, tipo_placa, capacidade, portas,
      renavam, chassi, revisao_km, combustivel, estado, uf, companhia, categoria,
      classificacao, status, caracteristicas, descricao, imagens, documentacoes,
      ocorrencias, abastecimentos
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,
      $10,$11,$12,$13,$14,$15,$16,$17,
      $18,$19,$20,$21,$22,$23,
      $24,$25
    ) RETURNING *`,
    [
      payload.identificador,
      payload.titulo ?? null,
      payload.marca,
      payload.modelo ?? null,
      payload.ano ?? null,
      payload.placa,
      payload.tipoPlaca ?? null,
      payload.capacidade,
      payload.portas ?? null,
      payload.renavam ?? null,
      payload.chassi ?? null,
      payload.revisaoKm ?? null,
      payload.combustivel ?? null,
      payload.estado ?? null,
      payload.uf ?? null,
      payload.companhia ?? null,
      payload.categoria ?? null,
      payload.classificacao ?? null,
      payload.status ?? null,
      payload.caracteristicas ?? null,
      payload.descricao ?? null,
      payload.imagens ?? [],
      payload.documentacoes ?? [],
      payload.ocorrencias ?? [],
      payload.abastecimentos ?? [],
    ]
  );

  return mapRowToVeiculo(result.rows[0]);
}

export async function updateVeiculo(id: string, data: Partial<Veiculo>): Promise<Veiculo | null> {
  await ensureSchema();
  const payload = sanitizeVeiculoPayload(data);
  delete payload.id;
  delete payload.criadoEm;
  if (Object.keys(payload).length === 0) {
    return getVeiculo(id);
  }

  const entries = Object.entries(payload) as [keyof Veiculo, any][];
  const setClauses = entries.map(([key], idx) => `${columnMap[key]} = $${idx + 1}`);
  const values = entries.map(([, value]) => value);
  // updated_at
  setClauses.push(`atualizado_em = now()`);

  const { rows } = await query<VeiculoRow>(
    `UPDATE veiculos SET ${setClauses.join(", ")}
     WHERE id = $${values.length + 1}
     RETURNING *`,
    [...values, id]
  );

  if (!rows[0]) return null;
  return mapRowToVeiculo(rows[0]);
}

export async function deleteVeiculo(id: string): Promise<boolean> {
  await ensureSchema();
  const { rows } = await query<{ id: string }>(`DELETE FROM veiculos WHERE id = $1 RETURNING id`, [id]);
  return Boolean(rows[0]);
}
