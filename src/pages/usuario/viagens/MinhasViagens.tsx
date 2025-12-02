import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "@/paths";
import { useSession } from "@/store/sessionStore";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import { FaUser, FaHistory, FaGlobeAmericas } from "react-icons/fa";
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import { MdAirplaneTicket } from "react-icons/md";
import { LuPackageSearch } from "react-icons/lu";

// Interface compatível com o DTO Java ViagemResumoDTO
interface ViagemResumo {
  id: number;
  pacoteId: number;
  nomePacote: string;
  descricao: string;
  valor: number;
  statusCompra: string; // PENDENTE, APROVADO, CANCELADO, ETC
  dataPartida: string;
  dataRetorno: string;
  imagemCapa: string;
  cidade: string;
  estado: string;
}

export default function MinhasViagens() {
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario } = useSession();

  const [viagens, setViagens] = useState<ViagemResumo[]>([]);
  const [loading, setLoading] = useState(true);

  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-BR");
  };

  useEffect(() => {
    const fetchViagens = async () => {
      if (!usuario?.accessToken) return;

      try {
        const response = await fetch("/api/compra", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${usuario.accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setViagens(data);
        }
      } catch (error) {
        console.error("Erro ao buscar viagens:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchViagens();
  }, [usuario]);

  // Lógica para separar Compradas (Futuras/Atuais) vs Concluídas (Passadas)
  const hoje = new Date();

  const viagensConcluidas = viagens.filter(
    (v) => new Date(v.dataRetorno) < hoje
  );
  const viagensCompradas = viagens.filter(
    (v) => new Date(v.dataRetorno) >= hoje
  );

  // Determina qual aba está ativa
  const isViagensConcluidas = location.search.includes("concluidas");
  const isViagensCompradas = !isViagensConcluidas;

  // Seleciona as viagens baseado na aba ativa
  const viagensAtivas = isViagensConcluidas
    ? viagensConcluidas
    : viagensCompradas;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONCLUIDA":
        return "bg-gray-200 text-gray-700";
      case "APROVADO":
      case "CONFIRMADA":
        return "bg-green-100 text-green-800";
      case "PENDENTE":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELADO":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Função para verificar se a viagem está concluída e retornar status apropriado
  const getStatusDisplay = (viagem: ViagemResumo) => {
    const hoje = new Date();
    const dataRetorno = new Date(viagem.dataRetorno);
    
    // Se estiver na aba de concluídas OU se a data de retorno já passou
    if (isViagensConcluidas || dataRetorno < hoje) {
      return "CONCLUIDA";
    }
    return viagem.statusCompra;
  };

  // Verifica se uma viagem está concluída para aplicar estilos
  const isViagemConcluida = (viagem: ViagemResumo) => {
    const dataRetorno = new Date(viagem.dataRetorno);
    const hoje = new Date();
    return dataRetorno < hoje;
  };

  // Funções de navegação - IMPORTANTE: usando ROUTES.MINHAS_VIAGENS
  const handleProximasViagens = () => {
    navigate(ROUTES.MINHAS_VIAGENS); // Vai para /viagens
  };

  const handleHistorico = () => {
    navigate(`${ROUTES.MINHAS_VIAGENS}?concluidas`); // Vai para /viagens?concluidas
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg hidden md:block">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            <FaUser className="text-xl" />
            <span>Minha Conta</span>
          </h1>
        </div>

        <nav className="p-4">
          <div className="space-y-2">
            <button
              onClick={handleProximasViagens}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                isViagensCompradas
                  ? "bg-blue-50 text-blue-600 border border-blue-200"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <TbPlayerTrackNextFilled className="text-xl" />
              <span>Próximas Viagens</span>
            </button>

            <button
              onClick={handleHistorico}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                isViagensConcluidas
                  ? "bg-blue-50 text-blue-600 border border-blue-200"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <FaHistory className="text-xl" />
              <span>Histórico (Concluídas)</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <FaGlobeAmericas className="text-xl" />
              <span>
                {isViagensConcluidas ? "Histórico de Viagens" : "Minhas Viagens"}
              </span>
            </h1>
            <p className="text-gray-600 mt-1">
              {isViagensConcluidas
                ? "Relembre suas aventuras passadas"
                : "Gerencie suas próximas aventuras"}
            </p>
          </div>

          <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
            <span className="text-sm text-gray-600">
              Total: <strong>{viagensAtivas.length}</strong> viage
              {viagensAtivas.length !== 1 ? "ns" : "m"}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Grid de Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {viagensAtivas.map((viagem) => {
                const statusDisplay = getStatusDisplay(viagem);
                const isConcluida = isViagensConcluidas || isViagemConcluida(viagem);
                
                return (
                  <div
                    key={viagem.id}
                    className={`rounded-lg shadow-md border transition-shadow overflow-hidden flex flex-col ${
                      isConcluida 
                        ? "bg-gray-50 border-gray-300 opacity-90" 
                        : "bg-white border-gray-200 hover:shadow-lg"
                    }`}
                  >
                    {/* Imagem de Capa com efeito cinza para concluídas */}
                    <div className="h-48 bg-gray-200 relative">
                      {viagem.imagemCapa ? (
                        <div className="relative w-full h-full">
                          <img
                            src={viagem.imagemCapa}
                            alt={viagem.nomePacote}
                            className={`w-full h-full object-cover ${
                              isConcluida ? "filter grayscale-30 opacity-80" : ""
                            }`}
                          />
                          {/* Overlay cinza para concluídas */}
                          {isConcluida && (
                            <div className="absolute inset-0 bg-gray-400 bg-opacity-20"></div>
                          )}
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          Sem imagem
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-bold shadow-sm ${getStatusColor(
                            statusDisplay
                          )}`}
                        >
                          {statusDisplay}
                        </span>
                      </div>
                    </div>

                    {/* Conteúdo do Card */}
                    <div className={`p-6 flex-1 flex flex-col ${isConcluida ? "bg-gray-50" : ""}`}>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className={`text-xl font-bold line-clamp-1 ${
                          isConcluida ? "text-gray-700" : "text-gray-900"
                        }`}>
                          {viagem.nomePacote}
                        </h3>
                      </div>

                      <div className="flex items-center text-sm mb-2 space-x-1">
                        <FaMapMarkerAlt className={isConcluida ? "text-gray-500" : "text-red-500"} />
                        <span className={isConcluida ? "text-gray-600" : "text-gray-500"}>
                          {viagem.cidade} - {viagem.estado}
                        </span>
                      </div>

                      <p className={`text-sm mb-4 line-clamp-2 flex-1 ${
                        isConcluida ? "text-gray-600" : "text-gray-600"
                      }`}>
                        {viagem.descricao}
                      </p>

                      <div className="space-y-3 mt-auto">
                        <div className={`flex items-center text-sm p-2 rounded ${
                          isConcluida 
                            ? "text-gray-600 bg-gray-100" 
                            : "text-gray-600 bg-gray-50"
                        }`}>
                          <FaCalendarAlt className={`mr-2 ${isConcluida ? "text-gray-500" : "text-blue-500"}`} />
                          <span>
                            {formatarData(viagem.dataPartida)} -{" "}
                            {formatarData(viagem.dataRetorno)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between border-t pt-3">
                          <div>
                            <span className={`text-xs block ${
                              isConcluida ? "text-gray-500" : "text-gray-500"
                            }`}>
                              Valor Pago
                            </span>
                            <span className={`text-lg font-bold ${
                              isConcluida ? "text-gray-700" : "text-blue-600"
                            }`}>
                              {formatarValor(viagem.valor)}
                            </span>
                          </div>

                          <button
                            onClick={() =>
                              navigate(
                                ROUTES.MINHA_VIAGENS_DETALHADAS.replace(
                                  ":id",
                                  String(viagem.id)
                                )
                              )
                            }
                            className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                              isConcluida
                                ? "bg-gray-600 text-white hover:bg-gray-700"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                          >
                            Ver Detalhes
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {viagensAtivas.length === 0 && (
              <div className="text-center py-16 bg-white rounded-lg border border-dashed border-gray-300">
                <div className="text-7xl mb-4 text-gray-400 mx-auto w-fit"> 
                  <MdAirplaneTicket />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {isViagensConcluidas
                    ? "Nenhuma viagem no histórico"
                    : "Nenhuma viagem agendada"}
                </h3>
                <p className="text-gray-500 mb-6">
                  {isViagensConcluidas
                    ? "Suas viagens realizadas aparecerão aqui."
                    : "Que tal planejar sua próxima aventura agora?"}
                </p>
                {!isViagensConcluidas && (
                  <button
                    onClick={() => navigate(ROUTES.BUSCAR_PACOTES)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-500 transition-colors flex items-center space-x-2 mx-auto"
                  >
                    <LuPackageSearch className="text-xl" />
                    <span>Explorar Pacotes</span>
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}