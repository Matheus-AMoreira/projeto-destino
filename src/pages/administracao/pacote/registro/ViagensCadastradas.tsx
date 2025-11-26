import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/paths";
import { useViagens } from "@/utils/buscarFunctions";

export default function ViagensCadastradas() {
  const { viagens } = useViagens();
  const navigate = useNavigate();

  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
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

        {/* Grid de Cards (Código mantido igual) */}
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
                    onClick={() =>
                      navigate(
                        ROUTES.EDITAR_VIAGEM.replace(":id", String(viagem.id))
                      )
                    }
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() =>
                      navigate(
                        ROUTES.PACOTE_DETALHES.replace(":id", String(viagem.id))
                      )
                    }
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
