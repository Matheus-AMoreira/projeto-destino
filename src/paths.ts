export const ROUTES = {
  // Administração
  LANDINGPAGE: "/",
  CONTATO: "/contato",
  VIAGEM: "/viagem",
  RELATORIO: "/administracao/dashboard",

  // Viagens
  VIAGENS_CADASTRADAS: "/administracao/viagens-cadastradas",
  CADASTRAR_VIAGEM: "/administracao/viagens-cadastradas/novo",
  EDITAR_VIAGEM: "/administracao/viagens-cadastradas/editar/:id",

  // Fotos
  PACOTES_FOTO_LISTA: "/administracao/pacotes-foto",
  REGISTRAR_FOTOS: "/administracao/pacotes-foto/novo",
  EDITAR_FOTOS: "/administracao/pacotes-foto/editar/:id",

  // Hotéis
  HOTEIS_LISTA: "/administracao/hoteis",
  REGISTRAR_HOTEL: "/administracao/hoteis/novo",
  EDITAR_HOTEL: "/administracao/hoteis/editar/:id",

  // Transportes
  TRANSPORTES_LISTA: "/administracao/transportes",
  REGISTRAR_TRANSPORTE: "/administracao/transportes/novo",
  EDITAR_TRANSPORTE: "/administracao/transportes/editar/:id",

  // Públicas
  LOGIN: "/login",
  SIGNUP: "/cadastro",
  VALIDAR: "/validar",
  PRODUCT: "/produto",
  BUSCAR_VIAGEM: "/buscar-viagem",
  CHECKOUT: "/checkout",
  CONFIRMACAO: "/confirmacao",
} as const;
