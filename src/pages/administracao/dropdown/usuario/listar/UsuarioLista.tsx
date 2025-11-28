import DataList from "@/components/administracao/lista/dataList";
import { useEffect, useState } from "react";

interface Usuario {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  cadastro: string;
}

export interface InvalidUsersResponse {
  users: Usuario[];
}

const renderUserValue = (user: Usuario, key: string) => {
  switch (key) {
    case "cadastro":
      return user.cadastro;
    default:
      return user[key as keyof Usuario];
  }
};

const userHeaders = ["Nome", "CPF", "Email", "Telefone", "Cadastro", "Valido"];
const userKeys = ["nome", "cpf", "email", "telefone", "cadastro", "valido"];

export default function UsuarioLista() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

  const ValidarUsuario = async (id: number) => {
    try {
      const response = await fetch(`/api/usuario/validar/${id}`, {
        method: "PATCH",
        credentials: "include",
      });

      if (response.ok) {
        alert("Usuário validado com sucesso!");
        fetchUsers();
      } else {
        const msg = await response.text();
        alert(`Erro ao validar: ${msg}`);
      }
    } catch (error) {
      alert("Erro de conexão ao tentar validar.");
    }
  };

  const fetchUsers = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/usuario/invalidos", {
        credentials: "include",
      });
      const result = await response.json();
      console.log(result);
      setUsuarios(result);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const usuarioActions = [
    {
      name: "Validar",
      colorClass: "text-blue-600 hover:text-blue-900",
      handler: ValidarUsuario,
    },
  ];

  if (usuarios.length <= 0) {
    return <p>{"Não cadastro novos"}</p>;
  }

  return (
    <DataList<Usuario>
      loading={loading}
      pageTitle="Atualizar Usuários"
      buttonText="Novo Usuário"
      registerPath="#"
      data={usuarios}
      headers={userHeaders}
      dataKeys={userKeys}
      renderValue={renderUserValue}
      actions={usuarioActions}
    />
  );
}
