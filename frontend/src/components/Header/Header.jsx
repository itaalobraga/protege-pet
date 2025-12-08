import { useState, useRef, useEffect } from "react";
import { Container } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import NavBar from "../NavBar/NavBar.jsx";
import "./header.css";

function Header() {
  const location = useLocation();
  const path = location.pathname;

  const [usuariosOpen, setUsuariosOpen] = useState(false);
  const [produtosOpen, setProdutosOpen] = useState(false);

  const dropdownRefUsuarios = useRef(null);
  const dropdownRefProdutos = useRef(null);

  const isActive = (modulo) => path.startsWith(`/${modulo}`);
  const isUsuariosActive = isActive("usuarios") || isActive("funcoes");
  const isProdutosActive = isActive("produtos") || isActive("categorias");

  const getLinkClass = (modulo) => {
    const base = "text-decoration-none fw-semibold small menu-link";
    return isActive(modulo)
      ? `${base} menu-link-ativo`
      : `${base} text-secondary`;
  };

  const getDropdownToggleClass = (isModuloAtivo) => {
    const base =
      "text-decoration-none fw-semibold small menu-link dropdown-toggle-custom";
    return isModuloAtivo
      ? `${base} menu-link-ativo`
      : `${base} text-secondary`;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRefUsuarios.current &&
        !dropdownRefUsuarios.current.contains(event.target)
      ) {
        setUsuariosOpen(false);
      }

      if (
        dropdownRefProdutos.current &&
        !dropdownRefProdutos.current.contains(event.target)
      ) {
        setProdutosOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setUsuariosOpen(false);
    setProdutosOpen(false);
  }, [path]);

  return (
    <header>
      <NavBar />
      <nav className="py-3 border-bottom">
        <Container className="d-flex justify-content-center gap-4">
          <div className="dropdown-container" ref={dropdownRefUsuarios}>
            <button
              type="button"
              className={getDropdownToggleClass(isUsuariosActive)}
              onClick={() => setUsuariosOpen((prev) => !prev)}
            >
              USUÁRIOS{" "}
              <i
                className={`bi bi-chevron-${
                  usuariosOpen ? "up" : "down"
                } ms-1`}
              ></i>
            </button>
            {usuariosOpen && (
              <div className="dropdown-menu-custom">
                <Link
                  to="/usuarios"
                  className={`dropdown-item-custom ${
                    isActive("usuarios") ? "active" : ""
                  }`}
                >
                  <i className="bi bi-people me-2"></i>
                  Gerenciar Usuários
                </Link>
                <Link
                  to="/funcoes"
                  className={`dropdown-item-custom ${
                    isActive("funcoes") ? "active" : ""
                  }`}
                >
                  <i className="bi bi-shield-lock me-2"></i>
                  Gerenciar Funções
                </Link>
              </div>
            )}
          </div>

          <Link to="/voluntarios" className={getLinkClass("voluntarios")}>
            VOLUNTÁRIOS
          </Link>

          <Link to="/veterinarios" className={getLinkClass("veterinarios")}>
            VETERINÁRIOS
          </Link>

          <Link to="/animais" className={getLinkClass("animais")}>
            ANIMAIS
          </Link>

          <div className="dropdown-container" ref={dropdownRefProdutos}>
            <button
              type="button"
              className={getDropdownToggleClass(isProdutosActive)}
              onClick={() => setProdutosOpen((prev) => !prev)}
            >
              PRODUTOS
              <i
                className={`bi bi-chevron-${
                  produtosOpen ? "up" : "down"
                } ms-1`}
              ></i>
            </button>

            {produtosOpen && (
              <div className="dropdown-menu-custom">
                <Link
                  to="/produtos"
                  className={`dropdown-item-custom ${
                    isActive("produtos") ? "active" : ""
                  }`}
                  onClick={() => setProdutosOpen(false)}
                >
                  Gerenciar produtos
                </Link>
                <Link
                  to="/categorias"
                  className={`dropdown-item-custom ${
                    isActive("categorias") ? "active" : ""
                  }`}
                  onClick={() => setProdutosOpen(false)}
                >
                  Gerenciar categorias
                </Link>
              </div>
            )}
          </div>
        </Container>
      </nav>
    </header>
  );
}

export default Header;
