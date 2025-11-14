export type VeiculoStatus = "Liberado" | "Ocupado" | "Manutenção" | "ativo" | "inativo";
export type TipoPlaca = "Mercosul" | "Antiga";
export type TipoCombustivel = "Diesel" | "Gasolina" | "Etanol" | "GNV" | "Elétrico";

export interface Veiculo {
  id?: string;
  identificador: string;
  titulo?: string;
  marca: string;
  modelo?: string;
  ano?: number;
  placa: string;
  tipoPlaca?: TipoPlaca;
  capacidade: number;
  portas?: number;
  renavam?: string;
  chassi?: string;
  revisaoKm?: string;
  combustivel?: TipoCombustivel;
  estado?: string;
  uf?: string;
  companhia?: string;
  categoria?: string;
  classificacao?: string;
  status?: VeiculoStatus;
  caracteristicas?: string;
  descricao?: string;
  criadoEm?: Date;
  imagens?: VeiculoImagem[];
  documentacoes?: Documentacao[];
  ocorrencias?: Ocorrencia[];
  abastecimentos?: Abastecimento[];
}

export interface VeiculoImagem {
  id?: string;
  url: string;
  nome?: string;
  tipo?: string;
}

export interface Documentacao {
  id?: string;
  documento: string;
  tipo: string;
  vencimento: Date;
  antecipacao: boolean;
  dias?: number;
}

export interface Ocorrencia {
  id?: string;
  dataOcorrencia: Date;
  classificacao: string;
  seriedade: string;
  descricao?: string;
  anexo?: string;
}

export interface Abastecimento {
  id?: string;
  dataAbastecimento: Date;
  fornecedor: string;
  combustivel: string;
  litros: number;
  valor: number;
}

