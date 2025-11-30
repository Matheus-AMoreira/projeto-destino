import { useSession } from "@/store/sessionStore";

export interface Usuario {
  id?: string;
  nome: string;
  sobreNome: string;
  cpf: string;
  email: string;
  telefone: string;
  perfil?: string;
  valido?: boolean;
  atualização: string;
  cadastro: string;
  senha: string;
}

export interface RegistroUser {
  nome: string;
  sobreNome: string;
  cpf: string;
  email: string;
  telefone: string;
  senha: string;
}

interface RegistrationResponse {
  error: boolean;
  mensagem: string;
}

export const cadastrarUsuario = async (
  usuario: RegistroUser | null
): Promise<RegistrationResponse> => {
  if (usuario) {
    const response = await fetch("api/auth/singup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usuario),
    });

    return await response.json();
  }
  return { error: true, mensagem: "Usuário inválido" };
};

export const logout = async (): Promise<string> => {
  try {
    const response = await fetch("api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    const result: string = await response.json();
    return result;
  } catch (error: unknown) {
    return "erro";
  }
};

export interface InvalidUsersResponse {
  error: boolean;
  mensagem: string;
  users: Usuario[] | null;
}

export const listInvalidUsers = async (): Promise<InvalidUsersResponse> => {
  const response = await fetch("api/auth/usuarios/invalidos", {
    credentials: "include",
  });
  console.log(response);
  if (!response.ok) {
    return {
      error: true,
      mensagem: "Não foi possivel chamar a API",
      users: null,
    };
  }

  const result: Usuario[] = await response.json();
  console.log(result);
  if (result.length > 0) {
    return {
      error: false,
      mensagem: "Nenhum usuários encontrado para validação!",
      users: result,
    };
  }
  return { error: false, mensagem: "Usuários encontrados!", users: result };
};

export interface ValidarUsuarioResponse {
  error: boolean;
  mensagem: string;
}

export const ValidarUsuario = async (
  userId: string
): Promise<ValidarUsuarioResponse> => {
  try {
    const response = await fetch(`api/auth/usuarios/validar/${userId}`, {
      method: "PATCH",
      credentials: "include",
    });

    if (!response.ok) {
      return {
        error: true,
        mensagem: "Não foi possivel chamar a API",
      };
    }

    return await response.json();
  } catch (error: unknown) {
    return { error: true, mensagem: "Erro inesperado!" };
  }
};
