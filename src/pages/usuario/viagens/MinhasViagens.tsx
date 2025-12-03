import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ROUTES } from "@/paths";
import { useSession } from "@/store/sessionStore";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUser,
  FaHistory,
  FaGlobeAmericas,
} from "react-icons/fa";
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import { MdAirplaneTicket } from "react-icons/md";
import { LuPackageSearch } from "react-icons/lu";

// ... Interface mantida ...
interface ViagemResumo {
  id: number;
  pacoteId: number;
  nomePacote: string;
  descricao: string;
  valor: number;
  statusCompra: string;
  dataPartida: string;
  dataRetorno: string;
  imagemCapa: string;
  cidade: string;
  estado: string;
}

export default function MinhasViagens() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { usuario } = useSession();

  const [viagensAndamento, setViagensAndamento] = useState<ViagemResumo[]>([]);
  const [viagensConcluidas, setViagensConcluidas] = useState<ViagemResumo[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  const activeView = searchParams.get("view") || "andamento";
  const listaAtual =
    activeView === "concluidas" ? viagensConcluidas : viagensAndamento;
  const isHistorico = activeView === "concluidas";

  useEffect(() => {
    const fetchTodasViagens = async () => {
      if (!usuario?.accessToken) return;

      setLoading(true);

      try {
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${usuario.accessToken}`,
        };

        const [resAndamento, resConcluidas] = await Promise.all([
          fetch("/api/compra/andamento", { method: "GET", headers }),
          fetch("/api/compra/concluidas", { method: "GET", headers }),
        ]);

        if (resAndamento.ok) {
          setViagensAndamento(await resAndamento.json());
        }

        if (resConcluidas.ok) {
          setViagensConcluidas(await resConcluidas.json());
        }
      } catch (error) {
        console.error("Erro ao carregar viagens:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodasViagens();
  }, [usuario]);

  const handleMudarVisualizacao = (view: string) => {
    setSearchParams({ view });
  };

  // Helpers de UI
  const getStatusColor = (status: string) => {
    if (isHistorico) return "bg-gray-200 text-gray-700";
    switch (status) {
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

  const formatarValor = (valor: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-white shadow-lg hidden md:block">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            <FaUser className="text-xl" />
            <span>Minha Conta</span>
          </h1>
        </div>

        <nav className="p-4 space-y-2">
          <button
            onClick={() => handleMudarVisualizacao("andamento")}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
              activeView === "andamento"
                ? "bg-blue-50 text-blue-600 border border-blue-200"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <TbPlayerTrackNextFilled className="text-xl" />
            <span>Próximas Viagens</span>
          </button>

          <button
            onClick={() => handleMudarVisualizacao("concluidas")}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
              activeView === "concluidas"
                ? "bg-blue-50 text-blue-600 border border-blue-200"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FaHistory className="text-xl" />
            <span>Histórico</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <FaGlobeAmericas className="text-xl" />
              <span>
                {isHistorico ? "Histórico de Viagens" : "Minhas Viagens"}
              </span>
            </h1>
            <p className="text-gray-600 mt-1">
              {isHistorico
                ? "Relembre suas aventuras passadas"
                : "Gerencie suas próximas aventuras"}
            </p>
          </div>

          <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
            <span className="text-sm text-gray-600">
              Exibindo: <strong>{listaAtual.length}</strong>{" "}
              {listaAtual.length !== 1 ? "itens" : "item"}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {listaAtual.map((viagem) => (
                <div
                  key={viagem.id}
                  className={`rounded-lg shadow-md border transition-shadow overflow-hidden flex flex-col ${
                    isHistorico
                      ? "bg-gray-50 border-gray-300 opacity-90"
                      : "bg-white border-gray-200 hover:shadow-lg"
                  }`}
                >
                  <div className="h-48 bg-gray-200 relative">
                    {viagem.imagemCapa ? (
                      <div className="relative w-full h-full">
                        <img
                          src={viagem.imagemCapa}
                          alt={viagem.nomePacote}
                          className={`w-full h-full object-cover ${
                            isHistorico ? "filter grayscale opacity-80" : ""
                          }`}
                        />
                        {isHistorico && (
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
                          viagem.statusCompra
                        )}`}
                      >
                        {isHistorico ? "CONCLUÍDA" : viagem.statusCompra}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`p-6 flex-1 flex flex-col ${
                      isHistorico ? "bg-gray-50" : ""
                    }`}
                  >
                    <h3
                      className={`text-xl font-bold line-clamp-1 mb-2 ${
                        isHistorico ? "text-gray-700" : "text-gray-900"
                      }`}
                    >
                      {viagem.nomePacote}
                    </h3>

                    <div className="flex items-center text-sm mb-2 space-x-1">
                      <FaMapMarkerAlt
                        className={
                          isHistorico ? "text-gray-500" : "text-red-500"
                        }
                      />
                      <span className="text-gray-600">
                        {viagem.cidade} - {viagem.estado}
                      </span>
                    </div>

                    <p className="text-sm mb-4 line-clamp-2 flex-1 text-gray-600">
                      {viagem.descricao}
                    </p>

                    <div className="space-y-3 mt-auto">
                      <div
                        className={`flex items-center text-sm p-2 rounded ${
                          isHistorico
                            ? "bg-gray-100 text-gray-600"
                            : "bg-blue-50 text-gray-700"
                        }`}
                      >
                        <FaCalendarAlt
                          className={`mr-2 ${
                            isHistorico ? "text-gray-500" : "text-blue-500"
                          }`}
                        />
                        <span>
                          {viagem.dataPartida} - {viagem.dataRetorno}
                        </span>
                      </div>

                      <div className="flex items-center justify-between border-t pt-3">
                        <div>
                          <span className="text-xs block text-gray-500">
                            Valor Pago
                          </span>
                          <span
                            className={`text-lg font-bold ${
                              isHistorico ? "text-gray-700" : "text-blue-600"
                            }`}
                          >
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
                            isHistorico
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
              ))}
            </div>

            {listaAtual.length === 0 && (
              <div className="text-center py-16 bg-white rounded-lg border border-dashed border-gray-300">
                <div className="text-7xl mb-4 text-gray-400 mx-auto w-fit">
                  <MdAirplaneTicket />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {isHistorico ? "Histórico vazio" : "Nenhuma viagem agendada"}
                </h3>
                {!isHistorico && (
                  <button
                    onClick={() => navigate(ROUTES.BUSCAR_PACOTES)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-500 transition-colors flex items-center space-x-2 mx-auto mt-4"
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
