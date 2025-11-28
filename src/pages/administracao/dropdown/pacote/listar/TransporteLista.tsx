import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/paths";
import DataList from "@/components/administracao/lista/dataList";

interface Transporte {
  id: number;
  empresa: string;
  meio: string;
  preco: number;
}

const renderTransporteValue = (item: Transporte, key: string) => {
  switch (key) {
    case "preco":
      return `R$ ${item.preco.toFixed(2).replace(".", ",")}`;
    default:
      return item[key as keyof Transporte];
  }
};

const transporteHeaders = ["ID", "Empresa", "Meio", "Custo Base"];
const transporteKeys = ["id", "empresa", "meio", "preco"];

export default function TransporteLista() {
  const navigate = useNavigate();
  const [transportes, setTransportes] = useState<Transporte[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransportes = () => {
    fetch("/api/transporte/transporte")
      .then((res) => res.json())
      .then((data) => {
        setTransportes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTransportes();
  }, []);

  const handleEdit = (id: number) => {
    navigate(ROUTES.EDITAR_TRANSPORTE.replace(":id", String(id)));
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Deseja realmente excluir este transporte?")) return;

    try {
      const response = await fetch(`/api/transporte/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Transporte excluído com sucesso!");
        fetchTransportes();
      } else {
        const msg = await response.text();
        alert(`Erro: ${msg}`);
      }
    } catch (error) {
      alert("Erro de conexão ao tentar excluir.");
    }
  };

  const transporteActions = [
    {
      name: "Editar",
      colorClass: "text-blue-600 hover:text-blue-900",
      handler: handleEdit,
    },
    {
      name: "Excluir",
      colorClass: "text-red-600 hover:text-red-900",
      handler: handleDelete,
    },
  ];

  return (
    <DataList<Transporte>
      loading={loading}
      pageTitle="Gerenciar Transportes"
      buttonText="Novo Transporte"
      registerPath={ROUTES.REGISTRAR_TRANSPORTE}
      data={transportes}
      headers={transporteHeaders}
      dataKeys={transporteKeys}
      renderValue={renderTransporteValue}
      actions={transporteActions}
    />
  );
}
