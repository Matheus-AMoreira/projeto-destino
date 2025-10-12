import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import CampoInput from "@/components/auth/CampoInput";

export default function AuthPage() {
  let navigate = useNavigate();
  
  const location = useLocation();
  const isLogin = location.pathname === '/login'; 

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState(""); 

  const pageTitle = isLogin ? "Conecte-se" : "Cadastre-se";
  const buttonText = isLogin ? "Entrar" : "Cadastrar";

  const switchText = isLogin ? "Não tem conta?" : "Já tem conta?";
  const switchLinkPath = isLogin ? "/cadastro" : "/login";
  const switchLinkText = isLogin ? "Cadastre-se" : "Fazer login";

  const buttonClasses = isLogin 
    ? "bg-[#2071b3] hover:bg-[#1a5b8e]"
    : "bg-[#ff7300] hover:bg-[#cc5c00]";

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!isLogin && senha !== confirmar) {
      alert("As senhas não coincidem!");
      return;
    }
    
    if (isLogin) {
      alert(`Login com:\nEmail: ${email}\nSenha: ${senha}`);
      navigate("/");
    } else {
      alert(`Usuário cadastrado:\nEmail: ${email}`);
      navigate("/login");
    }
  };

  return (
    <div className={`w-screen h-screen flex justify-center items-center bg-cover bg-center bg-fixed 
                     ${isLogin ? "bg-[url('/src/assets/fundoLogin.jpg')]" : "bg-[url('/src/assets/fundoCadastro.jpg')]"}`}>
      <div className="bg-white/95 p-10 rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.4)] w-full max-w-md text-center z-10">
        
        <h1 className="text-[#333] mb-8 text-3xl font-bold">{pageTitle}</h1>
        
        <form onSubmit={handleSubmit}>
          
          <CampoInput 
            label="E-mail" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <CampoInput 
            label="Senha" 
            type="password" 
            value={senha} 
            onChange={(e) => setSenha(e.target.value)} 
            required 
          />
          
          {!isLogin && (
            <CampoInput 
              label="Confirmar Senha" 
              type="password" 
              value={confirmar} 
              onChange={(e) => setConfirmar(e.target.value)} 
              required 
            />
          )}
          
          <button 
            type="submit" 
            className={`w-full py-3 rounded-lg cursor-pointer text-lg font-bold mt-3 transition duration-300 active:scale-[0.98] text-white ${buttonClasses}`}
          >
            {buttonText}
          </button>
        </form>

        <p className="mt-6 text-sm text-[#666]">
          {switchText}
          <Link to={switchLinkPath} className="text-[#007bff] no-underline font-bold hover:underline ml-1">
            {switchLinkText}
          </Link>
        </p>
      </div>
    </div>
  );
}