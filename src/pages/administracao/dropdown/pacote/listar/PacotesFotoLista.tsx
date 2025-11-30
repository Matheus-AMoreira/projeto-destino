import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/paths";
import { useSession } from "@/store/sessionStore";

interface PacoteFoto {
  id: number;
  nome: string;
  fotoDoPacote: string;
  fotos?: any[];
}

export default function PacotesFotoLista() {
  const navigate = useNavigate();
  const { usuario, isLoading } = useSession();
  const [pacotes, setPacotes] = useState<PacoteFoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchHoteis = async () => {
      if (!usuario || !usuario.accessToken) return;

      setLoading(true);
      try {
        const response = await fetch("/api/pacote-foto", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${usuario.accessToken}`,
          },
          credentials: "include",
        });

        if (!response.ok) throw new Error("Erro ao buscar hotéis");

        const result = await response.json();
        setPacotes(result);
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

  const handleEditar = (id: number) => {
    navigate(ROUTES.EDITAR_FOTOS.replace(":id", String(id)));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Pacotes de Fotos</h1>
          <button
            onClick={() => navigate(ROUTES.REGISTRAR_FOTOS)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Novo Pacote de Fotos
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500">Carregando...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pacotes.map((pct) => (
              <div
                key={pct.id}
                className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden"
              >
                <img
                  src={pct.fotoDoPacote}
                  alt={pct.nome}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{pct.nome}</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {pct.fotos?.length || 0} fotos adicionais
                  </p>
                  <button
                    onClick={() => handleEditar(pct.id)}
                    className="w-full border border-blue-600 text-blue-600 py-2 rounded hover:bg-blue-50"
                  >
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
