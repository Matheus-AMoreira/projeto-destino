import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // 💡 Importar useLocation
import { ROUTES } from "@/paths";
import PacoteCard, { type Pacote } from "@/components/busca/PacoteCard";
import logo from "/icon.png";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { MdOutlineTravelExplore } from "react-icons/md";
import { FaFireAlt } from "react-icons/fa";
import { PiPackageBold } from "react-icons/pi";

export default function BuscarPacotes() {
  const navigate = useNavigate();
  const location = useLocation(); // 💡 Usar useLocation

  // Extrai o termo de busca inicial do state, se existir
  const termoBuscaInicial = (location.state as { termoBuscaInicial?: string })?.termoBuscaInicial || "";

  const [pacotes, setPacotes] = useState<Pacote[]>([]);
  const [topPacotes, setTopPacotes] = useState<Pacote[]>([]);

  const [loading, setLoading] = useState(true);
  const [erro, setError] = useState("");

  // 💡 Inicializa o termoBusca com o valor recebido do state (ou string vazia)
  const [termoBusca, setTermoBusca] = useState(termoBuscaInicial);
  const [filtroPrecoMaximo, setFiltroPrecoMaximo] = useState<number | "">("");

  useEffect(() => {
    // ... [Restante do useEffect de busca de dados] ...
    const fetchData = async () => {
      setLoading(true);
      const [pacotesResponse, topPacotesResponse] = await Promise.all([
        fetch("/api/publico/pacote"),
        fetch("/api/publico/pacote/mais-vendidos"),
      ]).catch((err) => {
        console.error("Erro ao buscar dados:", err);
        setError("Não foi possível buscar pelos pacotes ou top pacotes.");
        return [];
      });

      if (pacotesResponse && pacotesResponse.ok) {
        const result = await pacotesResponse.json();
        setPacotes(result);
      } else {
        setError("Não foi possível buscar pelos pacotes");
      }

      if (topPacotesResponse && topPacotesResponse.ok) {
        const result = await topPacotesResponse.json();
        setTopPacotes(result);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const aplicarFiltros = (pacotes: Pacote[]) => {
    let listaFiltrada = pacotes;
    const termo = termoBusca.toLowerCase().trim();

    // 1. Filtrar por Termo de Busca (nome ou cidade do hotel)
    if (termo) {
      listaFiltrada = listaFiltrada.filter((pacote) => {
        const destino = pacote.hotel?.cidade?.nome || "";

        return (
          pacote.nome.toLowerCase().includes(termo) ||
          destino.toLowerCase().includes(termo)
        );
      });
    }

    // 2. Filtrar por Preço Máximo
    if (typeof filtroPrecoMaximo === "number" && filtroPrecoMaximo > 0) {
      listaFiltrada = listaFiltrada.filter(
        (pacote) => pacote.preco <= filtroPrecoMaximo
      );
    }

    return listaFiltrada;
  };

  // Como o `termoBusca` é inicializado com o valor do state e o filtro depende
  // de `termoBusca`, o resultado já será filtrado na primeira renderização.
  const pacotesFiltrados = aplicarFiltros(pacotes);

  const handlePrecoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setFiltroPrecoMaximo(valor === "" ? "" : Number(valor));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* ... [Sidebar e demais elementos] ... */}
      <div className="w-80 bg-white shadow-lg shrink-0 hidden lg:block">
          <div className="flex justify-center md:w-2.1 pt-5">
          <img
            src={logo}
            alt="logo"
            className="max-w-[300px] rounded-xl shadow-lg object-contain p-3"
          />
        </div>
        <nav className="p-6 space-y-8">
          <div>
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center space-x-2">
              <FaMoneyCheckAlt className="text-xl" />
              <span>Preço Máximo</span>
            </h2>
            <input
              type="number"
              value={filtroPrecoMaximo}
              onChange={handlePrecoChange}
              placeholder="R$ 0,00"
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </nav>
      </div>

      <div className="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
        {loading && <div className="text-center p-10">Carregando...</div>}

        <div className="mb-8">
          <form onSubmit={(e) => e.preventDefault()} className="flex gap-4">
            <div className="flex-1 relative">
              <MdOutlineTravelExplore className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                placeholder="Busque por destino ou nome do pacote..."
                className="w-full pl-12 pr-6 py-4 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none text-lg"
              />
            </div>
          </form>
        </div>

        {!loading && !erro && topPacotes.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
              <FaFireAlt className="text-3xl" />
              <span>Destinos Mais Buscados</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {topPacotes.map((pacote) => (
                <PacoteCard key={pacote.id} pacote={pacote} />
              ))}
            </div>
          </section>
        )}

        <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-6 flex items-center space-x-3">
          <PiPackageBold className="text-3xl" />
          <span>Pacotes Encontrados ({pacotesFiltrados.length})</span>
        </h2>
        {!loading && (
          <>
            {pacotesFiltrados.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {pacotesFiltrados.map((pacote) => (
                  <PacoteCard key={pacote.id} pacote={pacote} />
                ))}
              </div>
            ) : (
              <div className="text-center p-10 text-gray-600 border border-dashed rounded-xl mt-10">
                Nenhum pacote encontrado com os filtros e termos de busca
                aplicados.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}