import { useState, useEffect } from "react";

export interface ChartData {
  name: string;
  value: number;
}

interface DashboardDataState {
  statusData: ChartData[];
  transporteData: ChartData[];
  viagensMensaisData: ChartData[];
  comprasMensaisData: ChartData[];
  loading: boolean;
  error: string | null;
}

export const useDashboardData = () => {
  const [data, setData] = useState<DashboardDataState>({
    statusData: [],
    transporteData: [],
    viagensMensaisData: [],
    comprasMensaisData: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Promise.all garante que todas carreguem juntas
        const [resStatus, resTransporte, resViagens, resCompras] =
          await Promise.all([
            fetch("/api/dashboard/status-viagem"),
            fetch("/api/dashboard/transporte-stats"),
            fetch("/api/dashboard/viagens/mensais"),
            fetch("/api/dashboard/viagens/vendidos"),
          ]);

        if (
          !resStatus.ok ||
          !resTransporte.ok ||
          !resViagens.ok ||
          !resCompras.ok
        ) {
          throw new Error("Falha ao buscar dados do dashboard");
        }

        const statusData = await resStatus.json();
        const transporteData = await resTransporte.json();
        const viagensMensaisData = await resViagens.json();
        const comprasMensaisData = await resCompras.json();

        setData({
          statusData,
          transporteData,
          viagensMensaisData,
          comprasMensaisData,
          loading: false,
          error: null,
        });
      } catch (err) {
        console.error(err);
        setData((prev) => ({
          ...prev,
          loading: false,
          error: "Erro ao carregar dados. Tente atualizar a página.",
        }));
      }
    };

    fetchData();
  }, []);

  return data;
};
