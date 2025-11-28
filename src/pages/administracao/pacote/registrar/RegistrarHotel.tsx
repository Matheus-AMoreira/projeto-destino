import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "@/paths";

// Interfaces corrigidas baseadas no modelo Java
interface Regiao {
  id: number;
  nome: string;
  sigla: string;
}

interface Estado {
  id: number;
  nome: string;
  sigla: string;
  regiao: Regiao;
}

interface Cidade {
  id: number;
  nome: string;
  estado: Estado;
}

export default function RegistrarHotel() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  // Dados do Formulário
  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [diaria, setDiaria] = useState<number>(0);

  // Controle de Localização (Cascata)
  const [selectedRegiao, setSelectedRegiao] = useState<number | "">("");
  const [selectedEstado, setSelectedEstado] = useState<number | "">("");
  const [selectedCidade, setSelectedCidade] = useState<number | "">("");

  // Listas para os Selects
  const [regioes, setRegioes] = useState<Regiao[]>([]);
  const [estados, setEstados] = useState<Estado[]>([]);
  const [cidades, setCidades] = useState<Cidade[]>([]);

  const [loading, setLoading] = useState(true);

  // 1. Carregar Regiões ao iniciar
  useEffect(() => {
    fetch("/api/hotel/regioes")
      .then((res) => res.json())
      .then((data) => {
        setRegioes(data);
        if (!isEditing) setLoading(false);
      })
      .catch(console.error);
  }, []);

  // 2. Carregar Estados quando Região mudar
  useEffect(() => {
    if (selectedRegiao) {
      fetch(`/api/hotel/estados/${selectedRegiao}`)
        .then((res) => res.json())
        .then(setEstados)
        .catch(console.error);
    } else {
      setEstados([]);
      setCidades([]);
    }
  }, [selectedRegiao]);

  // 3. Carregar Cidades quando Estado mudar
  useEffect(() => {
    if (selectedEstado) {
      fetch(`/api/hotel/cidades/${selectedEstado}`)
        .then((res) => res.json())
        .then(setCidades)
        .catch(console.error);
    } else {
      setCidades([]);
    }
  }, [selectedEstado]);

  // 4. Se for Edição, carregar dados do Hotel e preencher a cascata
  useEffect(() => {
    if (isEditing) {
      const loadData = async () => {
        try {
          const res = await fetch(`/api/hotel/${id}`);
          if (res.ok) {
            const hotel = await res.json();
            setNome(hotel.nome);
            setEndereco(hotel.endereco);
            setDiaria(hotel.diaria);

            // Preenchendo a cascata de trás para frente
            if (hotel.cidade) {
              const cidadeId = hotel.cidade.id;
              const estadoId = hotel.cidade.estado.id;
              const regiaoId = hotel.cidade.estado.regiao.id;

              // Seta os IDs para disparar os useEffects de cascata
              setSelectedRegiao(regiaoId);

              // Precisamos esperar os estados carregarem para setar o estado?
              // O React vai disparar o useEffect de selectedRegiao, buscar os estados...
              // Mas para garantir que o valor apareça selecionado, podemos pré-carregar manualmente aqui ou confiar no fluxo.
              // Para edição segura, vamos buscar as listas manuais aqui para garantir a ordem.

              const resEstados = await fetch(`/api/hotel/estados/${regiaoId}`);
              const listaEstados = await resEstados.json();
              setEstados(listaEstados);
              setSelectedEstado(estadoId);

              const resCidades = await fetch(`/api/hotel/cidades/${estadoId}`);
              const listaCidades = await resCidades.json();
              setCidades(listaCidades);
              setSelectedCidade(cidadeId);
            }
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      loadData();
    }
  }, [id, isEditing]);

  const handleSalvar = async () => {
    if (!nome || !endereco || !selectedCidade) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    const payload = {
      nome,
      endereco,
      diaria: Number(diaria),
      cidade: Number(selectedCidade),
    };

    try {
      const url = isEditing ? `/api/hotel/${id}` : "/api/hotel/";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert(isEditing ? "Hotel atualizado!" : "Hotel criado!");
        navigate(ROUTES.HOTEIS_LISTA);
      } else {
        alert("Erro ao salvar.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro de conexão.");
    }
  };

  if (loading) return <div className="p-8">Carregando...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">
        {isEditing ? "Editar Hotel" : "Novo Hotel"}
      </h1>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Nome do Hotel
          </label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Ex: Hotel Copacabana Palace"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Endereço</label>
          <input
            type="text"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Av. Atlântica, 1702"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Diária (R$)</label>
          <input
            type="number"
            value={diaria}
            onChange={(e) => setDiaria(Number(e.target.value))}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="border-t pt-4 mt-4">
          <h3 className="text-lg font-medium mb-3">Localização</h3>

          <div className="grid grid-cols-1 gap-4">
            {/* Select Região */}
            <div>
              <label className="block text-sm font-medium mb-1">Região</label>
              <select
                value={selectedRegiao}
                onChange={(e) => {
                  setSelectedRegiao(Number(e.target.value));
                  setSelectedEstado(""); // Reseta filhos
                  setSelectedCidade("");
                }}
                className="w-full border p-2 rounded"
              >
                <option value="">Selecione a Região...</option>
                {regioes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* Select Estado (Desabilitado se não tiver Região) */}
            <div>
              <label className="block text-sm font-medium mb-1">Estado</label>
              <select
                value={selectedEstado}
                onChange={(e) => {
                  setSelectedEstado(Number(e.target.value));
                  setSelectedCidade(""); // Reseta filho
                }}
                className="w-full border p-2 rounded disabled:bg-gray-100"
                disabled={!selectedRegiao}
              >
                <option value="">Selecione o Estado...</option>
                {estados.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nome} ({e.sigla})
                  </option>
                ))}
              </select>
            </div>

            {/* Select Cidade (Desabilitado se não tiver Estado) */}
            <div>
              <label className="block text-sm font-medium mb-1">Cidade</label>
              <select
                value={selectedCidade}
                onChange={(e) => setSelectedCidade(Number(e.target.value))}
                className="w-full border p-2 rounded disabled:bg-gray-100"
                disabled={!selectedEstado}
              >
                <option value="">Selecione a Cidade...</option>
                {cidades.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            onClick={handleSalvar}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
