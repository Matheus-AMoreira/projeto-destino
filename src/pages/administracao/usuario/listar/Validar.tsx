import UsersList from "@/components/validar/usersList";
import {
  listInvalidUsers,
  ValidarUsuario,
  type InvalidUsersResponse,
} from "@/utils/auth/authFunctions";
import { useEffect, useState } from "react";

export default function Validar() {
  const [users, setUsers] = useState<InvalidUsersResponse>({
    error: false,
    mensagem: "",
    users: [],
  });

  useEffect(() => {
    (async () => {
      try {
        const result = await listInvalidUsers();
        setUsers(result);
      } catch (error) {
        setUsers({
          error: true,
          mensagem: "Falha ao chamar a função de busca!",
          users: null,
        });
      }
    })();
  }, []);

  return (
    <>
      {users.users ? (
        users.users.length > 0 &&
        users.users?.map((user) => (
          <div>
            <p>{user.nome}</p>
            <p>{user.cpf}</p>
            <p>{user.email}</p>
            <p>{user.telefone}</p>
            <p>{user.cadastro}</p>
            <button
              className="cursor-pointer"
              onClick={() => {
                ValidarUsuario(user.id);
              }}
            >
              Validar
            </button>
          </div>
        ))
      ) : (
        <p>{users.mensagem}</p>
      )}
    </>
  );
}
