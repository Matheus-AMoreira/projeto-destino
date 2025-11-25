import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface Hotel {
  id: number;
  nome: string;
  diaria: number;
}

interface Transporte {
  id: number;
  empresa: string;
  meio: "AEREO" | "TERRESTRE" | "MARITIMO";
  preco: number;
}

interface PacoteFormData {
  id?: number;
  nome: string;
  valor: number;
  descricao: string;
  dataIda: string;
  dataVolta: string;
  disponibilidade: number;
  tags: string;
  hotelId: number | "";
  transporteId: number | "";
}

const ID_FUNCIONARIO_TEMPORARIO = "fdc6bbde-bcae-4f19-afe6-91e0f0f999e1";

export default function CadastrarViagem() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [hoteis, setHoteis] = useState<Hotel[]>([]);
  const [transportes, setTransportes] = useState<Transporte[]>([]);
  const [loadingDados, setLoadingDados] = useState(true);

  const [isEditando, setIsEditando] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [formData, setFormData] = useState<PacoteFormData>({
    nome: "",
    valor: 0,
    descricao: "",
    dataIda: "",
    dataVolta: "",
    disponibilidade: 10,
    tags: "",
    hotelId: "",
    transporteId: "",
  });

  // REMOVIDO: converterDataParaInput não é mais necessário pois Back e Front falam yyyy-MM-dd

  useEffect(() => {
    const init = async () => {
      try {
        const [resHoteis, resTransportes] = await Promise.all([
          fetch("/api/hotel/"),
          fetch("/api/transporte/transporte"),
        ]);

        if (resHoteis.ok && resTransportes.ok) {
          setHoteis(await resHoteis.json());
          setTransportes(await resTransportes.json());
        }

        if (id) {
          setIsEditando(true);
          setEditId(Number(id));

          const resPacote = await fetch(`/api/pacote/id/${id}`);
          if (resPacote.ok) {
            const pacote = await resPacote.json();

            setFormData({
              id: pacote.id,
              nome: pacote.nome,
              valor: pacote.preco,
              descricao: pacote.descricao,
              // Backend agora retorna yyyy-MM-dd, que é nativo do input type="date"
              dataIda: pacote.inicio,
              dataVolta: pacote.fim,
              disponibilidade: pacote.disponibilidade,
              tags: Array.isArray(pacote.tags) ? pacote.tags.join(", ") : "",
              hotelId: pacote.hotel?.id || "",
              transporteId: pacote.transporte?.id || "",
            });
          } else {
            alert("Erro ao carregar dados para edição.");
            navigate(-1);
          }
        }
      } catch (error) {
        console.error("Erro ao inicializar:", error);
      } finally {
        setLoadingDados(false);
      }
    };

    init();
  }, [id, navigate]);

  const handleInputChange = (field: keyof PacoteFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSalvar = async () => {
    if (!formData.nome.trim() || !formData.hotelId || !formData.transporteId) {
      alert("Preencha Nome, Hotel e Transporte.");
      return;
    }
    if (formData.valor <= 0) {
      alert("Valor deve ser positivo.");
      return;
    }

    const payload = {
      nome: formData.nome,
      descricao: formData.descricao,
      preco: formData.valor,
      inicio: formData.dataIda, // Envia yyyy-MM-dd
      fim: formData.dataVolta, // Envia yyyy-MM-dd
      disponibilidade: formData.disponibilidade,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((t) => t !== ""),
      hotel: Number(formData.hotelId),
      transporte: Number(formData.transporteId),
      funcionario: ID_FUNCIONARIO_TEMPORARIO,
    };

    try {
      let url = "/api/pacote";
      let method = "POST";

      if (isEditando && editId) {
        url = `/api/pacote/${editId}`;
        method = "PUT";
      }

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const msg = await response.text();
        alert(msg || (isEditando ? "Atualizado!" : "Cadastrado!"));
        navigate(-1);
      } else {
        const erroMsg = await response.text();
        alert(`Erro: ${erroMsg}`);
      }
    } catch (error) {
      console.error(error);
      alert("Erro de conexão.");
    }
  };

  if (loadingDados)
    return <div className="p-8 text-center text-gray-500">Carregando...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Cabeçalho */}
      <div className="max-w-4xl mx-auto px-4 mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Logo</h1>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            isEditando
              ? "bg-orange-100 text-orange-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {isEditando ? "✏️ Editando Viagem" : "➕ Nova Viagem"}
        </span>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-1">
              {isEditando ? `Editar: ${formData.nome}` : "Novo Pacote"}
            </h2>
          </div>

          {/* Nome */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Pacote
            </label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => handleInputChange("nome", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              placeholder="Ex: Férias em Cancún"
            />
          </div>

          {/* Preço e Vagas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preço (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.valor}
                onChange={(e) =>
                  handleInputChange("valor", parseFloat(e.target.value) || 0)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vagas
              </label>
              <input
                type="number"
                value={formData.disponibilidade}
                onChange={(e) =>
                  handleInputChange(
                    "disponibilidade",
                    parseInt(e.target.value) || 0
                  )
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* Hotel e Transporte */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hotel
              </label>
              <select
                value={formData.hotelId}
                onChange={(e) =>
                  handleInputChange("hotelId", Number(e.target.value))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="">Selecione um Hotel...</option>
                {hoteis.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.nome} (Diária: R$ {h.diaria})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transporte
              </label>
              <select
                value={formData.transporteId}
                onChange={(e) =>
                  handleInputChange("transporteId", Number(e.target.value))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="">Selecione um Transporte...</option>
                {transportes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.empresa} - {t.meio} (R$ {t.preco})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Descrição */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              rows={4}
              value={formData.descricao}
              onChange={(e) => handleInputChange("descricao", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none"
            />
          </div>

          {/* Tags */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (vírgula)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => handleInputChange("tags", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Datas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Ida
              </label>
              <input
                type="date"
                value={formData.dataIda}
                onChange={(e) => handleInputChange("dataIda", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Volta
              </label>
              <input
                type="date"
                value={formData.dataVolta}
                onChange={(e) => handleInputChange("dataVolta", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-gray-200 gap-3">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSalvar}
              className={`px-6 py-3 text-white rounded-lg font-medium hover:opacity-90 ${
                isEditando ? "bg-orange-600" : "bg-blue-600"
              }`}
            >
              {isEditando ? "Salvar Alterações" : "Cadastrar Viagem"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
