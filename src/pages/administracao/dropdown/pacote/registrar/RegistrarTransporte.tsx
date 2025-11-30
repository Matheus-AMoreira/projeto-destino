import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "@/paths";
import { useSession } from "@/store/sessionStore";

export default function RegistrarTransporte() {
  const navigate = useNavigate();
  const { usuario } = useSession();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const [empresa, setEmpresa] = useState("");
  const [meio, setMeio] = useState("AEREO");
  const [preco, setPreco] = useState<number>(0);
  const [loading, setLoading] = useState(isEditing);

  useEffect(() => {
    const editar = async () => {
      try {
        const response = await fetch(`/api/transporte/${id}`, {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${usuario?.accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Transporte não existe");
        }

        const result = await response.json();

        setEmpresa(result.empresa);
        setMeio(result.meio);
        setPreco(result.preco);
      } catch (erro) {
        console.log(erro);
      } finally {
        setLoading(false);
      }
    };
    if (isEditing) {
      editar();
    }
  }, [id, isEditing]);

  const handleSalvar = async () => {
    if (!empresa) {
      alert("Informe o nome da empresa.");
      return;
    }

    const payload = {
      empresa,
      meio,
      preco: Number(preco),
    };

    try {
      const url = isEditing ? `/api/transporte/${id}` : "/api/transporte";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${usuario?.accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert(isEditing ? "Transporte atualizado!" : "Transporte criado!");
        navigate(ROUTES.TRANSPORTES_LISTA);
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
        {isEditing ? "Editar Transporte" : "Novo Transporte"}
      </h1>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Empresa</label>
          <input
            type="text"
            value={empresa}
            onChange={(e) => setEmpresa(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Ex: Latam"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Meio de Transporte
            </label>
            <select
              value={meio}
              onChange={(e) => setMeio(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="AEREO">Aéreo</option>
              <option value="TERRESTRE">Terrestre</option>
              <option value="MARITIMO">Marítimo</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Custo Base (R$)
            </label>
            <input
              type="number"
              value={preco}
              onChange={(e) => setPreco(Number(e.target.value))}
              className="w-full border p-2 rounded"
            />
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
