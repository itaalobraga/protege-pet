import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { possuiPermissao } from "../utils/permissoes";

function RotaComPermissao({ permissao }) {
  const { usuario } = useAuth();

  if (!possuiPermissao(usuario, permissao)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default RotaComPermissao;
