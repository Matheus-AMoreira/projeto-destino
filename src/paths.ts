const ROTA_PACOTES_BASE = "/pacotes";

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

  // Pacotes
  BUSCAR_PACOTES: ROTA_PACOTES_BASE,
  PACOTE_DETALHES: `${ROTA_PACOTES_BASE}/detalhar/:id`,

  //Compra
  CHECKOUT: "/checkout",
  CONFIRMACAO: "/confirmacao",
};
