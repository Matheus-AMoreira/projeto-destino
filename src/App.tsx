import NavBar from "@/components/NavBar";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";
import { useSession } from "./store/sessionStore";
import { useEffect } from "react";

export default function App() {
  const checkSession = useSession((state) => state.checkSession);

  useEffect(() => {
    checkSession();
  }, []);
  return (
    <>
      <NavBar />
      <Outlet />
      <Footer />
    </>
  );
}
