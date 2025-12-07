import { Container } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import NavBar from "../NavBar/NavBar.jsx";
import "./header.css";

function Header() {
  const location = useLocation();
  const path = location.pathname;

  const isActive = (modulo) => path.startsWith(`/${modulo}`);

  const getLinkClass = (modulo) => {
    const base = "text-decoration-none fw-semibold small menu-link";
    return isActive(modulo)
      ? `${base} menu-link-ativo`
      : `${base} text-secondary`;
  };

  return (
    <header>
      <NavBar />
      <nav className="py-3 border-bottom">
        <Container className="d-flex justify-content-center gap-4">
          <Link
            to="/usuarios"
            className={getLinkClass("usuarios")}
            tabIndex={0}
            aria-label="Ir para módulo de Usuários"
          >
            USUÁRIOS
          </Link>
          <Link
            to="/voluntarios"
            className={getLinkClass("voluntarios")}
            tabIndex={0}
            aria-label="Ir para módulo de Voluntários"
          >
            VOLUNTÁRIOS
          </Link>
          <Link
            to="/veterinarios"
            className={getLinkClass("veterinarios")}
            tabIndex={0}
            aria-label="Ir para módulo de Veterinários"
          >
            VETERINÁRIOS
          </Link>
          <Link
            to="/animais"
            className={getLinkClass("animais")}
            tabIndex={0}
            aria-label="Ir para módulo de Animais"
          >
            ANIMAIS
          </Link>
          <Link
            to="/produtos"
            className={getLinkClass("produtos")}
            tabIndex={0}
            aria-label="Ir para módulo de Produtos"
          >
            PRODUTOS
          </Link>
        </Container>
      </nav>
    </header>
  );
}

export default Header;
