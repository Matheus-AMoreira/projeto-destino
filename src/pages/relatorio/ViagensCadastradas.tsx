import { useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "@/paths";
import { useViagens } from "@/utils/buscarFunctions";

export default function ViagensCadastradas() {
  const { viagens } = useViagens();
  const navigate = useNavigate();
  const location = useLocation();

  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  const handleEditar = (viagemId: number) => {
    // CORREÇÃO: Navega para a URL com ID (ex: /relatorio/viagens-cadastradas/editar/10)
    // O replace troca o placeholder ':id' pelo número real
    const urlEdicao = ROUTES.EDITAR_VIAGEM.replace(":id", String(viagemId));
    navigate(urlEdicao);
  };

  const handleVisualizar = (viagemId: number) => {
    navigate(ROUTES.PRODUCT);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Mantida igual */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Logo</h1>
        </div>

        <nav className="p-4">
          <div className="space-y-2">
            <button
              onClick={() => navigate(ROUTES.VIAGENS_CADASTRADAS)}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                location.pathname === ROUTES.VIAGENS_CADASTRADAS
                  ? "bg-blue-50 text-blue-600 border border-blue-200"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Viagens Cadastradas
            </button>

            <button
              onClick={() => navigate(ROUTES.RELATORIO)}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                location.pathname === ROUTES.RELATORIO
                  ? "bg-blue-50 text-blue-600 border border-blue-200"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Relatórios
            </button>
          </div>
        </nav>
      </div>

      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Viagens Cadastradas
          </h1>
          <button
            onClick={() => navigate(ROUTES.CADASTRAR_VIAGEM)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Cadastrar Viagem
          </button>
        </div>

        {/* Grid de Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {viagens.map((viagem) => (
            <div
              key={viagem.id}
              className="bg-white rounded-lg shadow-md border border-gray-200 flex flex-col"
            >
              <div className="p-6 border-b border-gray-200 flex-grow">
                <h3 className="text-xl font-bold text-gray-900">
                  {viagem.nome}
                </h3>
                <p className="text-gray-600 text-sm mt-1 line-clamp-3">
                  {viagem.descricao}
                </p>
              </div>

              <div className="p-6 mt-auto">
                <ul className="space-y-2 mb-4">
                  {viagem.itens?.slice(0, 3).map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center text-gray-700 text-sm"
                    >
                      <span className="mr-2 text-green-500">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold text-gray-900">
                    Valor:
                  </span>
                  <span className="text-xl font-bold text-blue-600">
                    {formatarValor(viagem.valor)}
                  </span>
                </div>

                <div className="border-t border-gray-200 my-4"></div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => handleEditar(viagem.id)}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => handleVisualizar(viagem.id)}
                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Visualizar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
