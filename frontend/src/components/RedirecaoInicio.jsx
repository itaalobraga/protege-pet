import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ROTAS_INICIO, possuiPermissao } from "../utils/permissoes";
import AcessoNegado from "../pages/AcessoNegado/AcessoNegado";

function RedirecaoInicio() {
  const { usuario } = useAuth();

  for (const { permissao, path } of ROTAS_INICIO) {
    if (possuiPermissao(usuario, permissao)) {
      return <Navigate to={path} replace />;
    }
  }

  return <AcessoNegado />;
}

export default RedirecaoInicio;
