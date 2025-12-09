import { useState, useRef, useEffect } from "react";
import { Container } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import NavBar from "../NavBar/NavBar.jsx";
import "./header.css";

function Header() {
  const location = useLocation();
  const path = location.pathname;
  const [usuariosOpen, setUsuariosOpen] = useState(false);
  const [animaisOpen, setAnimaisOpen] = useState(false);
  const dropdownRef = useRef(null);
  const animaisDropdownRef = useRef(null);
  const isActive = (modulo) => path.startsWith(`/${modulo}`);
  const isUsuariosActive = isActive("usuarios") || isActive("funcoes");
  const isAnimaisActive = isActive("animais") || isActive("racas");
  const getLinkClass = (modulo) => {
    const base = "text-decoration-none fw-semibold small menu-link";
    return isActive(modulo)
      ? `${base} menu-link-ativo`
      : `${base} text-secondary`;
  };

  const getDropdownToggleClass = (isActiveParent) => {
    const base = "text-decoration-none fw-semibold small menu-link dropdown-toggle-custom";
    return isActiveParent
      ? `${base} menu-link-ativo`
      : `${base} text-secondary`;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUsuariosOpen(false);
      }
      if (animaisDropdownRef.current && !animaisDropdownRef.current.contains(event.target)) {
        setAnimaisOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setUsuariosOpen(false);
    setAnimaisOpen(false);
  }, [path]);

  return (
    <header>
      <NavBar />
      <nav className="py-3 border-bottom">
        <Container className="d-flex justify-content-center gap-4">

          <div className="dropdown-container" ref={dropdownRef}>
            <button
              className={getDropdownToggleClass(isUsuariosActive)}
              onClick={() => setUsuariosOpen(!usuariosOpen)}
              aria-expanded={usuariosOpen}
              aria-haspopup="true"
            >
              USUÁRIOS <i className={`bi bi-chevron-${usuariosOpen ? "up" : "down"} ms-1`}></i>
            </button>
            {usuariosOpen && (
              <div className="dropdown-menu-custom">
                <Link
                  to="/usuarios"
                  className={`dropdown-item-custom ${isActive("usuarios") ? "active" : ""}`}
                >
                  <i className="bi bi-people me-2"></i>
                  Gerenciar Usuários
                </Link>
                <Link
                  to="/funcoes"
                  className={`dropdown-item-custom ${isActive("funcoes") ? "active" : ""}`}
                >
                  <i className="bi bi-shield-lock me-2"></i>
                  Gerenciar Funções
                </Link>
              </div>
            )}
          </div>

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

          <div className="dropdown-container" ref={animaisDropdownRef}>
            <button
              className={getDropdownToggleClass(isAnimaisActive)}
              onClick={() => setAnimaisOpen(!animaisOpen)}
              aria-expanded={animaisOpen}
              aria-haspopup="true"
            >
              ANIMAIS <i className={`bi bi-chevron-${animaisOpen ? "up" : "down"} ms-1`}></i>
            </button>
            {animaisOpen && (
              <div className="dropdown-menu-custom">
                <Link
                  to="/animais"
                  className={`dropdown-item-custom ${isActive("animais") ? "active" : ""}`}
                >
                  <i className="bi bi-heart me-2"></i>
                  Gerenciar Animais
                </Link>
                <Link
                  to="/racas"
                  className={`dropdown-item-custom ${isActive("racas") ? "active" : ""}`}
                >
                  <i className="bi bi-tags me-2"></i>
                  Gerenciar Raças
                </Link>
              </div>
            )}
          </div>

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
