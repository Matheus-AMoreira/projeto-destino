import { ROUTES } from "@/paths";
import { useSession } from "@/store/sessionStore";
import logo from "/LogoPaulaViagensVetor_2.png";
import { Link } from "react-router-dom";

export default function Navbar() {
  const session = useSession();

  return (
    <header className="flex flex-wrap items-center place-content-between py-1 px-[30px] bg-[#ff944d] pt-3 pb-1">
      <Link
        to={ROUTES.LANDINGPAGE}
        className="font-bold text-3xl text-white pl-15"
      >
        <div className="flex flex-col items-start">
          <img src={logo} alt="Logo" className="w-25 select-none" />
        </div>
      </Link>
      <nav className="flex flex-wrap gap-15 pr-20 pl-10 text-xl">
        <Link
          to={ROUTES.BUSCAR_PACOTES}
          className="text-white hover:text-[#2071b3]"
        >
          Buscar por pacotes
        </Link>
        <Link to={ROUTES.CONTATO} className="text-white hover:text-[#2071b3]">
          Contato
        </Link>
        {session.usuario?.perfil == "ADMINISTRADOR" && (
          <Link
            to={ROUTES.RELATORIO}
            className="text-white hover:text-[#2071b3]"
          >
            Administração
          </Link>
        )}
        {session.isLoged ? (
          <div>
            <span className="text-white">
              Usuário: {session.usuario?.nomeCompleto} |{" "}
            </span>
            <button
              className="text-(--navbar-blue-text) hover:underline hover:cursor-pointer"
              onClick={() => {
                useSession.getState().logout();
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <Link to={ROUTES.LOGIN} className="text-white hover:text-[#2071b3]">
            Login
          </Link>
        )}
      </nav>
    </header>
  );
}
