import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "@/paths";

interface FotoAdicional {
  nome: string;
  url: string;
}

export default function RegistrarPacoteFoto() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const [nomePacote, setNomePacote] = useState("");
  const [urlPrincipal, setUrlPrincipal] = useState("");

  // Inicializa com 4 campos vazios
  const [fotosAdicionais, setFotosAdicionais] = useState<FotoAdicional[]>(
    Array(4).fill({ nome: "", url: "" })
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      fetch(`/api/pacote-foto/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setNomePacote(data.nome);
          setUrlPrincipal(data.fotoDoPacote);

          // Se tiver fotos do banco, preenche. Se tiver menos de 4, completa com vazios.
          let loadedFotos = [];
          if (data.fotos && data.fotos.length > 0) {
            loadedFotos = data.fotos.map((f: any) => ({
              nome: f.nome,
              url: f.url,
            }));
          }

          // Garante no mínimo 4 campos para edição também, se quiser manter a consistência UI
          while (loadedFotos.length < 4) {
            loadedFotos.push({ nome: "", url: "" });
          }

          setFotosAdicionais(loadedFotos);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id, isEditing]);

  const handleFotoChange = (
    index: number,
    field: keyof FotoAdicional,
    value: string
  ) => {
    const novasFotos = [...fotosAdicionais];
    novasFotos[index] = { ...novasFotos[index], [field]: value };
    setFotosAdicionais(novasFotos);
  };

  const adicionarCampo = () => {
    setFotosAdicionais([...fotosAdicionais, { nome: "", url: "" }]);
  };

  const removerCampo = (index: number) => {
    const novasFotos = fotosAdicionais.filter((_, i) => i !== index);
    setFotosAdicionais(novasFotos);
  };

  const handleSalvar = async () => {
    if (!nomePacote || !urlPrincipal) {
      alert("Nome do pacote e Foto Principal são obrigatórios.");
      return;
    }

    // Filtra campos vazios antes de enviar
    const fotosParaEnviar = fotosAdicionais.filter(
      (f) => f.nome.trim() !== "" && f.url.trim() !== ""
    );

    const payload = {
      nome: nomePacote,
      url: urlPrincipal,
      fotosAdicionais: fotosParaEnviar,
    };

    try {
      const url = isEditing ? `/api/pacote-foto/${id}` : "/api/pacote-foto";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Salvo com sucesso!");
        navigate(ROUTES.PACOTES_FOTO_LISTA);
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
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1 p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? "Editar Pacote de Fotos" : "Novo Pacote de Fotos"}
            </h1>
            <button
              onClick={() => navigate(-1)}
              className="text-gray-500 hover:text-gray-700"
            >
              Cancelar
            </button>
          </div>

          {/* Dados Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Pacote
              </label>
              <input
                type="text"
                value={nomePacote}
                onChange={(e) => setNomePacote(e.target.value)}
                placeholder="Ex: Praias do Nordeste"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Foto Principal (Capa)
              </label>
              <input
                type="text"
                value={urlPrincipal}
                onChange={(e) => setUrlPrincipal(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {urlPrincipal && (
            <div className="mb-8">
              <span className="text-xs text-gray-400">Prévia da Capa:</span>
              <img
                src={urlPrincipal}
                alt="Capa"
                className="h-40 w-full object-cover rounded-md mt-1 bg-gray-100"
              />
            </div>
          )}

          <div className="border-t border-gray-200 my-6"></div>

          {/* Fotos Adicionais */}
          <div className="mb-4 flex justify-between items-end">
            <h2 className="text-lg font-semibold text-gray-800">
              Fotos Adicionais
            </h2>
          </div>

          <div className="space-y-4">
            {fotosAdicionais.map((foto, index) => (
              <div
                key={index}
                className="flex gap-4 items-start bg-gray-50 p-4 rounded-lg border border-gray-200"
              >
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Nome da Foto {index + 1}
                  </label>
                  <input
                    type="text"
                    value={foto.nome}
                    onChange={(e) =>
                      handleFotoChange(index, "nome", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:border-blue-500 outline-none text-sm"
                  />
                </div>
                <div className="flex-[2]">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    URL da Imagem
                  </label>
                  <input
                    type="text"
                    value={foto.url}
                    onChange={(e) =>
                      handleFotoChange(index, "url", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:border-blue-500 outline-none text-sm"
                  />
                </div>
                {/* Botão remover só aparece se tiver mais que 1 campo ou se for o usuário removendo extras */}
                <button
                  onClick={() => removerCampo(index)}
                  className="mt-6 text-red-500 hover:text-red-700 text-sm font-medium"
                  title="Remover linha"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={adicionarCampo}
              className="text-blue-600 font-medium hover:bg-blue-50 px-4 py-2 rounded transition-colors"
            >
              + Adicionar mais um campo
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleSalvar}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md"
            >
              {isEditing ? "Salvar Alterações" : "Registrar Pacote de Fotos"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
