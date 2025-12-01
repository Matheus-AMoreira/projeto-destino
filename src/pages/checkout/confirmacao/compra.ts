// types/index.ts ou types/compra.ts

// --- Sub-objetos utilitários ---
export interface ValorFormatado {
  valorPuro: string;
  valorFormatado: string;
}

export interface Regiao {
  id: number;
  sigla: string;
  nome: string;
}

export interface Estado {
  id: number;
  sigla: string;
  nome: string;
  regiao: Regiao;
}

export interface Cidade {
  id: number;
  nome: string;
  estado: Estado;
}

// --- Usuário / Funcionário ---
export interface Usuario {
  id: string;
  nome: string;
  sobreNome: string;
  cpf: ValorFormatado;
  email: string;
  telefone: ValorFormatado;
  senha?: string; // Opcional pois nem sempre deve ser exibida no front
  password?: string;
  perfil: "ADMINISTRADOR" | "CLIENTE" | string;
  valido: boolean;
  enabled: boolean;
  atualizacao: string; // ISO Date
  cadastro: string; // ISO Date
  authorities: any[];
  credentialsNonExpired: boolean;
  accountNonLocked: boolean;
  accountNonExpired: boolean;
}

// --- Detalhes do Pacote ---
export interface Transporte {
  id: number;
  empresa: string;
  meio: "AEREO" | "TERRESTRE" | string;
  preco: number;
}

export interface Hotel {
  id: number;
  nome: string;
  endereco: string;
  diaria: number;
  cidade: Cidade;
}

export interface Foto {
  id: number;
  nome: string;
  url: string;
}

export interface GaleriaFotos {
  id: number;
  nome: string;
  fotoDoPacote: string; // URL da capa
  fotos: Foto[];
}

export interface Pacote {
  id: number;
  nome: string;
  descricao: string;
  tags: string[];
  preco: number;
  inicio: string; // YYYY-MM-DD
  fim: string; // YYYY-MM-DD
  disponibilidade: number;
  status: "EMANDAMENTO" | "CONCLUIDO" | string;
  transporte: Transporte;
  hotel: Hotel;
  funcionario: Usuario;
  fotosDoPacote: GaleriaFotos;
  precoFormatado: string;
}

// --- Objeto Principal: Compra ---
export interface Compra {
  id: number;
  dataCompra: string; // ISO Date string
  status: "ACEITO" | "PENDENTE" | "CANCELADO" | string;
  metodo: "VISTA" | "PIX" | "CARTAO" | string;
  processadorPagamento: string;
  valorFinal: number;
  usuario: Usuario;
  pacote: Pacote;
}
