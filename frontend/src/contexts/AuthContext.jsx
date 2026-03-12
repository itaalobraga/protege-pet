import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../services/ApiService";
import { AuthContext } from "./authContextStore";

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function checkAuth() {
    try {
      const data = await ApiService.get("/auth/me");
      setUsuario(data);
      return true;
    } catch {
      setUsuario(null);
      return false;
    } finally {
      setLoading(false);
    }
  }

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
  }, []);

  useEffect(() => {
    const handle401 = () => {
      logout();
      navigate("/login", { state: { sessionExpired: true }, replace: true });
    };
    window.addEventListener("auth:401", handle401);
    return () => window.removeEventListener("auth:401", handle401);
  }, [navigate]);

  const value = { usuario, loading, checkAuth, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
