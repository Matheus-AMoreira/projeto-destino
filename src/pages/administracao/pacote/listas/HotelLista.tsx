import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/paths";

interface cidade {
  id: number;
  nome: String;
  endereco: String;
  diaria: number;
  estado: {
    id: number;
    nome: String;
    sigla: String;
    regiao: {
      id: number;
      nome: String;
      sigla: String;
    };
  };
}

interface Hotel {
  id: number;
  nome: string;
  diaria: number;
  cidade: cidade;
}

export default function HotelLista() {
  const navigate = useNavigate();
  const [hoteis, setHoteis] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHoteis = () => {
    fetch("/api/hotel/")
      .then((res) => res.json())
      .then((data) => {
        setHoteis(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchHoteis();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Deseja realmente excluir este hotel?")) return;

    try {
      const response = await fetch(`/api/hotel/${id}`, { method: "DELETE" });

      if (response.ok) {
        alert("Hotel excluído com sucesso!");
        fetchHoteis();
      } else {
        const msg = await response.text();
        alert(`Erro: ${msg}`);
      }
    } catch (error) {
      alert("Erro de conexão ao tentar excluir.");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Gerenciar Hotéis</h1>
        <button
          onClick={() => navigate(ROUTES.REGISTRAR_HOTEL)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Novo Hotel
        </button>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Local
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Diária
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {hoteis.map((hotel) => (
                <tr key={hotel.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {hotel.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {hotel.nome}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {hotel.cidade
                      ? `${hotel.cidade.nome}/${hotel.cidade.estado.sigla}`
                      : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    R$ {hotel.diaria}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() =>
                        navigate(
                          ROUTES.EDITAR_HOTEL.replace(":id", String(hotel.id))
                        )
                      }
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(hotel.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
