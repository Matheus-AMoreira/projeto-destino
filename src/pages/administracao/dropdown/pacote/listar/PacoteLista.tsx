import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/paths";
import { useSession } from "@/store/sessionStore";
import { FaMapMarkedAlt } from "react-icons/fa";
import { RiMapPinAddFill } from "react-icons/ri";

interface Pacote {
  id: number;
  nome: string;
  descricao: string;
  valor: number;
  preco: number;
  status: "CONCLUIDO" | "EMANDAMENTO" | "CANCELADO";
  hotel?: { nome: string };
  transporte?: { empresa: string; meio: string };
}

interface PacotesAgrupados {
  [local: string]: Pacote[];
}

export default function PacoteLista() {
  const { usuario, isLoading } = useSession();
  const navigate = useNavigate();
  const [grupos, setGrupos] = useState<PacotesAgrupados>({});
  const [loading, setLoading] = useState(false);
  const [abertos, setAbertos] = useState<Record<string, boolean>>({});

  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  useEffect(() => {
    const fetchHoteis = async () => {
      if (!usuario || !usuario.accessToken) return;

      setLoading(true);

      try {
        const response = await fetch("/api/pacote/agrupado-admin", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${usuario.accessToken}`,
          },
          credentials: "include",
        });

        if (!response.ok) throw new Error("Erro ao buscar hotéis");

        const result = await response.json();
        setGrupos(result);
        const initialOpenState: Record<string, boolean> = {};
        Object.keys(result).forEach((key) => (initialOpenState[key] = true));
        setAbertos(initialOpenState);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (!isLoading && usuario) {
      fetchHoteis();
    }
    setLoading(false);
  }, [usuario, isLoading]);

  const toggleGrupo = (local: string) => {
    setAbertos((prev) => ({ ...prev, [local]: !prev[local] }));
  };

  const handleEditar = (viagemId: number) => {
    navigate(ROUTES.EDITAR_VIAGEM.replace(":id", String(viagemId)));
  };

  const handleVisualizar = (viagemId: number) => {
    // Rota pública para visualizar como ficou
    navigate(ROUTES.PACOTE_DETALHES.replace(":id", String(viagemId)));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "EMANDAMENTO":
        return (
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold">
            Em Andamento
          </span>
        );
      case "CONCLUIDO":
        return (
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold">
            Concluído
          </span>
        );
      case "CANCELADO":
        return (
          <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-bold">
            Cancelado
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          {/* Título: Alinhamento do ícone e texto na mesma linha */}
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <FaMapMarkedAlt className="text-3xl" />
            <span>Gerenciar Pacotes de Viagem</span>
          </h1>
          {/* Botão Adicionar: Alinhamento e hover verde */}
          <button
            onClick={() => navigate(ROUTES.CADASTRAR_VIAGEM)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors shadow-sm flex items-center space-x-2 justify-center"
          >
            <RiMapPinAddFill className="text-lg" />
            <span>Adicionar Pacote de Viagens</span>
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500">Carregando pacotes...</p>
        ) : (
          <div className="space-y-6">
            {Object.entries(grupos).map(([local, pacotes]) => (
              <div
                key={local}
                className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden"
              >
                {/* Cabeçalho do Grupo (Local) */}
                <div
                  className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => toggleGrupo(local)}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="text-xl transform transition-transform duration-200"
                      style={{ rotate: abertos[local] ? "180deg" : "0deg" }}
                    >
                      ▼
                    </span>
                    <h2 className="text-lg font-bold text-gray-800">
                      📍 {local}
                    </h2>
                    <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                      {pacotes.length} pacotes
                    </span>
                  </div>
                </div>

                {/* Lista de Pacotes (Expandível) */}
                {abertos[local] && (
                  <div className="divide-y divide-gray-100">
                    {pacotes.map((pacote) => (
                      <div
                        key={pacote.id}
                        className="p-6 hover:bg-blue-50/30 transition-colors flex flex-col md:flex-row justify-between gap-4"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {pacote.nome}
                            </h3>
                            {getStatusBadge(pacote.status)}
                          </div>

                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                            {pacote.descricao}
                          </p>

                          <div className="flex gap-4 text-sm text-gray-500">
                            <span>🏨 {pacote.hotel?.nome}</span>
                            <span>✈️ {pacote.transporte?.meio}</span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end justify-center gap-2 min-w-[150px]">
                          <span className="text-lg font-bold text-blue-600">
                            {formatarValor(pacote.preco)}
                          </span>

                          <div className="flex gap-2 w-full">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleVisualizar(pacote.id);
                              }}
                              className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                            >
                              Ver
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditar(pacote.id);
                              }}
                              className="flex-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                              Editar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {!isLoading && Object.keys(grupos).length === 0 && (
              <div className="text-center py-10 text-gray-500">
                Nenhum pacote cadastrado.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
