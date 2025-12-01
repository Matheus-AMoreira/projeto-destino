export const ROTAS_BASE = {
  PACOTES: `/pacotes`,
  ADMINISTRACAO: `/administracao`,
  VIAGEM: `/viagens`,
};

export const ROUTES = {
  // Administração
  LANDINGPAGE: `/`,
  CONTATO: `/contato`,
  VIAGEM: `/viagem`,
  RELATORIO: `${ROTAS_BASE.ADMINISTRACAO}/dashboard`,

  // Viagens
  VIAGENS_CADASTRADAS: `${ROTAS_BASE.ADMINISTRACAO}/viagens-cadastradas`,
  CADASTRAR_VIAGEM: `${ROTAS_BASE.ADMINISTRACAO}/viagens-cadastradas/novo`,
  EDITAR_VIAGEM: `${ROTAS_BASE.ADMINISTRACAO}/viagens-cadastradas/editar/:id`,

  // Fotos
  PACOTES_FOTO_LISTA: `${ROTAS_BASE.ADMINISTRACAO}/pacotes-foto`,
  REGISTRAR_FOTOS: `${ROTAS_BASE.ADMINISTRACAO}/pacotes-foto/novo`,
  EDITAR_FOTOS: `${ROTAS_BASE.ADMINISTRACAO}/pacotes-foto/editar/:id`,

  // Hotéis
  HOTEIS_LISTA: `${ROTAS_BASE.ADMINISTRACAO}/hoteis`,
  REGISTRAR_HOTEL: `${ROTAS_BASE.ADMINISTRACAO}/hoteis/novo`,
  EDITAR_HOTEL: `${ROTAS_BASE.ADMINISTRACAO}/hoteis/editar/:id`,

  // Transportes
  TRANSPORTES_LISTA: `${ROTAS_BASE.ADMINISTRACAO}/transportes`,
  REGISTRAR_TRANSPORTE: `${ROTAS_BASE.ADMINISTRACAO}/transportes/novo`,
  EDITAR_TRANSPORTE: `${ROTAS_BASE.ADMINISTRACAO}/transportes/editar/:id`,

  // Públicas
  LOGIN: `/login`,
  SIGNUP: `/cadastro`,

  // Pacotes
  BUSCAR_PACOTES: ROTAS_BASE.PACOTES,
  PACOTE_DETALHES: `${ROTAS_BASE.PACOTES}/detalhar/:id`,

  //Compra
  CHECKOUT: `/checkout`,
  CONFIRMACAO: `/confirmacao`,

  //Usuario
  LISTAR_USUARIOS: `${ROTAS_BASE.ADMINISTRACAO}/usuarios`,
  MINHAS_VIAGENS: `${ROTAS_BASE.VIAGEM}`,
  MINHA_VIAGENS_DETALHADAS: `${ROTAS_BASE.VIAGEM}/detalhe/:id`,
};
