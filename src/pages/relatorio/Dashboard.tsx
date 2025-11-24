import { BarChartComponent } from "@/components/relatorio/BarChartComponent";
import { PieChartComponent } from "@/components/relatorio/PieChartComponent";
import { ROUTES } from "@/paths";
import { useDashboardData } from "@/utils/useDashboardData";
import { useNavigate, useLocation } from "react-router-dom";

const COLORS_STATUS = ["#00C49F", "#FFBB28", "#FF8042"];
const COLORS_TRANSPORTE = ["#0088FE", "#8884d8", "#82ca9d"];

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    statusData,
    transporteData,
    viagensMensaisData,
    comprasMensaisData,
    loading,
    error,
  } = useDashboardData();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* --- Sidebar --- */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Logo</h1>
        </div>

        <nav className="p-4">
          <div className="space-y-2">
            <button
              onClick={() => navigate(ROUTES.VIAGENS_CADASTRADAS)}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                location.pathname === ROUTES.VIAGENS_CADASTRADAS
                  ? "bg-blue-50 text-blue-600 border border-blue-200"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Viagens Cadastradas
            </button>
            <button
              onClick={() => navigate(ROUTES.RELATORIO)}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                location.pathname === ROUTES.RELATORIO
                  ? "bg-blue-50 text-blue-600 border border-blue-200"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Relatórios
            </button>
          </div>
        </nav>
      </div>

      {/* --- Conteúdo Principal --- */}
      <div className="flex-1 p-8">
        {loading && (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500 text-lg animate-pulse">
              Carregando indicadores...
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Linha 1: Gráficos de Pizza */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <PieChartComponent
                title="Status das Viagens"
                data={statusData}
                colors={COLORS_STATUS}
              />
              <PieChartComponent
                title="Meios de Transporte"
                data={transporteData}
                colors={COLORS_TRANSPORTE}
              />
            </div>

            {/* Linha 2: Gráficos de Barra (Novos) */}
            <div className="space-y-8">
              {/* Viagens Concluídas por Mês */}
              <BarChartComponent
                title="Viagens Concluídas por Mês"
                data={viagensMensaisData}
                xAxisKey="name" // O DTO retorna 'name' (ex: Jan) e 'value'
                bars={[
                  {
                    key: "value",
                    label: "Viagens Concluídas",
                    color: "#82ca9d",
                  },
                ]}
              />

              {/* Compras Realizadas por Mês */}
              <BarChartComponent
                title="Volume de Compras por Mês"
                data={comprasMensaisData}
                xAxisKey="name"
                bars={[
                  {
                    key: "value",
                    label: "Vendas Realizadas",
                    color: "#8884d8",
                  },
                ]}
              />
            </div>
          </>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Lorem ipsum dolor sit amet
            </h3>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Lorem ipsum dolor sit amet
            </h3>
            <p className="text-gray-600">
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
