import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ApiService from "../services/ApiService";
import { AuthContext } from "./authContextStore";

const ROTAS_PUBLICAS = ["/login", "/esqueci-senha", "/resetar-senha"];

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const checkAuth = useCallback(async () => {
    const rotaPublica = ROTAS_PUBLICAS.includes(location.pathname);
    if (rotaPublica) {
      setLoading(false);
      return false;
    }
    setLoading(true);
    try {
      const data = await ApiService.get("/auth/me");
      setUsuario(data);
      return true;
    } catch (error) {
      setUsuario(null);
      if (error?.status === 401) {
        navigate("/login", { state: { sessionExpired: true }, replace: true });
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, [location.pathname, navigate]);

  async function logout() {
    try {
      await ApiService.post("/auth/logout");
    } catch {
      /* ignore */
    }
    setUsuario(null);
  }

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const value = { usuario, loading, checkAuth, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
