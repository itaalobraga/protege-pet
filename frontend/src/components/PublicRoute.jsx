import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function PublicRoute({ children }) {
  const { usuario, loading } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/usuarios";

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  if (usuario) {
    return <Navigate to={from} replace />;
  }

  return children;
}

export default PublicRoute;
