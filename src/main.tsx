import { BrowserRouter, Route, Routes } from "react-router-dom";

import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App";

import '@/index.css'
import AuthPage from "./pages/AuthPage";
import ContactPage from "./pages/ContactPage";
import LandingPage from "./pages/LandingPage";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<LandingPage />} />
            <Route path="/Contato" element={<ContactPage />} />
          </Route> 
          <Route path="/login" element={<AuthPage />} /> 
          <Route path="/Cadastro" element={<AuthPage />} />
        </Routes>
    </BrowserRouter>  
  </React.StrictMode>
);
