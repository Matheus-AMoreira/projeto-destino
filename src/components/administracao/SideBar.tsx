import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "@/paths";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Estado para controlar o dropdown de Administração
  const [isAdminOpen, setIsAdminOpen] = useState(true);

  const isActive = (path: string) => location.pathname === path;

  // Função auxiliar para estilos
  const linkClass = (path: string, isSubItem = false) => `
    w-full text-left px-4 py-2 rounded-lg font-medium transition-colors mb-1
    ${isSubItem ? "text-sm pl-8" : ""}
    ${
      isActive(path)
        ? "bg-blue-50 text-blue-600 border border-blue-200"
        : "text-gray-700 hover:bg-gray-100"
    }
  `;

  return (
    <div className="w-64 bg-white shadow-lg flex-shrink-0 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-gray-200">
        <h1
          className="text-xl font-bold text-gray-900 cursor-pointer"
          onClick={() => navigate(ROUTES.LANDINGPAGE)}
        >
          Logo
        </h1>
      </div>

      <nav className="p-4 flex-1 overflow-y-auto">
        <div className="space-y-1">
          {/* Dashboard Geral */}
          <button
            onClick={() => navigate(ROUTES.RELATORIO)}
            className={linkClass(ROUTES.RELATORIO)}
          >
            Dashboard
          </button>

          {/* Menu Dropdown de Gerenciamento */}
          <div>
            <button
              onClick={() => setIsAdminOpen(!isAdminOpen)}
              className="w-full text-left px-4 py-2 rounded-lg font-bold text-gray-800 hover:bg-gray-50 flex justify-between items-center"
            >
              <span>Administração</span>
              <span
                className={`transform transition-transform ${
                  isAdminOpen ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>

            {isAdminOpen && (
              <div className="mt-1 space-y-1">
                <button
                  onClick={() => navigate(ROUTES.VIAGENS_CADASTRADAS)}
                  className={linkClass(ROUTES.VIAGENS_CADASTRADAS, true)}
                >
                  Pacotes de Viagem
                </button>

                <button
                  onClick={() => navigate(ROUTES.PACOTES_FOTO_LISTA)}
                  className={linkClass(ROUTES.PACOTES_FOTO_LISTA, true)}
                >
                  Pacotes de Fotos
                </button>

                <button
                  onClick={() => navigate(ROUTES.HOTEIS_LISTA)}
                  className={linkClass(ROUTES.HOTEIS_LISTA, true)}
                >
                  Hotéis
                </button>

                <button
                  onClick={() => navigate(ROUTES.TRANSPORTES_LISTA)}
                  className={linkClass(ROUTES.TRANSPORTES_LISTA, true)}
                >
                  Transportes
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="p-4 border-t text-xs text-gray-400 text-center">
        Versão 1.0.0
      </div>
    </div>
  );
}
