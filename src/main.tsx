import { createBrowserRouter, RouterProvider } from "react-router-dom";

import React from "react";
import ReactDOM from "react-dom/client";

import "@/index.css";
import { ROTAS_BASE, ROUTES } from "./paths";
import ContactPage from "./pages/contato/ContactPage";
import LandingPage from "./pages/landingPage/LandingPage";
import App from "./App";
import Cadastro from "./pages/auth/Cadastro";
import Login from "./pages/auth/Login";
import ViagensCadastradas from "./pages/administracao/dropdown/pacote/registrar/ViagensCadastradas";
import Validar from "./pages/administracao/dropdown/usuario/listar/UsuarioLista";
import VisualizarViagem from "./pages/usuario/VisualizarViagem";
import CheckoutPage from "./pages/checkout/CheckoutPage";
import ConfirmacaoPage from "./pages/checkout/confirmacao/Confirmacao";
import RegistrarPacoteFoto from "./pages/administracao/dropdown/pacote/registrar/RegistrarPacoteFoto";
import PacotesFotoLista from "./pages/administracao/dropdown/pacote/listar/PacotesFotoLista";
import Dashboard from "./pages/administracao/dashboard/Dashboard";
import AdminLayout from "./pages/administracao/AdminLayout";
import HotelLista from "./pages/administracao/dropdown/pacote/listar/HotelLista";
import TransporteLista from "./pages/administracao/dropdown/pacote/listar/TransporteLista";
import RegistrarHotel from "./pages/administracao/dropdown/pacote/registrar/RegistrarHotel";
import RegistrarTransporte from "./pages/administracao/dropdown/pacote/registrar/RegistrarTransporte";
import Pacote from "./pages/Busca/pacote/Pacote";
import BuscarPacotes from "./pages/Busca/BuscarPacotes";
import CadastrarViagem from "./components/administracao/pacote/CadastrarViagem";

const router = createBrowserRouter([
  {
    path: ROUTES.LANDINGPAGE,
    element: <App />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: ROUTES.CONTATO,
        element: <ContactPage />,
      },
      {
        path: ROUTES.BUSCAR_PACOTES,
        element: <BuscarPacotes />,
      },
      {
        path: ROUTES.PACOTE_DETALHES,
        element: <Pacote />,
      },
      {
        path: `${ROUTES.VIAGEM}/visualizar`,
        element: <VisualizarViagem />,
      },
      {
        path: ROUTES.CHECKOUT,
        element: <CheckoutPage />,
      },
      {
        path: ROUTES.CONFIRMACAO,
        element: <ConfirmacaoPage />,
      },
      {
        path: `${ROTAS_BASE.ADMINISTRACAO}`,
        element: <AdminLayout />,
        children: [
          { path: "dashboard", element: <Dashboard /> },
          { path: "viagens-cadastradas", element: <ViagensCadastradas /> },
          { path: "viagens-cadastradas/novo", element: <CadastrarViagem /> },
          {
            path: "viagens-cadastradas/editar/:id",
            element: <CadastrarViagem />,
          },
          { path: "hoteis", element: <HotelLista /> },
          { path: "hoteis/novo", element: <RegistrarHotel /> },
          { path: "hoteis/editar/:id", element: <RegistrarHotel /> },
          { path: "transportes", element: <TransporteLista /> },
          { path: "transportes/novo", element: <RegistrarTransporte /> },
          { path: "transportes/editar/:id", element: <RegistrarTransporte /> },
          { path: "pacotes-foto", element: <PacotesFotoLista /> },
          { path: "pacotes-foto/novo", element: <RegistrarPacoteFoto /> },
          { path: "pacotes-foto/editar/:id", element: <RegistrarPacoteFoto /> },
          { path: ROUTES.LISTAR_USUARIOS, element: <Validar /> },
        ],
      },
    ],
  },
  {
    path: ROUTES.LOGIN,
    element: <Login />,
  },
  {
    path: ROUTES.SIGNUP,
    element: <Cadastro />,
  },
  {
    path: "*",
    element: (
      <div className="text-center p-10">404 - Página não encontrada</div>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
